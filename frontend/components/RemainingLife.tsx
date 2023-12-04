import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import apiClient from "../src/lib/apiClient";
import { Box } from "@mui/material";

const timeStyle = {
  display: "inline-block",
  textAlign: "right" as const,
};

const RemainingLife = ({ person }) => {
  const router = useRouter();
  const [year, setYear] = useState<number>();
  const [month, setMonth] = useState<number>();
  const [day, setDay] = useState<number>();
  const [hour, setHour] = useState<number>();
  const [minute, setMinute] = useState<number>();
  const [second, setSecond] = useState<number>();
  const [isExceeded, setIsExceeded] = useState<boolean>(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (person) {
          // 寿命を取得
          const remainingLifeForSeconds = await getLifeSpanForSeconds(
            person.sex,
          );

          // 単位ごとに時間をセット
          setTime(remainingLifeForSeconds.remainTime);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [person]);

  const getLifeSpanForSeconds = async (sex) => {
    const fetchData = await apiClient.get("/life/lifespan", {
      params: { sex: sex, year: person.birthDate },
    });
    return fetchData.data;
  };

  const setTime: (totalSeconds: number) => void = (totalSeconds) => {
    // 年齢が寿命を超過していれば終了
    if (totalSeconds < 0) {
      setIsExceeded(true);
      return;
    }

    // 各単位の秒
    const secondsInMinute = 60;
    const secondsInHour = 60 * secondsInMinute;
    const secondsInDay = 24 * secondsInHour;
    const secondsInMonth = 30 * secondsInDay;
    const secondsInYear = 365 * secondsInDay;

    // カウントダウン処理
    const countdownInterval = setInterval(() => {
      if (totalSeconds > 0) {
        // 時間を単位ごとに算出
        const years = Math.floor(totalSeconds / secondsInYear);
        const remainingSecondsAfterYear = totalSeconds % secondsInYear;

        const months = Math.floor(remainingSecondsAfterYear / secondsInMonth);
        const remainingSecondsAfterMonth =
          remainingSecondsAfterYear % secondsInMonth;

        const days = Math.floor(remainingSecondsAfterMonth / secondsInDay);
        const remainingSecondsAfterDay =
          remainingSecondsAfterMonth % secondsInDay;

        const hours = Math.floor(remainingSecondsAfterDay / secondsInHour);
        const remainingSecondsAfterHour =
          remainingSecondsAfterDay % secondsInHour;

        const minutes = Math.floor(remainingSecondsAfterHour / secondsInMinute);
        const seconds = remainingSecondsAfterHour % secondsInMinute;

        // 状態セット
        setYear(years);
        setMonth(months);
        setDay(days);
        setHour(hours);
        setMinute(minutes);
        setSecond(seconds);

        // 残り秒数を減算
        totalSeconds -= 1;
      } else {
        // カウントダウンが終了したらクリア
        clearInterval(countdownInterval);
      }
    }, 1000); // 1秒ごとに更新
  };

  const formatNumber = (value: number): string => {
    if (!value) {
      return "00";
    }
    return value.toString().padStart(2, "0");
  };

  return (
    <>
      {isExceeded ? (
        <Box>無限の可能性が広がっています</Box>
      ) : (
        <Box sx={{ display: "flex", textAlign: "center" }}>
          <Box component="span" style={timeStyle}>
            {formatNumber(year)}年
          </Box>
          <Box component="span" style={timeStyle}>
            {formatNumber(month)}
            ヵ月
          </Box>
          <Box component="span" style={timeStyle}>
            {formatNumber(day)}日
          </Box>
          <Box component="span" style={timeStyle}>
            {formatNumber(hour)}時間
          </Box>
          <Box component="span" style={timeStyle}>
            {formatNumber(minute)}分
          </Box>
          <Box component="span" style={timeStyle}>
            {formatNumber(second)}秒
          </Box>
        </Box>
      )}
    </>
  );
};

export default RemainingLife;
