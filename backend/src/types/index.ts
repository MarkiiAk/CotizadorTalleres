export interface User {
  id: string;
  username: string;
  password: string;
  nombre: string;
  rol: 'admin' | 'empleado';
  createdAt: string;
}

export interface Cliente {
  nombre: string;
  telefono: string;
  email: string;
}

export interface Vehiculo {
  marca: string;
  modelo: string;
  año: string;
  color: string;
  placas: string;
  vin: string;
  kilometraje: string;
  nivelCombustible: number;
}

export interface Servicio {
  id: string;
  descripcion: string;
  precio: number;
}

export interface ManoObra {
  id: string;
  descripcion: string;
  horas: number;
  precioPorHora: number;
  total: number;
}

export interface Refaccion {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface Inspeccion {
  antena: boolean;
  espejosLaterales: boolean;
  espejoCentral: boolean;
  tapones: boolean;
  taponGasolina: boolean;
  radioEstereo: boolean;
  encendedor: boolean;
  gato: boolean;
  llaveRuedas: boolean;
  extintor: boolean;
  llantas: string;
  tapetes: boolean;
  herramientas: boolean;
  llantaRefaccion: boolean;
  limpiadores: boolean;
}

export interface Diagnostico {
  problema: string;
  diagnostico: string;
  observaciones: string;
}

export interface Totales {
  subtotal: number;
  iva: number;
  total: number;
}

export interface Orden {
  id: string;
  folio: string;
  estado: 'abierta' | 'cerrada';
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaCierre?: string;
  cliente: Cliente;
  vehiculo: Vehiculo;
  servicios: Servicio[];
  manoObra: ManoObra[];
  refacciones: Refaccion[];
  totales: Totales;
  inspeccion: Inspeccion;
  diagnostico: Diagnostico;
  creadoPor: string;
  modificadoPor?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface OrdenFilter {
  folio?: string;
  cliente?: string;
  placa?: string;
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface Stats {
  ordenesAbiertas: number;
  ordenesDelDia: number;
  ordenesDeLaSemana: number;
  ordenesDelMes: number;
  ingresosDelMes: number;
}
