// modules
require("dotenv").config();
import cors from "cors";
import express from "express";

// routes
import lifeRoute from "./routers/life";
import authRoute from "./routers/auth";
import usersRoute from "./routers/users";
import personsRoute from "./routers/persons";

const app = express();

// ポート番号
const PORT = process.env.PORT || 10000;

// cors設定
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
};

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use("/api/life", lifeRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/persons", personsRoute);

app.listen(PORT);
