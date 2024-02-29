import { AuthService } from '../../../src/services/auth.service';
import { UsersRepository } from '../../../src/repositories/user.repository';
import jwt from 'jsonwebtoken';
import { expect } from '@jest/globals';

let authService = new AuthService();
let usersRepository = new UsersRepository();
jest.mock('jsonwebtoken')
jest.mock('../../../src/repositories/user.repository')

describe('AuthService Unit Test', () => {
  describe('AccessToken인증', () => {
    test('AccessToken이 정상 인증', async () => {
        jwt.verify.mockReturnValue({
            userId:1,
        })
        usersRepository.findUserById.mockResolveValueOnce({
            userId:1,
            name: '이름'
        })
        const accessToken = 'testToken';
      const result = await authService.verifyAccessToken(accessToken);
    expect(result).toBeDefined()
    expect(result.userId).toBe(1) 
    });
    test('AccessToken이 실패', async () => {});
  });
});