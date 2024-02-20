import { AuthService } from '../services/auth.service.js';
export class AuthController {
  authService = new AuthService();
  autoLogin = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const token = await this.authService.refreshToken(refreshToken);
      return res.json({ data: token });
    } catch (err) {
      next(err);
    }
  };
}
