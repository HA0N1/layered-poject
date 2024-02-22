import {AuthService} from '../src/services/auth.service.js'
export default async function (req, res, next) {
  
const authService = new AuthService
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) throw new Error('요청한 토큰이 존재하지 않습니다.');

    const [tokenType, tokenValue] = req.headers.authorization.split(' ');
    if (tokenType !== 'Bearer') throw new Error('토큰 타입이 일치하지 않습니다.');
    const user = await authService.verifyAccessToken(tokenValue)
    console.log("🚀 ~ user:", user)

    res.locals.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      return res.status(401).json({ message: '토큰의 유효시간이 만료되었습니다.' });
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ message: '토큰이 일치하지 않습니다.' });
    return res.status(400).json({ message: error.message });
  }
}