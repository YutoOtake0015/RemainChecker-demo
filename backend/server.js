require("dotenv").config();
const cors = require("cors");
const express = require("express");
const lifeRoute = require("./routers/life");
const authRoute = require("./routers/auth");
const usersRoute = require("./routers/users");
const personsRoute = require("./routers/persons");

const app = express();

// ポート番号
const PORT = process.env.PORT || 10000;

// cors設定
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use("/api/life", lifeRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/persons", personsRoute);

app.listen(PORT);
