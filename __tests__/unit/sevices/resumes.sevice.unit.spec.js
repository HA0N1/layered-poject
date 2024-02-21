import { jest } from '@jest/globals';
import { ResumesService } from '../../../src/services/resume.service.js';
import { expect } from '@jest/globals';

// PostsRepository는 아래의 5개 메서드만 지원하고 있습니다.
let mockResumeRepository = {
  findAllResumes: jest.fn(),
  findResumeById: jest.fn(),
  createResume: jest.fn(),
  updateResume: jest.fn(),
  deleteResume: jest.fn(),
};

// postsService의 Repository를 Mock Repository로 의존성을 주입합니다.
let resumesService = new ResumesService(mockResumeRepository);

describe('resumes Service Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('findAllResumes Method', async () => {
    const sampleResumes = [
      {
        resumeId: 1,
        title: '제목',
        content: '내용',
        status: 'PASS',
        createdAt: '2024-02-20T15:39:52.000Z',
      },
      {
        resumeId: 2,
        title: '제목',
        content: '내용',
        status: 'PASS',
        createdAt: '2024-02-21T15:39:52.000Z',
      },
    ];
    mockResumeRepository.findAllResumes.mockReturnValue(sampleResumes);
    const allResumes = await resumesService.findAllResumes();
    expect(allResumes).toEqual(sampleResumes);
    expect(mockResumeRepository.findAllResumes).toHaveBeenCalledTimes(1);
  });

  test('deleteResume Method By Success', async () => {
    const sampleResumes = {
      resumeId: 2,
      title: '제목',
      content: '내용',
      status: 'PASS',
      createdAt: '2024-02-21T15:39:52.000Z',
    };
    mockResumeRepository.findResumeById.mockReturnValue(sampleResumes);
    const deleteResume = await resumesService.deleteResume(2);
    expect(mockResumeRepository.findResumeById).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.findResumeById).toHaveBeenCalledWith(sampleResumes.resumeId);
    expect(mockResumeRepository.deleteResume).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.deleteResume).toHaveBeenCalledWith(sampleResumes.resumeId);
    expect(deleteResume).toEqual({
      resumeId: sampleResumes.resumeId,
      title: sampleResumes.title,
      content: sampleResumes.content,
      status: sampleResumes.status,
      createdAt: sampleResumes.createdAt,
    });
  });

  test('deleteResume Method By Not Found Resume Error', async () => {
    const sampleResumes = null;
    mockResumeRepository.findResumeById.mockReturnValue(sampleResumes);
    try {
      await resumesService.deleteResume(123, 99);
    } catch (error) {
      expect(mockResumeRepository.findResumeById).toHaveBeenCalledTimes(1);
      expect(mockResumeRepository.findResumeById).toHaveBeenCalledWith(123);
      expect(error.message).toEqual('존재하지 않는 이력서입니다.');
    }
  });
  test('createResume Method By Success', async () => {
    const sampleResume = {
      resumeId: 3,
      userId: 1,
      title: '24',
      content: '두 번째 내용',
      status: 'APPLY',
      createdAt: '2024-02-21T06:28',
    };
    mockResumeRepository.createResume.mockReturnValue(sampleResume);
    const createdResume = await resumesService.createResume(
      sampleResume.title,
      sampleResume.userId,
      sampleResume.content,
      sampleResume.status
    );
    expect(mockResumeRepository.createResume).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.createResume).toHaveBeenCalledWith(
      sampleResume.title,
      sampleResume.userId,
      sampleResume.content,
      sampleResume.status
    );
    expect(createdResume).toEqual(sampleResume);
  });
  test('updateResume Method By Success', async () => {
    const sampleResume = {
      resumeId: 5,
      userId: 1,
      title: '24',
      content: '두 번째 내용',
      status: 'APPLY',
      createdAt: '2024-02-21T07:57:40.000Z',
    };
    mockResumeRepository.updateResume.mockReturnValue(sampleResume);
    const updateResume = await resumesService.updateResume(
      sampleResume.resumeId,
      sampleResume.title,
      sampleResume.content,
      sampleResume.status,
      sampleResume.userId
    );
    expect(mockResumeRepository.findResumeById).toHaveBeenCalledTimes(2);
    expect(mockResumeRepository.findResumeById).toHaveBeenCalledWith({
      resumeId: sampleResume.resumeId,
      title: sampleResume.title,
      content: sampleResume.content,
      status: sampleResume.status,
      createdAt: sampleResume.createdAt,
    });
    expect(mockResumeRepository.updateResume).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.updateResume).toHaveBeenCalledWith(sampleResume);
    expect(updateResume).toEqual(sampleResume);
  });
});
