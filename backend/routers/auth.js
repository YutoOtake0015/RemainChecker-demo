const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signupSchema = require("../validators/signupSchema");
const signinSchema = require("../validators/signinSchema");

const prisma = new PrismaClient();

router.post("/signup", async (req, res) => {
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
    return res.status(500).json({ message: err.message });
  }
});

router.post("/signin", async (req, res) => {
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

    // 認証token生成
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    // Cookieを設定
    res.cookie("auth_token", token, {
      // httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return res.status(200).json({ message: "ログイン成功" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
