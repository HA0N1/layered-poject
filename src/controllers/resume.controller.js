import { ResumesService } from '../services/resume.service.js';

export class ResumesController {
  resumesService = new ResumesService();
  getResumes = async (req, res, next) => {
    try {
      const resumes = await this.resumesService.findAllResumes();
      return res.status(201).json({ data: resumes });
    } catch (err) {
      return next(err);
    }
  };
  getResumeById = async (req, res, next) => {
    try {
      const { resumeId } = req.params;

      const resume = await this.resumesService.findResumeById(resumeId);
      return res.status(201).json({ data: resume });
    } catch (err) {
      return next(err);
    }
  };
  createResume = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { title, content, status } = req.body;
      const createdResume = await this.resumesService.createResume(title, content, status, userId);
      return res.status(201).json({ data: createdResume });
    } catch (err) {
      return next(err);
    }
  };
  updateResume = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { resumeId } = req.params;
      const { title, content, status } = req.body;
      const updatedResume = await this.resumesService.updateResume(resumeId, title, content, status, userId);
      return res.status(201).json({ data: updatedResume });
    } catch (err) {
      return next(err);
    }
  };
  deleteResume = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { resumeId } = req.params;
      const deletedResume = await this.resumesService.deleteResume(resumeId, userId);
      return res.status(201).json({ data: deletedResume });
    } catch (err) {
      return next(err);
    }
  };
}
