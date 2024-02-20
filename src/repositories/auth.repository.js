import { prisma } from '../../models/index.js';
export class AuthRepository {
  refreshToken = async (refreshToken, token) => {
    const user = await prisma.users.findFirst({ where: { userId: token.userId } });
    return user;
  };
}
