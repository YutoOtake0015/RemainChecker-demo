// modules
require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: number;
}

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // Cookieからtokenを取得
  const tokenCookie = req.headers.cookie || "";

  // tokenCookieが'auth_token='を含む場合、分割して取得
  const token = tokenCookie.includes("auth_token=")
    ? tokenCookie.split("auth_token=")[1].split(";")[0]
    : tokenCookie;

  // tokenの存在確認
  if (!token) {
    return res.status(401).json({ message: "権限がありません" });
  }

  // JWT_SECRET_KEYの存在確認
  if (!process.env.JWT_SECRET_KEY) {
    return res.status(401).json({ message: "権限がありません" });
  }

  // tokenの検証
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err || !decoded) {
      return res.status(401).json({ message: "権限がありません" });
    }

    // decodedをDecodedToken型にキャスト
    const decodedToken = decoded as DecodedToken;
    if (!decodedToken.id) {
      return res.status(401).json({ message: "権限がありません" });
    }

    // リクエストにユーザIDを付与
    req.body.userId = decodedToken.id;

    // エンドポイントの処理を継続
    next();
  });
}

export default isAuthenticated;
