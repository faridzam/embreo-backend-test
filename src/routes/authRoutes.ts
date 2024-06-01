import { Router } from 'express';
import { checkAuth, login } from '../controllers/authController';

const authRoutes = Router();

authRoutes.post('/login', login);
authRoutes.get('/check', checkAuth);

export default authRoutes;
