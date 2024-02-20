import express from 'express';
import { ResumesController } from '../src/controllers/resume.controller.js';
import AuthMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();
const resumesController = new ResumesController();
// 이력서 조회  API
router.get('/', resumesController.getResumes);
//  이력서 상세 조회 API
router.get('/:resumeId', resumesController.getResumeById);
//  이력서 생성 API
router.post('/', AuthMiddleware, resumesController.createResume);
//  이력서 수정 API
router.patch('/:resumeId', resumesController.updateResume);
//  이력서 삭제 API
router.delete('/:resumeId', resumesController.deleteResume);

export default router;
