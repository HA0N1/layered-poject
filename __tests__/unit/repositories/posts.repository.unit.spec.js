// __tests__/unit/posts.repository.unit.spec.js

import { jest } from '@jest/globals';
import { ResumesRepository } from '../../../src/repositories/resume.repository.js';
import { expect } from '@jest/globals';

// Prisma 클라이언트에서는 아래 5개의 메서드만 사용합니다.
let mockPrisma = {
  resumes: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let resumesRepository = new ResumesRepository(mockPrisma);

describe('resumes Repository Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('findAllResumes Method', async () => {
    const mockReturn = 'findMany String';
    mockPrisma.resumes.findMany.mockReturnValue(mockReturn);
    // reposifory의 findAllResumes 호출 . 비교해야 되니까!
    const resumes = await resumesRepository.findAllResumes();
    // reposifory 메서드 호출 횟수
    expect(resumesRepository.prisma.resumes.findMany).toHaveBeenCalledTimes(1);
    // 일치 여부
    expect(resumes).toBe(mockReturn);
  });

  test('createResume Method', async () => {
    const mockReturn = 'createResume String';
    mockPrisma.resumes.create.mockReturnValue(mockReturn);
    const createResumeParams = {
      title: 'createResumeTitle',
      content: 'createResumeContent',
      status: 'createResumeStatus',
      userId: 1,
    };
    const createResumeData = await resumesRepository.createResume(
      createResumeParams.title,
      createResumeParams.content,
      createResumeParams.status,
      createResumeParams.userId
    );
    expect(createResumeData).toBe(mockReturn);
    expect(mockPrisma.resumes.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumes.create).toHaveBeenCalledWith({
      data: createResumeParams,
    });
  });
  test('findResumeById Method', async () => {
    const mockReturn = 'findUniqueResume String';
    mockPrisma.resumes.findUnique.mockReturnValue(mockReturn);
    const findResumeByIdParams = {
      resumeId: 1,
    };
    const findResumeByIdData = await resumesRepository.findResumeById(findResumeByIdParams.resumeId);
    expect(findResumeByIdData).toBe(mockReturn);
    expect(mockPrisma.resumes.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumes.findUnique).toHaveBeenCalledWith({ where: findResumeByIdParams });
  });
  test('updateResume Method', async () => {
    const mockReturn = 'updateResume String';
    mockPrisma.resumes.update.mockReturnValue(mockReturn);
    const updatedResumeParams = {
      title: 'updateResumeTitle',
      content: 'updateResumeContent',
      status: 'updateResumeStatus',
      userId: 1,
      resumeId: 1,
    };
    const updatedResumeData = await resumesRepository.updateResume(
      updatedResumeParams.resumeId, // resumeId를 첫 번째로 전달
      updatedResumeParams.title,
      updatedResumeParams.content,
      updatedResumeParams.status,
      updatedResumeParams.userId
    );
    expect(updatedResumeData).toBe(mockReturn);
    expect(mockPrisma.resumes.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumes.update).toHaveBeenCalledWith({
      where: { resumeId: updatedResumeParams.resumeId }, // where 옵션 수정
      data: {
        title: updatedResumeParams.title,
        content: updatedResumeParams.content,
        status: updatedResumeParams.status,
        userId: updatedResumeParams.userId,
      },
    });
  });
});
test('deleteResume Method', async () => {
  const mockReturn = 'deleteResume String';
  mockPrisma.resumes.delete.mockReturnValue(mockReturn);
  const deleteResumearams = {
    resumeId: 1,
  };
  const deletedResumeData = await resumesRepository.deleteResume(deleteResumearams.resumeId);
  expect(deletedResumeData).toBe(mockReturn);
  expect(mockPrisma.resumes.delete).toHaveBeenCalledTimes(1);
  expect(mockPrisma.resumes.delete).toHaveBeenCalledWith({ where: deleteResumearams });
});
