import { UsersRepository } from '../repositories/user.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UsersService {
  usersRepository = new UsersRepository();

  createUser = async (email, clientId, password, name, grade) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await this.usersRepository.createUser(email, clientId, hashedPassword, name, grade);
    return {
      email: createdUser.email,
      clientId: createdUser.clientId,
      name: createdUser.name,
    };
  };

  loginUser = async (clientId, email, password) => {
    const loggedInUser = await this.usersRepository.loginUser(clientId, email, password);
    const accessToken = jwt.sign({ userId: loggedInUser.userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: '12h',
    });
    const refreshToken = jwt.sign({ userId: loggedInUser.userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: '7d',
    });
    return {
      clientId: loggedInUser.clientId,
      email: loggedInUser.email,
      password: loggedInUser.password,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  };
  findUserById = async (userId) => {
    const user = await this.usersRepository.findUserById(userId);
    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
    };
  };
}
