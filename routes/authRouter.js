import { Router } from 'express';
import validateZod from '../middlewares/validateZod.js';
import { userSchema, signInSchema } from '../zod/schemas.js';
import { me, signup, signin } from '../controllers/auth.js';

const authRouter = Router();

authRouter.route('/signup').post(validateZod(userSchema), signup);

authRouter.route('/signin').post(validateZod(signInSchema), signin);

authRouter.route('/me').get(me);

export default authRouter;
