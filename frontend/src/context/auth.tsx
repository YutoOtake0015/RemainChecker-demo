import React, { ReactNode, useEffect, useState } from "react";
import apiClient from "../lib/apiClient";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import { ClockLoader } from "react-spinners";
import { useSetRecoilState } from "recoil";
import userAtom from "../../recoil/atom/userAtoms";
import { signout } from "../lib/authHelpers";

interface AuthProviderProps {
  children: ReactNode;
}

const clockStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const setUser = useSetRecoilState(userAtom);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const fetchData = async () => {
      // 認証tokenを取得
      const token = document.cookie;

      if (Object.keys(token).length !== 0) {
        // tokenに応じたuserをセット
        try {
          const res = await apiClient.get("/users/find");
          setUser(res.data.user);
        } catch (err) {
          // tokenに応じたuserを取得できない場合、認証情報に異常がある判断してサインアウトする
          alert(
            "システムとの通信が切断されました。\nログインからやり直してください。",
          );
          token ? signout(setUser) : router.push("/");
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", ...clockStyle }}>
        <ClockLoader size={150} color={"#000000"} speedMultiplier={3} />
      </Box>
    );
  }

  return <>{children}</>;
};
