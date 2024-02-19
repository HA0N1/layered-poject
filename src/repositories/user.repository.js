import { prisma } from '../../models/index.js';

export class UsersRepository {
  createUser = async (email, clientId, password, name, grade) => {
    const createdUser = await prisma.users.create({
      data: {
        email,
        clientId,
        password,
        name,
        grade,
      },
    });
    return createdUser;
  };
  loginUser = async (clientId, email, password) => {
    const loggedInUser = await prisma.users.findFirst({ where: { email }, select: { email: true } });
    return loggedInUser;
  };
  findUserById = async (userId) => {
    const user = await prisma.users.findUnique({
      where: {
        userId: +userId,
      },
    });
    return user;
  };
}
