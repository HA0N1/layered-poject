export class ResumesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  findAllResumes = async () => {
    const resumes = await this.prisma.resumes.findMany();
    return resumes;
  };
  findResumeById = async (resumeId) => {
    const resume = await this.prisma.resumes.findUnique({
      where: { resumeId: +resumeId },
    });
    return resume;
  };
  createResume = async (title, content, status, userId) => {
    const createdResume = await this.prisma.resumes.create({
      data: {
        title,
        content,
        status,
        userId: +userId,
      },
    });
    return createdResume;
  };
  updateResume = async (resumeId, title, content, status, userId) => {
    const updatedResume = await this.prisma.resumes.update({
      where: { resumeId: +resumeId },
      data: {
        title,
        content,
        status,
        userId: +userId,
      },
    });
    return updatedResume;
  };
  deleteResume = async (resumeId) => {
    const deletedResume = await this.prisma.resumes.delete({
      where: { resumeId: +resumeId },
    });
    return deletedResume;
  };
}
