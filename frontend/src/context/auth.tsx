// React & Next.js
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ClockLoader } from "react-spinners";

// state
import { useSetRecoilState } from "recoil";
import userAtom from "../../recoil/atom/userAtoms";

// library
import apiClient from "../lib/apiClient";
import { signout } from "../lib/authHelpers";

// types
import { userType } from "../types/type";

// MUI
import { Box } from "@mui/material";

const clockStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();

  // 共有情報
  const setUser = useSetRecoilState<userType>(userAtom);

  // ローディング状態
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const fetchData = async () => {
      if (router.pathname.startsWith("/mypage")) {
        // ユーザ認証
        await apiClient
          .get("users/find")
          .then((res) => {
            setUser(res.data.user);

            // ログイン状態でトップページに移動した場合、マイページに移動
            if (router.asPath === "/") {
              router.push("/mypage");
            }
          })
          .catch(() => {
            alert(
              "システムとの通信が切断されました。\nログインからやり直してください。"
            );
            signout(setUser, router);
          });
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
