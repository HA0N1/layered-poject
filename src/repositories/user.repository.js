import dataSource from '../typrorm/index.js';

export class UsersRepository {
  createUser = async (email, clientId, password, name, grade) => {
    const createdUser = await dataSource.getRepository('users').insert({
      email,
      clientId,
      password,
      name,
      grade
  });
    return createdUser;
  };
  loginUser = async (clientId, email, password) => {
    const loggedInUser = await dataSource.getRepository('users').findOne({
      where: { email },
      select: { email: true, userId: true, clientId: true },
    });
    return loggedInUser;
  };
  findUserById = async (userId) => {
    const user =  await dataSource.getRepository('users').findOne({
      where: {
        userId: +userId,
      },
    });
    return user;
  };
  findUserByEmail = async (email) => {
    const emailuser =  await dataSource.getRepository('users').findOne({
      where: {
        email
      },
    })
    return emailuser;
  };
}
