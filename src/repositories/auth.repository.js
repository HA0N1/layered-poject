import dataSource from '../typrorm/index.js';

export class AuthRepository {

  refreshToken = async (refreshToken, token) => {
    const user =  await dataSource.getRepository('users').findOne({ where: { userId: token.userId } });
    return user;
  };
}
