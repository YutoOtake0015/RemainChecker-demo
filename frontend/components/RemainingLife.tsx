import { useRouter } from "next/router";
import React, { useState, useEffect, useReducer, useRef } from "react";
import apiClient from "../src/lib/apiClient";
import { Box } from "@mui/material";

const timeStyle = {
  display: "inline-block",
  textAlign: "right" as const,
};

// useReducerで管理する状態
const initialState = {
  year: undefined,
  month: undefined,
  day: undefined,
  hour: undefined,
  minute: undefined,
  second: undefined,
  isExceeded: false,
};

// useReducerで実行する関数
function timerReducer(state, action) {
  switch (action.type) {
    case "updateTime":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

type personData = {
  person: {
    // id: number;
    sex: string;
    birthDate: Date;
  };
};

const RemainingLife = React.memo(({ person }: personData) => {
  const router = useRouter();
  const [isExceeded, setIsExceeded] = useState<boolean>(false);
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

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

    // クリーンアップ関数
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
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

        // 状態を一括で更新
        dispatch({
          type: "updateTime",
          payload: {
            year: years,
            month: months,
            day: days,
            hour: hours,
            minute: minutes,
            second: seconds,
          },
        });

        // 残り秒数を減算
        totalSeconds -= 1;

        // インターバルIDをrefに保存
        intervalIdRef.current = countdownInterval;
      } else {
        // カウントダウンが終了したらクリア
        clearInterval(countdownInterval);
      }
    }, 1000); // 1秒ごとに更新
  };

  // 表示する値のフォーマット
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
            {formatNumber(state.year)}年
          </Box>
          <Box component="span" style={timeStyle}>
            {formatNumber(state.month)}
            ヵ月
          </Box>
          <Box component="span" style={timeStyle}>
            {formatNumber(state.day)}日
          </Box>
          <Box component="span" style={timeStyle}>
            {formatNumber(state.hour)}時間
          </Box>
          <Box component="span" style={timeStyle}>
            {formatNumber(state.minute)}分
          </Box>
          <Box component="span" style={timeStyle}>
            {formatNumber(state.second)}秒
          </Box>
        </Box>
      )}
    </>
  );
});

RemainingLife.displayName = "RemainingLife";

export default RemainingLife;
