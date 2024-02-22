import jwt from 'jsonwebtoken';
import {UsersRepository} from '../repositories/user.repository.js'
export class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }
  verifyAccessToken = async (accsessToken) =>{
    const token = jwt.verify(tokenValue, process.env.ACCESS_TOKEN_SECRET_KEY);
    if (!token.userId) throw new Error('인증 정보가 올바르지 않습니다.')
    const user = await UsersRepository.findUserById(token.userId)
    if (!user) throw new Error('토큰 사용자가 존재하지 않습니다.');

    return user

  }
  refreshToken = async (refreshToken) => {
    const token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    if (!token.userId) throw new Error('인증 정보가 올바르지 않습니다.');
    const rToken = await this.authRepository.refreshToken(refreshToken, token);
    if (!rToken.userId) throw new Error('1212');
    const newAccessToken = jwt.sign({ userId: rToken.userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: '12h',
    });
    const newRefreshToken = jwt.sign({ userId: rToken.userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: '7d',
    });

    return { newAccessToken, newRefreshToken };
  };
}
