const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
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

  // tokenの検証
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "権限がありません" });
    }

    // リクエストにユーザIDを付与
    req.userId = decoded.id;

    // エンドポイントの処理を継続
    next();
  });
}

module.exports = isAuthenticated;
