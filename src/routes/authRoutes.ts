import { RequestHandler, Router } from "express";
import { login, register, refresh, logout, updateUser, getProfile } from '../controllers/authController';
import { validateLogin, validateRegister } from '../lib/validateAuth';
import  { authenticateToken } from '../middleware/auth';
const routes = Router();

// Auth routes
routes.post('/auth/register', validateRegister, register as RequestHandler   );
routes.post('/auth/login', validateLogin, login as RequestHandler);
routes.post('/auth/refresh', refresh as RequestHandler);
routes.use(authenticateToken as RequestHandler);
routes.post('/auth/update', updateUser as RequestHandler);
routes.post('/auth/profile', getProfile  as RequestHandler);
routes.post('/auth/logout', logout);

export default routes; 