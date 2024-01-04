// React & Next.js
import React, { useState, useEffect, useReducer, useRef } from "react";
import { ClipLoader } from "react-spinners";

// library
import apiClient from "../src/lib/apiClient";

// types
import { RemainingLifeProps } from "../src/types/type";

// MUI
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

const clipStyle = {
  display: "flex",
  alignItems: "start",
  justifyContent: "center",
  height: "100vh",
};

const RemainingLife = React.memo(({ person }: RemainingLifeProps) => {
  const [isExceeded, setIsExceeded] = useState<boolean>(false);
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  // ローディング状態
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (person) {
          // 寿命を取得
          await apiClient
            .get("/life/lifespan", {
              params: { sex: person.sex, year: person.birthDate },
            })
            .then((res) => {
              // 単位ごとに時間をセット
              setTime(res.data.remainTime);
            })
            .catch((err) => {
              return "データを取得できませんでした";
            });
        } else {
          return "データを取得できませんでした";
        }
      } catch (err) {
        return "データを取得できませんでした";
      } finally {
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", textAlign: "center", ...clipStyle }}>
        <ClipLoader size={50} color={"#000000"} speedMultiplier={1} />
      </Box>
    );
  }

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
