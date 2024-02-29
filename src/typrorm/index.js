import dotenv from 'dotenv';
import ResumeEntity from './entity/resume.entity.js';
import UserEntity from './entity/user.entity.js';
import typeorm from 'typeorm';
dotenv.config();

const dataSource = new typeorm.DataSource({
  type: 'mysql',
  host: process.env.HOST,
  port: process.env.PORT,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: false,
  entities: [ResumeEntity, UserEntity],
});

dataSource.initialize();
export default dataSource;
