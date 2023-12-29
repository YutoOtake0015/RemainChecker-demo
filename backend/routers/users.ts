// modules
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// middlewares
import isAuthenticated from "../middlewares/isAuthenticated";

// validators
import editUserSchema from "../validators/editUserSchema";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/find", isAuthenticated, async (req: Request, res: Response) => {
  try {
    // ユーザを取得
    const user = await prisma.user.findUnique({
      where: { id: req.body.userId },
      include: {
        persons: {
          where: {
            isAccountUser: true,
          },
        },
      },
    });

    // ユーザを取得できない場合
    if (!user) {
      return res.status(404).json({ message: "ユーザが見つかりませんでした" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        sex: user.persons[0].sex,
        birthDate: user.persons[0].birthDate,
      },
    });
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

router.post("/update", isAuthenticated, async (req: Request, res: Response) => {
  try {
    // バリデーション
    const { error, value } = editUserSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ messages: error.details.map((detail) => detail.message) });
    }

    // リクエスト取得
    const { userId, email, password } = value;

    // emailがユーザの登録しているメールアドレスであることを確認
    const existUser = await prisma.user.findFirst({
      where: {
        email,
        id: {
          not: userId,
        },
      },
    });

    if (existUser) {
      return res
        .status(400)
        .json({ message: "このemailは他のユーザが使用しています" });
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザ情報を更新
    await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(200).json({ message: "ユーザ情報を更新しました" });
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

router.delete(
  "/delete",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      // ユーザ情報取得
      const user = await prisma.user.findFirst({
        where: { id: Number(id) },
      });

      // ユーザ情報の確認
      if (!user) {
        return res
          .status(404)
          .json({ error: "アカウント情報が見つかりません" });
      }

      // idに対応するユーザ情報を削除
      await prisma.user.delete({
        where: { id: Number(id) },
      });

      res.status(200).json(user);
    } catch (err) {
      if (err instanceof Error) {
        // Errorオブジェクトの場合
        return res.status(500).json({ message: err.message });
      } else {
        // それ以外の場合
        return res.status(500).json({ message: "不明なエラーが発生しました" });
      }
    }
  }
);

export default router;
