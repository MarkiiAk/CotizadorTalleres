import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../models/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No se proporcionó token de autenticación' });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
      
      const user = await db.getUserById(decoded.userId);
      
      if (!user) {
        res.status(401).json({ error: 'Usuario no encontrado' });
        return;
      }

      req.userId = user.id;
      req.userRole = user.rol;
      next();
    } catch (jwtError) {
      res.status(401).json({ error: 'Token inválido o expirado' });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: 'Error en la autenticación' });
  }
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.userRole !== 'admin') {
    res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
    return;
  }
  next();
};
