import authmiddleware from "../middleware/auth.middleware.js";
import express from "express";
import { prisma } from "../models/index.js";

const router = express.Router();

//  모든 이력서 목록 조회 API
// - 이력서 ID, 이력서 제목, 자기소개, 작성자명, 이력서 상태, 작성 날짜 조회하기 (여러건)
//     - 작성자명을 표시하기 위해서는 이력서 테이블과 사용자 테이블의 JOIN이 필요합니다.
// - 이력서 목록은 QueryString으로 order 데이터를 받아서 정렬 방식을 결정합니다.
//     - orderKey, orderValue 를 넘겨받습니다.
//     - orderValue에 들어올 수 있는 값은 ASC, DESC 두가지 값으로 대소문자 구분을 하지 않습니다.
//     - ASC는 과거순, DESC는 최신순 그리고 둘 다 해당하지 않거나 값이 없는 경우에는 최신순 정렬을 합니다.
//     - 예시 데이터 : orderKey=userId&orderValue=desc

router.get("/resumes", authmiddleware, async (req, res, next) => {
  const { userId } = req.local.user;
  const resume = await prisma.resumes.findMany({
    where: { userId: userId },
    // include: { users: true },
    select: {
      resumeId: true,
      title: true,
      content: true,

      status: true,
      createdAt: true,
    },
  });
  return res.status(200).json({ data: resume });
});

//  이력서 상세 조회 API
// - 이력서 ID, 이력서 제목, 자기소개, 작성자명, 이력서 상태, 작성 날짜 조회하기 (단건)
//     - 작성자명을 표시하기 위해서는 상품 테이블과 사용자 테이블의 JOIN이 필요합니다.

//  이력서 생성 API (✅ 인증 필요 - middleware 활용)
// - API 호출 시 이력서 제목, 자기소개 데이터를 전달 받습니다.
router.post("/resumes", authmiddleware, async (req, res, next) => {
  const { title, content } = req.body;
  const { userId } = req.local.user;
  const resume = await prisma.resumes.create({
    data: {
      userId: +userId,
      title,
      content,
    },
  });
  return res.status(201).json({ message: "이력서를 생성하였습니다." });
});

//  이력서 수정 API (✅ 인증 필요 - middleware 활용)
// - 이력서 제목, 자기소개, 이력서 상태 데이터로 넘겨 이력서 수정을 요청합니다.
// - 수정할 이력서 정보는 본인이 작성한 이력서에 대해서만 수정되어야 합니다.
// - 선택한 이력서가 존재하지 않을 경우, 이력서 조회에 실패하였습니다. 메시지를 반환합니다.

//  이력서 삭제 API (✅ 인증 필요 - middleware 활용)
// - 이력서 ID를 데이터로 넘겨 이력서를 삭제 요청합니다.
// - 본인이 생성한 이력서 데이터만 삭제되어야 합니다.
// - 선택한 이력서가 존재하지 않을 경우, 이력서 조회에 실패하였습니다. 메시지를 반환합니다.

export default router;
