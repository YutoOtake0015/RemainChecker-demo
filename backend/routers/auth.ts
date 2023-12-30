// modules
require("dotenv").config();
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// validators
import signupSchema from "../validators/signupSchema";
import signinSchema from "../validators/signinSchema";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    // バリデーション
    const { error, value } = signupSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ messages: error.details.map((detail) => detail.message) });
    }

    // リクエスト取得
    const { username, email, password, birthDate, sex } = value;

    // email一意確認
    const existEmail = await prisma.user.findFirst({
      where: { email },
    });
    if (existEmail) {
      return res
        .status(403)
        .json({ message: "すでに登録されたメールアドレスです" });
    }
    // 生年月日のフォーマット変換
    const birthDateAsDate = new Date(birthDate);
    const isoDate = birthDateAsDate.toISOString();

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);
    // ユーザ登録
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        persons: {
          create: {
            personName: username,
            sex,
            birthDate: isoDate,
            isAccountUser: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json({ message: "ユーザが正常に作成されました", user });
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

router.post("/createAuthToken", async (req: Request, res: Response) => {
  try {
    // バリデーション
    const { error, value } = signinSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ messages: error.details.map((detail) => detail.message) });
    }

    // リクエスト取得
    const { email, password } = value;

    // ユーザの存在確認
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "ユーザが存在しません" });
    }

    // 入力パスワードの正誤確認
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "パスワードに誤りがあります" });
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is not defined in .env file");
    }

    // 認証token生成
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).json({ token });
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
