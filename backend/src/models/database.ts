import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { User, Orden } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDENES_FILE = path.join(DATA_DIR, 'ordenes.json');

// Clase para manejar la base de datos JSON
class Database {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }

    // Inicializar archivo de usuarios si no existe
    try {
      await fs.access(USERS_FILE);
    } catch {
      const defaultPassword = await bcrypt.hash('admin123', 10);
      const defaultUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          password: defaultPassword,
          nombre: 'Administrador SAG',
          rol: 'admin',
          createdAt: new Date().toISOString()
        }
      ];
      await fs.writeFile(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
    }

    // Inicializar archivo de órdenes si no existe
    try {
      await fs.access(ORDENES_FILE);
    } catch {
      await fs.writeFile(ORDENES_FILE, JSON.stringify([], null, 2));
    }

    this.initialized = true;
  }

  // Usuarios
  async getUsers(): Promise<User[]> {
    await this.initialize();
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.username === username);
  }

  async getUserById(id: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.id === id);
  }

  async createUser(user: User): Promise<User> {
    const users = await this.getUsers();
    users.push(user);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    return user;
  }

  // Órdenes
  async getOrdenes(): Promise<Orden[]> {
    await this.initialize();
    const data = await fs.readFile(ORDENES_FILE, 'utf-8');
    return JSON.parse(data);
  }

  async getOrdenById(id: string): Promise<Orden | undefined> {
    const ordenes = await this.getOrdenes();
    return ordenes.find(o => o.id === id);
  }

  async getOrdenByFolio(folio: string): Promise<Orden | undefined> {
    const ordenes = await this.getOrdenes();
    return ordenes.find(o => o.folio === folio);
  }

  async createOrden(orden: Orden): Promise<Orden> {
    const ordenes = await this.getOrdenes();
    ordenes.push(orden);
    await fs.writeFile(ORDENES_FILE, JSON.stringify(ordenes, null, 2));
    return orden;
  }

  async updateOrden(id: string, ordenData: Partial<Orden>): Promise<Orden | null> {
    const ordenes = await this.getOrdenes();
    const index = ordenes.findIndex(o => o.id === id);
    
    if (index === -1) return null;

    ordenes[index] = {
      ...ordenes[index],
      ...ordenData,
      fechaActualizacion: new Date().toISOString()
    };

    await fs.writeFile(ORDENES_FILE, JSON.stringify(ordenes, null, 2));
    return ordenes[index];
  }

  async deleteOrden(id: string): Promise<boolean> {
    const ordenes = await this.getOrdenes();
    const filtered = ordenes.filter(o => o.id !== id);
    
    if (filtered.length === ordenes.length) return false;

    await fs.writeFile(ORDENES_FILE, JSON.stringify(filtered, null, 2));
    return true;
  }

  async searchOrdenes(filters: {
    folio?: string;
    cliente?: string;
    placa?: string;
    estado?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<Orden[]> {
    let ordenes = await this.getOrdenes();

    if (filters.folio) {
      ordenes = ordenes.filter(o => 
        o.folio.toLowerCase().includes(filters.folio!.toLowerCase())
      );
    }

    if (filters.cliente) {
      ordenes = ordenes.filter(o =>
        o.cliente.nombre.toLowerCase().includes(filters.cliente!.toLowerCase())
      );
    }

    if (filters.placa) {
      ordenes = ordenes.filter(o =>
        o.vehiculo.placas.toLowerCase().includes(filters.placa!.toLowerCase())
      );
    }

    if (filters.estado) {
      ordenes = ordenes.filter(o => o.estado === filters.estado);
    }

    if (filters.fechaDesde) {
      ordenes = ordenes.filter(o => o.fechaCreacion >= filters.fechaDesde!);
    }

    if (filters.fechaHasta) {
      ordenes = ordenes.filter(o => o.fechaCreacion <= filters.fechaHasta!);
    }

    return ordenes;
  }

  async getStats(): Promise<{
    ordenesAbiertas: number;
    ordenesDelDia: number;
    ordenesDeLaSemana: number;
    ordenesDelMes: number;
    ingresosDelMes: number;
  }> {
    const ordenes = await this.getOrdenes();
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      ordenesAbiertas: ordenes.filter(o => o.estado === 'abierta').length,
      ordenesDelDia: ordenes.filter(o => new Date(o.fechaCreacion) >= startOfDay).length,
      ordenesDeLaSemana: ordenes.filter(o => new Date(o.fechaCreacion) >= startOfWeek).length,
      ordenesDelMes: ordenes.filter(o => new Date(o.fechaCreacion) >= startOfMonth).length,
      ingresosDelMes: ordenes
        .filter(o => new Date(o.fechaCreacion) >= startOfMonth && o.estado === 'cerrada')
        .reduce((sum, o) => sum + o.totales.total, 0)
    };
  }

  async getNextFolio(): Promise<string> {
    const ordenes = await this.getOrdenes();
    const year = new Date().getFullYear();
    const ordenesDelAño = ordenes.filter(o => o.folio.startsWith(`SAG-${year}`));
    const nextNumber = ordenesDelAño.length + 1;
    return `SAG-${year}-${String(nextNumber).padStart(4, '0')}`;
  }
}

export const db = new Database();
