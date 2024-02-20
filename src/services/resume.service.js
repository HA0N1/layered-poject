import { ResumesRrository } from '../repositories/resume.repository.js';
export class ResumesService {
  resumesRepository = new ResumesRrository();
  findAllResumes = async () => {
    const resumes = await this.resumesRepository.findAllResumes();
    return {
      resumeId: resumes.resumeId,
      title: resumes.title,
      content: resumes.content,
      status: resumes.status,
      createdAt: resumes.createdAt,
    };
  };
  findResumeById = async (resumeId, password) => {
    const resume = await this.resumesRepository.findResumeById(resumeId, password);
  };
  createResume = async (title, content, status, userId) => {
    const createdResume = await this.resumesRepository.createResume(title, content, status, userId);
    return {
      title: createdResume.title,
      content: createdResume.content,
      status: createdResume.status,
      userId: createdResume.userId,
    };
  };
  updateResume = async (resumeId, password, title, content, status) => {
    const updatedResume = await this.resumesRepository.updateResume();
  };
  deleteResume = async (resumeId, password) => {
    const deletedResume = await this.resumesRepository.deleteResume();
  };
}
