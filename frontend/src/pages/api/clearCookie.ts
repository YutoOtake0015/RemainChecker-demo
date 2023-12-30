// React & Next.js
import { NextApiRequest, NextApiResponse } from "next";

// modules
import { destroyCookie } from "nookies";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    // メソッドを確認
    if (req.method !== "GET") {
      return res
        .status(403)
        .json({ message: "GETメソッドでリクエストを送信してください" });
    }

    res.setHeader(
      "Set-Cookie",
      "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict",
    );

    return res.status(200).json({ message: "Cookie削除成功" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
