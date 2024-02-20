export class ResumesService {
  constructor(resumesRepository) {
    this.resumesRepository = resumesRepository;
  }
  findAllResumes = async () => {
    const resumes = await this.resumesRepository.findAllResumes();
    return resumes.map((resume) => {
      return {
        resumeId: resume.resumeId,
        title: resume.title,
        content: resume.content,
        status: resume.status,
        createdAt: resume.createdAt,
      };
    });
  };
  findResumeById = async (resumeId) => {
    const resume = await this.resumesRepository.findResumeById(resumeId);
    return resume;
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
  updateResume = async (resumeId, title, content, status, userId) => {
    const resume = await this.resumesRepository.findResumeById(resumeId, userId);
    if (resume.userId !== userId) throw new Error('돌아가 너 아니야');
    if (!resume) throw new Error('존재하지 않는 이력서 입니다.');
    await this.resumesRepository.updateResume(resumeId, title, content, status, userId);
    const updatedResume = await this.resumesRepository.findResumeById(resumeId);
    return {
      resumeId: updatedResume.resumeId,
      title: updatedResume.title,
      content: updatedResume.content,
      userId: updatedResume.userId,
      status: updatedResume.status,
      createdAt: updatedResume.createdAt,
    };
  };
  deleteResume = async (resumeId, userId) => {
    const resume = await this.resumesRepository.findResumeById(resumeId, userId);
    console.log('🚀 ~ ResumesService ~ deleteResume ~ resume:', resume);
    if (resume.userId !== userId) throw new Error('돌아가 너 아니야');
    await this.resumesRepository.deleteResume(resumeId, userId);
    return {
      resumeId: resume.resumeId,
      title: resume.title,
      content: resume.content,
      status: resume.status,
      createdAt: resume.createdAt,
    };
  };
}
