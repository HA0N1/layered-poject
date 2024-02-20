import express from 'express';
import { AuthController } from '../src/controllers/auth.controller.js';

const router = express.Router();
const authController = new AuthController();

router.post('/token', authController.autoLogin);
// router.post('/token', async (req, res) => {

//   const token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
//   if (!token.userId) return res.status(401).end();
//   const user = await prisma.users.findFirst({ where: { userId: token.userId } });
//   if (!user) return res.status(401).end();

//   // 리프레시 토큰 유효 => 액새크토큰, 리프레스토큰 재발급
//   const newAccessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '12h' });
//   const newRefreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });

//   return res.json({
//     accessToken: newAccessToken,
//     refreshToken: newRefreshToken,
//   });
// });

export default router;
