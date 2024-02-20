import jwt from 'jsonwebtoken';
import { prisma } from '../models/index.js';
// 1. Request Header의 Authorization 정보에서 JWT를 가져와서, 인증 된 사용자인지 확인하는 Middleware를 구현합니다.
// 2. 인증에 실패하는 경우에는 알맞은 Http Status Code와 에러 메세지를 반환 해야 합니다.
//     - Authorization에 담겨 있는 값의 형태가 표준(Authorization: Bearer <JWT Value>)과 일치하지 않는 경우
//     - JWT의 유효기한이 지난 경우
//     - JWT 검증(JWT Secret 불일치, 데이터 조작으로 인한 Signature 불일치 등)에 실패한 경우
// 3. 인증에 성공하는 경우에는 req.locals.user에 인증 된 사용자 정보를 담고, 다음 동작을 진행합니다.
export default async function (req, res, next) {
  try {
    // 헤드에서 액세스 토큰 가져오기
    const accessToken = req.headers.authorization;
    if (!accessToken) throw new Error('요청한 토큰이 존재하지 않습니다.');
    // bearer 토큰 형식인지 확인.
    // tokenType은 토큰타입인 Bearer
    const [tokenType, tokenValue] = req.headers.authorization.split(' '); // 그로스 : 들어올 때 Bearer {jwt} 형식으로 들어옴. 가운데 공백을 기준을 나누므로 " " 사용
    if (tokenType !== 'Bearer') throw new Error('토큰 타입이 일치하지 않습니다.');

    // 3. 서버에서 발급한 JWT가 맞는지 검증합니다.
    const token = jwt.verify(tokenValue, process.env.ACCESS_TOKEN_SECRET_KEY);
    // 4. JWT의 `userId`를 이용해 사용자를 조회합니다.
    // const userId = token.userId;
    // const user = await prisma.users.findFirst({ where: { userId: +userId } }); // 그로스 : 23번 코드를 날리고 where: { userId: token.userId} 가능
    const user = await prisma.users.findFirst({ where: { userId: token.userId } });
    if (!user) throw new Error('토큰 사용자가 존재하지 않습니다.');
    // 5. 로컬에 사용자 정보 할당
    // req.local = {};
    // req.local.user = user;
    // 그로스 : 5번 과정
    res.locals.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      return res.status(401).json({ message: '토큰의 유효시간이 만료되었습니다.' });
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ message: '토큰이 일치하지 않습니다.' });
    return res.status(400).json({ message: error.message });
  }
}
