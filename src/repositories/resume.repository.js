import { prisma } from '../../models/index.js';
export class ResumesRepository {
  findAllResumes = async () => {
    const resumes = await prisma.resumes.findMany();
    return resumes;
  };
  findResumeById = async (resumeId) => {
    const resume = await prisma.resumes.findUnique({
      where: { resumeId: +resumeId },
    });
    return resume;
  };
  createResume = async (title, content, status, userId) => {
    const createdResume = await prisma.resumes.create({
      data: {
        title,
        content,
        status,
        users: {
          connect: {
            userId: userId,
          },
        },
      },
    });
    return createdResume;
  };
  updateResume = async (resumeId, title, content, status, userId) => {
    const updatedResume = await prisma.resumes.update({
      where: { resumeId: +resumeId },
      data: {
        title,
        content,
        status,
        users: {
          connect: {
            userId: userId,
          },
        },
      },
    });
    return updatedResume;
  };
  deleteResume = async (resumeId) => {
    const deletedResume = await prisma.resumes.delete({
      where: { resumeId: +resumeId },
    });
    return deletedResume;
  };
}
