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
    console.log("🚀 ~ ResumesService ~ createResume= ~ createdResume:", createdResume)
    return createdResume;
  };
  updateResume = async (resumeId, title, content, status, userId) => {
    const resume = await this.resumesRepository.findResumeById(resumeId);
    if (!resume) throw new Error('존재하지 않는 이력서 입니다.');
    await this.resumesRepository.updateResume(resumeId, title, content, status, userId);
    const updatedResume = await this.resumesRepository.findResumeById(resumeId);
    return updatedResume;
  };
  deleteResume = async (resumeId, userId) => {
    const resume = await this.resumesRepository.findResumeById(resumeId);
    if (!resume) throw new Error('존재하지 않는 이력서입니다.');
    if (resume.userId !== userId) throw new Error('돌아가');
    await this.resumesRepository.deleteResume(resumeId);
    return {
      resumeId: resume.resumeId,
      title: resume.title,
      content: resume.content,
      status: resume.status,
      createdAt: resume.createdAt,
    };
  };
}
