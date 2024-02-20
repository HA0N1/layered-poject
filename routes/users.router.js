import express from 'express';
import { UsersController } from '../src/controllers/user.controller.js';
import AuthMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();
const usersController = new UsersController();

router.post('/sign-up', usersController.createUser);
router.post('/sign-in', usersController.signInUser);
router.get('/me', AuthMiddleware, usersController.getUserById);

export default router;
