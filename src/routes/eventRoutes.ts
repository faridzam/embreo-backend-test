import { Router } from 'express';
import { createEventController, getEventController } from '../controllers/eventController';
import { authenticateToken, onlyHr } from '../middleware/authMiddleware';

const eventRoutes = Router();

eventRoutes.get('/', authenticateToken, getEventController);
eventRoutes.post('/', onlyHr, createEventController);

export default eventRoutes;
