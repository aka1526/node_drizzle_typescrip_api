import { Router, RequestHandler } from "express";
import * as C from "../controllers/usersController";
import * as V from "../lib/validator-functions";
import { validateLogin, validateRegister } from '../lib/validateAuth';
import  { authenticateToken } from '../middleware/auth';
const routes = Router();

routes.get("/users/users-online", C.getUsersOnlineTotal );
routes.use(authenticateToken as RequestHandler);
routes.post("/users/user-profile/:id", validateLogin, C.UpdateProfile);
routes.get("/users/user-profile/:id", validateLogin, C.GetProfile);

export default routes;