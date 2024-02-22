import dataSource from '../typrorm/index.js';
export class ResumesRepository {

  findAllResumes = async () => {
    const resumes = await dataSource.getRepository('resumes').find();
    return resumes;
  };
  findResumeById = async (resumeId) => {
    // const resume = await this.prisma.resumes.findUnique({
    //   where: { resumeId: +resumeId },
    // });
    const resume = await dataSource.getRepository('resumes').findOne({
      where: { resumeId: +resumeId },
    });

    return resume;
  };
  createResume = async (title, content, status, userId) => {
    const createdResume = await dataSource.getRepository('resumes').insert({
        title,
        content,
        status,
        userId: +userId,
    });
    return createdResume;
  };
  updateResume = async (resumeId, title, content, status, userId) => {
    const updatedResume = await dataSource.getRepository('resumes').update(
      resumeId,
     {
      title,
      content,
      status,
      userId}
    );
    return updatedResume;
  };
  deleteResume = async (resumeId) => {
    const deletedResume = await dataSource.getRepository('resumes').delete({
      resumeId,
    });
    return deletedResume;
  };
}
