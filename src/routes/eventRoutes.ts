import { Router } from 'express';
import { approveEventController, createEventController, getEventController } from '../controllers/eventController';
import { authenticateToken, onlyHr, onlyVendor } from '../middleware/authMiddleware';

const eventRoutes = Router();

eventRoutes.get('/', authenticateToken, getEventController);
eventRoutes.post('/', onlyHr, createEventController);
eventRoutes.patch('/approve', onlyVendor, approveEventController);

export default eventRoutes;
