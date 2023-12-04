import React, { ReactNode, useContext, useEffect, useState } from "react";
import apiClient from "../lib/apiClient";
import nookies from "nookies";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import { ClockLoader } from "react-spinners";
import { useSetRecoilState } from "recoil";
import userAtom from "../../recoil/atom/userAtoms";

interface AuthContextType {
  signin: (token: string) => void;
  signout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = React.createContext<AuthContextType>({
  signin: () => {},
  signout: () => {},
});

const clockStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const setUser = useSetRecoilState(userAtom);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const fetchData = async () => {
      // 認証tokenを取得
      const token = localStorage.getItem("auth_token");
      if (token) {
        apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;

        // tokenに応じたuserをセット
        try {
          const res = await apiClient.get("/users/find");
          setUser(res.data.user);
        } catch (error) {
          // tokenに応じたuserを取得できない場合、認証情報に異常がある判断してサインアウトする
          alert(
            "システムとの通信が切断されました。\nログインからやり直してください。",
          );
          token ? signout() : router.push("/");
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const signin = async (token: string) => {
    try {
      localStorage.setItem("auth_token", token);
      nookies.set(null, "auth_token", token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;

      // サインイン時、ユーザーをセット
      apiClient
        .get("/users/find")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          handleErrorResponse(err);
          signout();
          router.push("/signin");
        });
    } catch (err) {
      alert("予期しないエラーが発生しました\nもう一度やり直してください");
      signout();
    }
  };

  const handleErrorResponse = (err) => {
    switch (err.response.status) {
      case 500:
        alert("サーバで問題が発生しました\nもう一度やり直してください");
        break;
      case 404:
        alert(err.response.data.message);
        break;
      default:
        alert("予期しないエラーが発生しました\nもう一度やり直してください");
    }
  };

  const signout = () => {
    localStorage.removeItem("auth_token");
    nookies.destroy(null, "auth_token");
    delete apiClient.defaults.headers["Authorization"];
    setUser(null);
  };

  const value = {
    signin,
    signout,
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", ...clockStyle }}>
        <ClockLoader size={150} color={"#000000"} speedMultiplier={3} />
      </Box>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
