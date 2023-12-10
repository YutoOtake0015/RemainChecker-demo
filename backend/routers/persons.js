const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");
const createPersonSchema = require("../validators/createPersonSchema");
const editPersonSchema = require("../validators/editPersonSchema");
const getRemainTimeForSeconds = require("../functions/getRemainTimeForSecond");

const prisma = new PrismaClient();

router.get("/find/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    // idに対応する人物情報を取得
    const person = await prisma.person.findUnique({
      where: { id: Number(id) },
    });

    res.status(200).json({ person });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/findAll", isAuthenticated, async (req, res) => {
  try {
    const persons = await prisma.person.findMany({
      where: { userId: req.userId },
      select: {
        id: true,
        personName: true,
        sex: true,
        birthDate: true,
        isAccountUser: true,
      },
    });

    // クライアントで表示するプロパティを作成
    const formattedPersons = await Promise.all(
      persons.map(async (person) => {
        const remainTime = await getRemainTimeForSeconds(
          person.sex,
          person.birthDate,
        );

        return {
          id: person.id,
          name: person.personName,
          sex: person.sex,
          birthDate: person.birthDate,
          isAccountUser: person.isAccountUser,
          remainTime,
        };
      }),
    );

    res.status(200).json({ formattedPersons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/create", isAuthenticated, async (req, res) => {
  try {
    // バリデーション
    const { error, value } = createPersonSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ messages: error.details.map((detail) => detail.message) });
    }

    // リクエスト取得
    const { personName, sex, birthDate, userId } = value;

    // 人物情報登録
    await prisma.person.create({
      data: {
        personName,
        sex,
        birthDate,
        isAccountUser: false,
        userId,
      },
    });

    res.status(200).json({ message: "人物情報を登録しました" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/edit/:id", isAuthenticated, async (req, res) => {
  try {
    // バリデーション
    const { error, value } = editPersonSchema.validate(
      {
        params: req.params,
        body: req.body,
      },
      {
        abortEarly: false,
      },
    );

    if (error) {
      return res
        .status(400)
        .json({ messages: error.details.map((detail) => detail.message) });
    }

    // リクエスト取得
    const { id } = value.params;
    const { personName, sex, birthDate } = value.body;

    // idに対応する人物情報を更新
    await prisma.person.update({
      where: {
        id: Number(id),
      },
      data: {
        personName,
        sex,
        birthDate,
      },
    });

    res.status(200).json({ message: "人物情報を更新しました" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // 人物情報取得
    const person = await prisma.person.findFirst({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    });

    // 人物情報が存在しない場合
    if (!person) {
      return res
        .status(404)
        .json({ message: "選択された人物情報は存在しません" });
    }

    // 人物情報がユーザアカウントの場合
    if (person.isAccountUser) {
      return res.status(403).json({
        message:
          "ユーザアカウントは削除できません\n削除する場合はユーザ設定から操作してください",
      });
    }

    // idに対応する人物情報を削除
    await prisma.person.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({ message: "人物情報を削除しました" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
