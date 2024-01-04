// modules
import express, { Request, Response } from "express";

// utils
import getRemainTimeForSeconds from "../utils/getRemainTimeForSecond";

const router = express.Router();

router.get("/lifespan", async (req: Request, res: Response) => {
  try {
    const { year, sex } = req.query;
    // yearとsexの存在チェック
    if (!year || !sex) {
      return res
        .status(400)
        .json({ error: "性別と生年月日を選択してください" });
    }

    // yearとsexの型チェック
    if (typeof year !== "string" || typeof sex !== "string") {
      return res
        .status(400)
        .json({ message: "性別と生年月日を選択してください" });
    }

    // 生年月日をDate型で取得→秒に変換
    const birthDate = new Date(year);

    const remainingTimeInSeconds = await getRemainTimeForSeconds(
      sex,
      birthDate,
    );

    return res.json({ remainTime: remainingTimeInSeconds });
  } catch (err) {
    if (err instanceof Error) {
      // Errorオブジェクトの場合
      return res.status(500).json({ message: err.message });
    } else {
      // それ以外の場合
      return res.status(500).json({ message: "不明なエラーが発生しました" });
    }
  }
});

export default router;
