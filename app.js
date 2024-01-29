import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 3020;

app.use(express.json());

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
