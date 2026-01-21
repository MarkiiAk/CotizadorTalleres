import { Router } from 'express';
import {
  getOrdenes,
  getOrdenById,
  searchOrdenes,
  createOrden,
  updateOrden,
  deleteOrden,
  getStats,
  updateEstado,
} from '../controllers/ordenesController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/stats', getStats);
router.get('/search', searchOrdenes);
router.get('/', getOrdenes);
router.get('/:id', getOrdenById);
router.post('/', createOrden);
router.put('/:id', updateOrden);
router.patch('/:id/estado', updateEstado);
router.delete('/:id', deleteOrden);

export default router;
