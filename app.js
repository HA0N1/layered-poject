import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import UsersRouter from "./routes/users.router.js";

dotenv.config();
const app = express();
const PORT = 3020;

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

app.use(express.json());
app.use(cookieParser());

app.use("/api", [UsersRouter]);

app.get("/", (req, res) => {
  return res.status(200).send("hello token");
});
app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
