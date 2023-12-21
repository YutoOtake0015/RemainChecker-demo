// React & Next.js
import { NextRouter } from "next/router";

// state
import { SetterOrUpdater } from "recoil";

// library
import apiClient from "./apiClient";
import { handleErrorResponse } from "./errorHandler";

type userType = null | {
  id: number;
  username: string;
  email: string;
  sex: string;
  birthDate: string;
};

export const fetchUser = async (
  setUser: SetterOrUpdater<userType>,
  setValidationErrorMessages: SetterOrUpdater<string[]>,
  router: NextRouter
) => {
  try {
    // サインイン時、ユーザーをセット
    apiClient
      .get("/users/find")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        handleErrorResponse(
          err,
          router,
          router.asPath,
          setValidationErrorMessages
        );
        signout(setUser, router);
      });
  } catch (err) {
    alert("予期しないエラーが発生しました\nもう一度やり直してください");
    signout(setUser, router);
  }
};

export const signout = async (setUser, router) => {
  // Cookie削除
  await apiClient.get("/auth/clearCookie");

  // ユーザ情報削除
  setUser(null);

  // ログイン画面に遷移
  router.push("/auth/signin");
};
