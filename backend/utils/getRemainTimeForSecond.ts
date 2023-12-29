import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dateToSeconds = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};

const ageToSeconds = (age: number) => {
  return age * 365 * 24 * 60 * 60;
};

const getRemainTimeForSeconds = async (sex: string, birthDate: Date) => {
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

  if (!lifespan) {
    // 平均寿命を取得できなかった場合、0を返却
    // 明らかにエラーと判別できるため
    return 0;
  }

  const averageLifespan = lifespan.age;
  const averageLifespanInSeconds = ageToSeconds(averageLifespan);

  // 余命(秒)を返却
  return averageLifespanInSeconds - ageInSeconds;
};

export default getRemainTimeForSeconds;
