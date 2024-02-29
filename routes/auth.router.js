import express from 'express';
import { AuthService }   from '../src/services/auth.service.js';
import { AuthRepository } from '../src/repositories/auth.repository.js';
import { AuthController } from '../src/controllers/auth.controller.js';
import {UsersRepository} from '../src/repositories/user.repository.js'
import dataSource from '../src/typrorm/index.js';
const router = express.Router();
const usersRepository =new UsersRepository()
const authRepository = new AuthRepository(dataSource);
const authService = new AuthService(authRepository, usersRepository);
const authController = new AuthController(authService);
router.post('/token',authController.autoLogin);
export default router;
