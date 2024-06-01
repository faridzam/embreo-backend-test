import { Router } from 'express';
import { getAllVendorController } from '../controllers/companyController';
import { onlyHr } from '../middleware/authMiddleware';

const companyRoutes = Router();

companyRoutes.get('/vendor', onlyHr, getAllVendorController);

export default companyRoutes;
