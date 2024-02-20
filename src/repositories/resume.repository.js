import { prisma } from '../../models/index.js';
export class ResumesRrository {
  findAllResumes;
  findResumeById;
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
  updateResume;
  deleteResume;
}
