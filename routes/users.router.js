import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Prisma } from "@prisma/client";
import { prisma } from "../models/index.js";
import authmiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
dotenv.config();
// 200 OK: 요청이 성공적으로 처리되었고, 요청에 대한 응답이 클라이언트에게 전송되었습니다.
// 400 Bad Request: 서버가 클라이언트의 요청을 이해할 수 없거나 유효하지 않은 요청이라고 판단했습니다.
// 401 Unauthorized: 클라이언트가 인증되지 않았거나 인증 정보가 유효하지 않아 요청을 처리할 수 없다는 것을 나타냅니다.
// 403 Forbidden: 클라이언트가 요청한 리소스에 접근할 권한이 없다는 것을 나타냅니다.
// 404 Not Found: 서버가 클라이언트의 요청에 해당하는 리소스를 찾을 수 없다는 것을 나타냅니다.

//  회원가입 API
// 1. 이메일, 비밀번호, 비밀번호 확인, 이름을 데이터로 넘겨서 회원가입을 요청합니다.
//     - 보안을 위해 비밀번호는 평문(Plain Text)으로 저장하지 않고 Hash 된 값을 저장합니다.
// 2. 아래 사항에 대한 유효성 체크를 해야 되며, 유효하지 않은 경우 알맞은 Http Status Code와 에러 메세지를 반환해야 합니다.
//     - 이메일: 다른 사용자와 중복될 수 없습니다.
//     - 비밀번호: 최소 6자 이상이며, 비밀번호 확인과 일치해야 합니다.
// 3. 회원가입 성공 시, 비밀번호를 제외 한 사용자의 정보를 반환합니다.
router.post("/sign-up", async (req, res, next) => {
  const { email, clientId, password, confirm, name, grade } = req.body;
  // const grade = req.body.grade ?? "NORMAL";
  // 카카오 로그인이 아니라면 메일과 비밀번호로 가압해야하기 때문
  if (grade && !["user", "admin"].includes(grade))
    return res.status(400).json({ message: " 등급이 올바르지 않습니다." });
  if (!clientId) {
    if (!email) return res.status(400).json({ message: "email은 필수 값 입니다." });
    if (!password) return res.status(400).json({ message: "password는 필수 값 입니다." });
    if (!confirm) return res.status(400).json({ message: "confirm은 필수 값 입니다." });

    if (password !== confirm) return res.status(400).json({ message: "비밀번호와 비밀번호 확인이 일치하지 않습니다." });
    if (password.length < 6 || confirm.length < 6)
      return res.status(400).json({ message: "비밀번호는 6자리 이상이어야합니다." });
  }
  if (!name) return res.status(400).json({ message: "name은 필수 값 입니다." });
  // clientId 검증 (카카오검증)
  if (clientId) {
    const user = await prisma.users.findFirst({
      where: {
        clientId,
      },
    });
    if (user) return res.status(400).json({ message: "이미 가입된 사용자 입니다." });
    await prisma.users.create({
      data: {
        clientId,
        name,
        grade,
      },
    });
  } else {
    // 이메일검증
    // 이메일은 유니크로 속성을 주어 유니크로 검색
    // bcrypt를 이용해 비밀번호 hash. confirm도 같아야하니 password로 주기! 10은 복잡도의 정도

    const existUser = await prisma.users.findFirst({ where: { email } });
    if (existUser) return res.status(400).json({ message: "이미 존재하는 이메일 입니다." });
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedConfirm = await bcrypt.hash(password, 10);
    await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        grade,
      },
    });
  }
  return res.status(200).json({ name });
});
// 로그인 API
// 1. 이메일, 비밀번호로 로그인을 요청합니다.
// 2. 이메일 또는 비밀번호 중 하나라도 일치하지 않는다면, 알맞은 Http Status Code와 에러 메세지를 반환해야 합니다.
// 3. 로그인 성공 시, JWT AccessToken을 생성하여 반환합니다.
//     - Access Token
//         - Payload: userId를 담고 있습니다.
//         - 유효기한: 12시간
router.post("/sign-in", async (req, res, next) => {
  const { clientId, email, password } = req.body;
  let user;
  if (clientId) {
    // 카카오 로그인
    user = await prisma.users.findFirst({
      where: {
        clientId,
      },
    });
    if (!user) return res.status(400).json({ message: "올바르지 않은 로그인 정보입니다." });
  } else {
    // req한 데이터와 db의 데이터를 비교하기 위해 비교군 생성
    if (!email) return res.status(400).json({ message: "email은 필수 값 입니다." });
    if (!password) return res.status(400).json({ message: "password는 필수 값 입니다." });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "이메일 또는 비밀번호가 일치하지 않습니다." });
    user = await prisma.users.findFirst({ where: { email, password: hashedPassword } });
    if (!user) return res.status(400).json({ message: "올바르지 않은 로그인 정보입니다." });
  }

  // user가 가지고 잇는 id로 jwt 토큰 발급
  const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "12h" });
  const refreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: "7d" });

  // authorization라는 키 값에 Bearer방식으로 jwt 토큰 할당
  // res.cookie("authorization", `Bearer ${accessToken}`);
  return res.status(200).json({ accessToken, refreshToken });
});
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
router.get("/me", authmiddleware, async (req, res, next) => {
  const user = res.locals.user;
  return res.json({ email: user.email, name: user.name });
});

export default router;
