import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
import UsersRouter from "./routes/users.router.js";
import AuthRouter from "./routes/auth.js";
import ResumeRouter from "./routes/resume.js";

dotenv.config();
const app = express();
const PORT = 3020;

// const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
// const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser());
// 각각의 라우터 연결 해주기.
app.use("/api", [UsersRouter, ResumeRouter]);
app.use("/auth", AuthRouter);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
