import { AuthRepository } from '../repositories/auth.repository.js';
import jwt from 'jsonwebtoken';
export class AuthService {
  authrepository = new AuthRepository();
  refreshToken = async (refreshToken) => {
    const token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    if (!token.userId) throw new Error('q2q2');
    const rToken = await this.authrepository.refreshToken(refreshToken, token);
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
