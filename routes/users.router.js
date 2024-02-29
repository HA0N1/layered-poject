import express from 'express';
import AuthMiddleware  from '../middleware/auth.middleware.js';
import { UsersController } from '../src/controllers/user.controller.js';
import { UsersService } from '../src/services/user.service.js';
import { UsersRepository } from '../src/repositories/user.repository.js';
import dataSource from '../src/typrorm/index.js';

const router = express.Router();
const usersRepository = new UsersRepository(dataSource);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

router.post('/sign-up', usersController.createUser);
router.post('/sign-in', usersController.signInUser);
router.get('/me', AuthMiddleware, usersController.getUserById);

export default router;
