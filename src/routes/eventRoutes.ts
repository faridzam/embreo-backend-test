import { Router } from 'express';
import { approveEventController, createEventController, getEventController, getEventDetailController, rejectEventController } from '../controllers/eventController';
import { authenticateToken, onlyHr, onlyVendor } from '../middleware/authMiddleware';

const eventRoutes = Router();

eventRoutes.get('/', authenticateToken, getEventController);
eventRoutes.post('/', onlyHr, createEventController);
eventRoutes.patch('/approve', onlyVendor, approveEventController);
eventRoutes.patch('/reject', onlyVendor, rejectEventController);
eventRoutes.get('/:id', authenticateToken, getEventDetailController);

export default eventRoutes;
