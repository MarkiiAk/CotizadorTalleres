import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../models/database.js';
import { AuthRequest } from '../middleware/auth.js';
import { Orden } from '../types/index.js';

export const getOrdenes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ordenes = await db.getOrdenes();
    res.json(ordenes);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
};

export const getOrdenById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const orden = await db.getOrdenById(id as string);

    if (!orden) {
      res.status(404).json({ error: 'Orden no encontrada' });
      return;
    }

    res.json(orden);
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
};

export const searchOrdenes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { folio, cliente, placa, estado, fechaDesde, fechaHasta } = req.query;

    const filters = {
      folio: folio as string | undefined,
      cliente: cliente as string | undefined,
      placa: placa as string | undefined,
      estado: estado as string | undefined,
      fechaDesde: fechaDesde as string | undefined,
      fechaHasta: fechaHasta as string | undefined,
    };

    const ordenes = await db.searchOrdenes(filters);
    res.json(ordenes);
  } catch (error) {
    console.error('Error al buscar órdenes:', error);
    res.status(500).json({ error: 'Error al buscar las órdenes' });
  }
};

export const createOrden = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const folio = await db.getNextFolio();
    
    const nuevaOrden: Orden = {
      id: uuidv4(),
      folio,
      estado: 'abierta',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      creadoPor: req.userId,
      ...req.body,
    };

    const orden = await db.createOrden(nuevaOrden);
    res.status(201).json(orden);
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

export const updateOrden = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!req.userId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const ordenActualizada = await db.updateOrden(id as string, {
      ...req.body,
      modificadoPor: req.userId,
    });

    if (!ordenActualizada) {
      res.status(404).json({ error: 'Orden no encontrada' });
      return;
    }

    res.json(ordenActualizada);
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    res.status(500).json({ error: 'Error al actualizar la orden' });
  }
};

export const deleteOrden = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const eliminada = await db.deleteOrden(id as string);

    if (!eliminada) {
      res.status(404).json({ error: 'Orden no encontrada' });
      return;
    }

    res.json({ message: 'Orden eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar orden:', error);
    res.status(500).json({ error: 'Error al eliminar la orden' });
  }
};

export const getStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats = await db.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener las estadísticas' });
  }
};

export const updateEstado = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['abierta', 'en_proceso', 'cerrada', 'cancelada'].includes(estado)) {
      res.status(400).json({ error: 'Estado inválido' });
      return;
    }

    const updateData: Partial<Orden> = {
      estado,
      modificadoPor: req.userId,
    };

    if (estado === 'cerrada') {
      updateData.fechaCierre = new Date().toISOString();
    }

    const ordenActualizada = await db.updateOrden(id as string, updateData);

    if (!ordenActualizada) {
      res.status(404).json({ error: 'Orden no encontrada' });
      return;
    }

    res.json(ordenActualizada);
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
};
