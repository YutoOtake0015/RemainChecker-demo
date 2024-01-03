// React & Next.js
import { NextApiRequest, NextApiResponse } from "next";

// modules
import { setCookie } from "nookies";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    // メソッドを確認
    if (req.method !== "POST") {
      return res
        .status(403)
        .json({ message: "POSTメソッドでリクエストを送信してください" });
    }

    // 認証tokenの抽出
    const { token } = req.body;

    // Cookieの登録
    setCookie({ res }, "auth_token", token, {
      httpOnly: true,
      secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === "true",
      sameSite: process.env.NEXT_PUBLIC_COOKIE_SAMESITE,
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN
        ? process.env.NEXT_PUBLIC_COOKIE_DOMAIN
        : "",
    });

    return res.status(200).json({ message: "ログイン成功" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
