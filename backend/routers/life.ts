// modules
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const dateToSeconds = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};

const ageToSeconds = (age: number) => {
  return age * 365 * 24 * 60 * 60;
};

router.get("/lifespan", async (req: Request, res: Response) => {
  const { year, sex } = req.query;
  // yearとsexの存在チェック
  if (!year || !sex) {
    return res.status(400).json({ error: "性別と生年月日を選択してください" });
  }

  // yearとsexの型チェック
  if (typeof year !== "string" || typeof sex !== "string") {
    return res
      .status(400)
      .json({ message: "性別と生年月日を選択してください" });
  }

  // 生年月日をDate型で取得→秒に変換
  const birthDate = new Date(year);
  const birthDateInSeconds = dateToSeconds(birthDate);

  // 現在年月日を秒で取得
  const currentDateTimeInSeconds = Math.floor(Date.now() / 1000);

  // 年齢を秒で算出
  const ageInSeconds = currentDateTimeInSeconds - birthDateInSeconds;

  // 平均寿命取得
  const lifespan = await prisma.averageLife.findFirst({
    where: {
      sex: sex,
    },
    orderBy: {
      year: "desc",
    },
  });

  // 平均寿命未取得の場合、0を返却
  if (!lifespan) {
    return res.json({ remainTime: 0 });
  }

  // 平均寿命取得後、秒に変換
  const averageLifespan = lifespan.age;
  const averageLifespanInSeconds = ageToSeconds(averageLifespan);

  // 余命を秒で算出
  const remainingTimeInSeconds = averageLifespanInSeconds - ageInSeconds;

  return res.json({ remainTime: remainingTimeInSeconds });
});

export default router;
