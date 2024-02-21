export class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  refreshToken = async (refreshToken, token) => {
    const user = await this.prisma.users.findFirst({ where: { userId: token.userId } });
    return user;
  };
}
