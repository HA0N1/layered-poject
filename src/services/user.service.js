import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  createUser = async (email, clientId, password, name, grade) => {
    const user = await this.usersRepository.findUserByEmail(email)
    if (user) throw new Error('이미 존재하는 이메일입니다.');
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
