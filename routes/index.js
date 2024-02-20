import express from 'express';
import UsersRouter from './users.router.js';
import ResumeRouter from './resume.router.js';
import AuthRouter from './auth.router.js';

const router = express.Router();
router.use('/', UsersRouter);
router.use('/resumes/', ResumeRouter);
router.use('/auth/', AuthRouter);

export default router;
