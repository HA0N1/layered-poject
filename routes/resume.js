import authmiddleware from "../middleware/auth.middleware.js";
import jwt from "jsonwebtoken";
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

router.get("/resumes", async (req, res, next) => {
  // const { userId } = req.local.user;
  // const orderkey = req.query.orderkey;
  // const orderValue = req.query.orderValue;

  // 그로스 nullish 병합 연산자
  /** a가 null도 아니고 undefined도 아니라면 a ==== a ?? b === (a != null && a != undefiend) ? a : b * */
  const orderKey = req.query.orderKey ?? "resumeId"; // req.query.orderkey가 값이 없다면 resumeId을 orderKey에 넣기
  const orderValue = req.query.orderValue ?? "desc"; // req.query.orderValue가 값이 없다면 desc
  // if (orderValue && orderValue.toLowerCase() === "asc") {
  //   orderBy = {
  //     [orderKey]: "asc",
  //   };
  // } else if (orderValue && orderValue.toLowerCase() === "desc") {
  //   orderBy = {
  //     [orderKey]: "desc",
  //   };
  // } else {
  //   // orderValue가 없거나 유효하지 않은 값인 경우, 기본적으로 최신순으로 정렬
  //   orderBy = {
  //     createdAt: "desc",
  //   };
  // }
  if (!["resumeId", "status"].includes(orderKey)) {
    return res.status(400).json({ message: "orderKey가 올바르지 않습니다." });
  }
  if (!["asc", "desc"].includes(orderValue.toLowerCase())) {
    return res.status(400).json({ message: "orderValue가 올바르지 않습니다." });
  }
  const resumes = await prisma.resumes.findMany({
    select: {
      resumeId: true,
      title: true,
      content: true,
      status: true,
      users: {
        select: {
          name: true,
        },
      },
      createdAt: true,
    },
    // orderBy, // orderBy 객체를 이용하여 정렬 수행
    orderBy: [
      {
        [orderKey]: orderValue.toLowerCase(),
      },
    ],
  });
  /** 유저네임을 동일 선상에 두고 싶을 때.* */
  // resumes.forEach((resume) => {
  //   resume.name = resume.users.name;
  //   delete resume.users;
  // });
  return res.status(200).json({ data: resumes });
});
//  이력서 상세 조회 API
// - 이력서 ID, 이력서 제목, 자기소개, 작성자명, 이력서 상태, 작성 날짜 조회하기 (단건)
//     - 작성자명을 표시하기 위해서는 상품 테이블과 사용자 테이블의 JOIN이 필요합니다.
router.get("/resumes/:resumeId", authmiddleware, async (req, res, next) => {
  const resumeId = req.params.resumeId;
  if (!resumeId) {
    return res.status(400).json({ message: "resumeId는 필수값입니다" });
  }
  const resume = await prisma.resumes.findFirst({
    where: { resumeId: +resumeId },
    select: {
      resumeId: true,
      title: true,
      content: true,
      status: true,
      createdAt: true,
      users: {
        select: {
          name: true,
        },
      },
      createdAt: true,
    },
  });
  if (!resume) return res.status(404).json({ message: "존재하지 않는 이력서 입니다." });
  return res.status(200).json({ data: resume });
});

//  이력서 생성 API (✅ 인증 필요 - middleware 활용)
// - API 호출 시 이력서 제목, 자기소개 데이터를 전달 받습니다.
router.post("/resumes", authmiddleware, async (req, res, next) => {
  const user = res.locals.user;
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ message: "이력서 제목은 필수 값입니다." });
  if (!content) return res.status(400).json({ message: "이력서 내용은 필수 값입니다." });
  await prisma.resumes.create({
    data: {
      title,
      content,
      status: "APPLY",
      userId: user.userId,
    },
  });
  return res.status(201).json({ message: "이력서를 생성하였습니다." });
});

//  이력서 수정 API (✅ 인증 필요 - middleware 활용)
// - 이력서 제목, 자기소개, 이력서 상태 데이터로 넘겨 이력서 수정을 요청합니다.
// - 수정할 이력서 정보는 본인이 작성한 이력서에 대해서만 수정되어야 합니다.
// - 선택한 이력서가 존재하지 않을 경우, 이력서 조회에 실패하였습니다. 메시지를 반환합니다.
router.patch("/resumes/:resumeId", authmiddleware, async (req, res, next) => {
  const { resumeId } = req.params;
  const user = res.locals.user;
  const { title, content, status } = req.body;
  if (!resumeId) return res.status(401).json({ message: "resumeId는 필수 값 입니다." });
  if (!title) return res.status(401).json({ message: "이력서 제목은 필수 값 입니다." });
  if (!content) return res.status(401).json({ message: "이력서 내용은 필수 값 입니다." });
  if (!status) return res.status(401).json({ message: "이력서 상태는 필수 값 입니다." });
  if (!["APPLY", "DROP", "PASS", "INTERVIEW1", "INTERVIEW2", "FINAL_PASS"].includes(status))
    return res.status(401).json({ message: "올바른 상태 값이 아닙니다." });
  const resume = await prisma.resumes.findFirst({ where: { resumeId: +resumeId } });

  if (!resume) return res.status(401).json({ message: "이력서를 찾을 수 없습니다." });
  // admin이 아니거나 내 아이디가 일치 않지 않으면 이쪽으로
  if (user.grade === "user" && user.userId !== resume.userId)
    return res.status(401).json({ message: "올바르지 않은 요청입니다." });
  // 내가 작성하거나 admin이면 이쪽으로
  await prisma.resumes.update({
    data: {
      title,
      content,
      status,
    },
    where: {
      resumeId: +resumeId,
    },
  });
  return res.status(201).json({ message: "이력서를 수정하였습니다." });
});

//  이력서 삭제 API (✅ 인증 필요 - middleware 활용)
// - 이력서 ID를 데이터로 넘겨 이력서를 삭제 요청합니다.
// - 본인이 생성한 이력서 데이터만 삭제되어야 합니다.
router.delete("/resumes/:resumeId", authmiddleware, async (req, res, next) => {
  // - 선택한 이력서가 존재하지 않을 경우, 이력서 조회에 실패하였습니다. 메시지를 반환합니다.
  const user = res.locals.user;
  const resumeId = req.params.resumeId;

  if (!resumeId) return res.status(401).json({ message: "resumeId는 필수 값 입니다." });
  const resume = await prisma.resumes.findFirst({ where: { resumeId: +resumeId } });

  if (!resume) return res.status(401).json({ message: "이력서를 찾을 수 없습니다." });
  if (user.userId !== resume.userId) return res.status(401).json({ message: "올바르지 않은 요청입니다." });

  await prisma.resumes.delete({
    where: { resumeId: +resumeId },
  });
  return res.status(201).json({ message: "이력서가 삭제 되었습니다." });
});

export default router;
