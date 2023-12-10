const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const dateToSeconds = (date) => {
  return Math.floor(date.getTime() / 1000);
};

const ageToSeconds = (age) => {
  return age * 365 * 24 * 60 * 60;
};

const getRemainTimeForSeconds = async (sex, birthDate) => {
  // 生年月日をDate型で取得→秒に変換
  const birthDateInSeconds = dateToSeconds(birthDate);

  // 現在年月日を秒で取得
  const currentDateTimeInSeconds = Math.floor(Date.now() / 1000);

  // 年齢を秒で算出
  const ageInSeconds = currentDateTimeInSeconds - birthDateInSeconds;

  // 平均寿命を取得→秒に変換
  const currentYear = new Date().getFullYear();
  const lifespan = await prisma.averageLife.findUnique({
    where: { sex_year: { sex, year: String(currentYear - 1) } },
  });
  const averageLifespan = lifespan.age;
  const averageLifespanInSeconds = ageToSeconds(averageLifespan);

  // 余命(秒)を返却
  return averageLifespanInSeconds - ageInSeconds;
};

module.exports = getRemainTimeForSeconds;
