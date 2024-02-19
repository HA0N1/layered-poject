import express from 'express';
import { UsersController } from '../src/controllers/user.controller.js';

const router = express.Router();
const usersController = new UsersController();

router.post('/sign-up', usersController.createUser);
router.post('/sign-in', usersController.signInUser);
router.get('/me/:userId', usersController.getUserById);

// 로그인 API

// router.post('/sign-in', async (req, res, next) => {
//   const { clientId, email, password } = req.body;
//   let user;
//   if (clientId) {
//     // 카카오 로그인
//     user = await prisma.users.findFirst({
//       where: {
//         clientId,
//       },
//     });
//     if (!user) return res.status(400).json({ message: '올바르지 않은 로그인 정보입니다.' });
//   } else {
//     // req한 데이터와 db의 데이터를 비교하기 위해 비교군 생성
//     if (!email) return res.status(400).json({ message: 'email은 필수 값 입니다.' });
//     if (!password) return res.status(400).json({ message: 'password는 필수 값 입니다.' });
//     if (!(await bcrypt.compare(password, user.password)))
//       return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
//     user = await prisma.users.findFirst({ where: { email, password: hashedPassword } });
//     if (!user) return res.status(400).json({ message: '올바르지 않은 로그인 정보입니다.' });
//   }

//   // user가 가지고 잇는 id로 jwt 토큰 발급
//   const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '12h' });
//   const refreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });

//   // authorization라는 키 값에 Bearer방식으로 jwt 토큰 할당
//   // res.cookie("authorization", `Bearer ${accessToken}`);
//   return res.status(200).json({ accessToken, refreshToken });
// });
// router.get('/me', authmiddleware, async (req, res, next) => {
//   const user = res.locals.user;
//   return res.json({ email: user.email, name: user.name });
// });

export default router;
