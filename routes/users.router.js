import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authMiddleware from "../middleware/auth.middleware.js";
import { prisma } from "../models/index.js";

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
  const { email, password, confirm, name } = req.body;
  // 이메일은 유니크로 속성을 주어 유니크로 검색
  const existUser = await prisma.users.findUnique({ where: { email } });
  if (existUser) return res.status(400).json({ message: "이미 존재하는 이메일 입니다." });
  if (password !== confirm) return res.status(400).json({ message: "비밀번호와 비밀번호 확인이 일치하지 않습니다." });
  if (password.length < 6 || confirm.length < 6)
    return res.status(400).json({ message: "비밀번호는 6자리 이상이어야합니다." });
  // bcrypt를 이용해 비밀번호 hash. confirm도 같아야하니 password로 주기! 10은 복잡도의 정도
  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedConfirm = await bcrypt.hash(password, 10);
  // 유저를 users 테이블에 추가해주기. 대신 비밀번호는 쉿! 비밀이야
  const user = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      confirm: hashedConfirm,
      name,
    },
  });
  return res.status(200).json({ data: { email, name } });
});
// 로그인 API
// 1. 이메일, 비밀번호로 로그인을 요청합니다.
// 2. 이메일 또는 비밀번호 중 하나라도 일치하지 않는다면, 알맞은 Http Status Code와 에러 메세지를 반환해야 합니다.
// 3. 로그인 성공 시, JWT AccessToken을 생성하여 반환합니다.
//     - Access Token
//         - Payload: userId를 담고 있습니다.
//         - 유효기한: 12시간
router.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;
  // req한 데이터와 db의 데이터를 비교하기 위해 비교군 생성
  const user = await prisma.users.findFirst({ where: { email } });
  //bcrypt.compare 앞과 뒷값을 비교 후  T/F 불리언타입으로 반환. 불일치일때 오류 발생해야하니까 !사용
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "이메일 또는 비밀번호가 일치하지 않습니다." });
  // user가 가지고 잇는 id로 jwt 토큰 발급
  const accessToken = jwt.sign({ userId: user.userId }, process.env.CUSTOM_SECRET_KEY, { expiresIn: "12h" });
  // authorization라는 키 값에 Bearer방식으로 jwt 토큰 할당
  res.cookie("authorization", `Bearer ${accessToken}`);
  return res.status(200).json({ accessToken: accessToken });
});

export default router;
