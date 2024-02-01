import jwt from "jsonwebtoken";
import { prisma } from "../models/index.js";
// - 인증 필요 API 호출 시 **Request Header**의 ****Authorization 값으로 **JWT**를 함께 넘겨줘야 합니다.
// - 인증에 실패한 경우, 알맞은 **Http Status Code**와 **로그인이 필요합니다** 라는 에러 메세지를 반환합니다.
export default async function (req, res, next) {
  try {
    // 1. 클라이언트로 부터 쿠키(Cookie)를 전달받습니다.
    const { authorization } = req.cookies;
    // 2. 쿠키(Cookie)가 Bearer 토큰 형식인지 확인합니다.
    if (!authorization) throw new Error("요청한 토큰이 존재하지 않습니다.");

    // tokenType은 토큰타입인 Bearer
    const [tokenType, token] = authorization.split(" ");
    if (tokenType !== "Bearer") throw new Error("토큰 타입이 일치하지 않습니다.");

    // 3. 서버에서 발급한 JWT가 맞는지 검증합니다.
    const decodedToken = jwt.verify(token, process.env.CUSTOM_SECRET_KEY);
    // 4. JWT의 `userId`를 이용해 사용자를 조회합니다.
    const userId = decodedToken.userId;
    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });
    if (!user) throw new Error("토큰 사용자가 존재하지 않습니다.");
    req.local = {};
    // 5. 로컬에 사용자 정보 할당
    req.local.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return res.status(401).json({ message: "토큰의 유효시간이 만료되었습니다." });
    if (error.name === "JsonWebTokenError") return res.status(401).json({ message: "토큰이 일치하지 않습니다." });
    return res.status(400).json({ message: error.message });
  }
}
