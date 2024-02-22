import express from 'express';
import dotenv from 'dotenv';
import LogMiddleware from '../middleware/log.middleware.js';
import ErrorHandlingMiddleware from '../middleware/error-handling.middleware.js';
import router from '../routes/index.js';

dotenv.config();
const app = express();
const PORT = 3020;

app.use(express.json());
app.use('/api', router);
app.use(LogMiddleware);
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
