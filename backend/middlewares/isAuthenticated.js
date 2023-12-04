const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

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
