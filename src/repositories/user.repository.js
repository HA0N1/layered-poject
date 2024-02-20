export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createUser = async (email, clientId, password, name, grade) => {
    const createdUser = await this.prisma.users.create({
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
    const loggedInUser = await this.prisma.users.findFirst({
      where: { email },
      select: { email: true, userId: true, clientId: true },
    });
    return loggedInUser;
  };
  findUserById = async (userId) => {
    const user = await this.prisma.users.findUnique({
      where: {
        userId: +userId,
      },
    });
    return user;
  };
}
