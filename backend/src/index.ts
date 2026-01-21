import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import ordenesRoutes from './routes/ordenes.js';
import { db } from './models/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3004',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Inicializar base de datos
db.initialize().then(() => {
  console.log('Base de datos inicializada');
}).catch((error) => {
  console.error('Error al inicializar base de datos:', error);
});

// Rutas
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'SAG Garage API funcionando correctamente' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ordenes', ordenesRoutes);

// Manejo de errores 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     SAG GARAGE - Sistema Backend      ║
╠════════════════════════════════════════╣
║  Servidor corriendo en puerto ${PORT}   ║
║  Modo: ${process.env.NODE_ENV || 'development'}                  ║
║  Usuario por defecto: admin           ║
║  Contraseña: admin123                 ║
╚════════════════════════════════════════╝
  `);
});
