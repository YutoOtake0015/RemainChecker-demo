// modules
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dateToSeconds = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};
const ageToSeconds = (age: number) => {
  return age * 365 * 24 * 60 * 60;
};

type getRemainTimeForSecondsType = (
  sex: string,
  birthDate: Date
) => Promise<number>;

// 余命(秒)取得関数
const getRemainTimeForSeconds: getRemainTimeForSecondsType = async (
  sex,
  birthDate
) => {
  // 生年月日をDate型で取得→秒に変換
  const birthDateInSeconds = dateToSeconds(birthDate);

  // 現在年月日を秒で取得
  const currentDateTimeInSeconds = Math.floor(Date.now() / 1000);

  // 年齢を秒で算出
  const ageInSeconds = currentDateTimeInSeconds - birthDateInSeconds;

  // 平均寿命取得
  const lifespan = await prisma.averageLife.findFirst({
    where: {
      sex: sex,
    },
    orderBy: {
      year: "desc",
    },
  });

  if (!lifespan) {
    // 平均寿命を取得できなかった場合、0を返却
    // 明らかにエラーと判別できるため
    return 0;
  }

  // 平均寿命取得後、秒に変換
  const averageLifespan = lifespan.age;
  const averageLifespanInSeconds = ageToSeconds(averageLifespan);

  // 余命(秒)を返却
  return averageLifespanInSeconds - ageInSeconds;
};

export default getRemainTimeForSeconds;
