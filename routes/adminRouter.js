import { Router } from 'express';
import { createUser, getUserById, getUsers, updateUser, deleteUser } from '../controllers/admin.js';
import validateZod from '../middlewares/validateZod.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import { userSchema } from '../zod/schemas.js';

const adminRouter = Router();

adminRouter
  .route('/')
  .get(verifyToken, verifyAdmin, getUsers)
  .post(verifyToken, verifyAdmin, validateZod(userSchema), createUser);
adminRouter
  .route('/:id')
  .get(verifyToken, verifyAdmin, getUserById)
  .put(verifyToken, verifyAdmin, validateZod(userSchema), updateUser)
  .delete(verifyToken, verifyAdmin, deleteUser);

export default adminRouter;
