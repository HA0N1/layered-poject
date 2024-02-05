import authMiddleware from "../middleware/auth.middleware.js";
import express from "express";
import { prisma } from "../models/index.js";
const router = express.Router();
// 내 정보 조회 API (인증 필요 - 인증 Middleware 사용)
// 1. 인증에 성공했다면, **비밀번호를 제외한 내 정보**를 반환합니다.

// router.get("/user", authMiddleware, async (req, res, next) => {
//   const user = await prisma.users.findMany({
//     select: {
//       userId: true,
//       email: true,
//       name: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
//   return res.status(200).json({ data: user });
// });
// 그로스 : authMiddleware에서 local에 유저를 가져왔으니 findMany는 필요없음, RESTful하게 하기위해 주소를  me로 변경
router.get("/me", authMiddleware, async (req, res, next) => {
  const user = res.locals.user;
  return res.json({ email: user.email, name: user.name });
});
export default router;
