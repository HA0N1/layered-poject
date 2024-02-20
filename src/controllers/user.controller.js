import { UsersService } from '../services/user.service.js';
export class UsersController {
  usersService = new UsersService();
  createUser = async (req, res, next) => {
    try {
      const { email, clientId, password, name, grade } = req.body;
      const createdUser = await this.usersService.createUser(email, clientId, password, name, grade);
      return res.status(201).json({ data: createdUser });
    } catch (err) {
      next(err);
    }
  };
  signInUser = async (req, res, next) => {
    try {
      const { clientId, email, password } = req.body;
      const loginUser = await this.usersService.loginUser(clientId, email, password);
      return res.status(201).json({ data: loginUser });
    } catch (err) {
      next(err);
    }
  };
  getUserById = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      console.log('🚀 ~ UsersController ~ getUserById= ~ userId:', userId);
      const user = await this.usersService.findUserById(userId);
      if (userId !== user.userId) throw new Error('네가 아니야 돌아가');
      return res.status(201).json({ data: user });
    } catch (err) {
      next(err);
    }
  };
}
