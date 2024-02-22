import express from 'express';
import AuthMiddleware from '../middleware/auth.middleware.js'
import { ResumesController } from '../src/controllers/resume.controller.js';
import { ResumesService } from '../src/services/resume.service.js';
import { ResumesRepository } from '../src/repositories/resume.repository.js';
import dataSource from '../src/typrorm/index.js';

const router = express.Router();
const resumesRepository = new ResumesRepository(dataSource);
const resumesService = new ResumesService(resumesRepository);
const resumesController = new ResumesController(resumesService);
// 이력서 조회  API
router.get('/', resumesController.getResumes);
//  이력서 상세 조회 API
router.get('/:resumeId', resumesController.getResumeById);
//  이력서 생성 API
router.post('/', AuthMiddleware, resumesController.createResume);
//  이력서 수정 API
router.patch('/:resumeId', AuthMiddleware, resumesController.updateResume);
//  이력서 삭제 API
router.delete('/:resumeId', AuthMiddleware, resumesController.deleteResume);

export default router;
