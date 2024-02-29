export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }
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
