import { expect, jest } from '@jest/globals';
import { UsersRepository } from '../../../src/repositories/user.repository.js';
import dataSource from '../../../src/typrorm/index.js';
let usersRepository = new UsersRepository();

describe('User Repository Unit Test', () => {
  describe('userId로 사용자 조회', () => {
    test('사용자가 정상 조회', async () => {
      dataSource.getRepository = (tablename) => ({
        findOne: jest.fn(() => ({
          userId: 8,
          email: 'test11@naver.com',
          name: 'haon',
        })),
      });
      const result = await usersRepository.findUserById(8);
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('name');
      expect(result).toBeDefined();
    });
  });
  describe('email로 사용자 조회', () => {
    test('사용자가 정상 조회', async () => {
      dataSource.getRepository = (tablename) => ({
        findOne: jest.fn(() => ({
          userId: 8,
          email: 'test11@naver.com',
          name: 'haon',
        })),
      });
      const result = await usersRepository.findUserByEmail('test11@naver.com');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('name');
      expect(result).toBeDefined();
    });
  });
  describe('사용자 생성', () => {
    test('사용자가 정상적으로 생성', async () => {
      dataSource.getRepository = (tablename) => ({
        insert: jest.fn(() => ({
          insertId: 1,
        })),
      });
      const result = await usersRepository.createUser({
        email: 'a@b',
        clientId: 'c1',
        password: 'p1',
        name: 'on',
        grade: 'admin',
      });
      expect(result).toBeDefined();
    });
  });
});
