// React & Next.js
import { NextRouter } from "next/router";

// state
import { SetterOrUpdater } from "recoil";

// library
import apiClient from "./apiClient";
import { handleErrorResponse } from "./errorHandler";

// types
import { errType, userType } from "../types/type";

// ユーザ情報取得関数
export const fetchUser = async (
  setUser: SetterOrUpdater<userType>,
  setValidationErrorMessages: SetterOrUpdater<errType>,
  router: NextRouter,
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
          setValidationErrorMessages,
        );
        signout(setUser, router);
      });
  } catch (err) {
    alert("予期しないエラーが発生しました\nもう一度やり直してください");
    signout(setUser, router);
  }
};

// サインイン関数
export const signin = async (
  email: string,
  password: string,
  setUser: SetterOrUpdater<userType>,
  setValidationErrorMessages: SetterOrUpdater<errType>,
  router: NextRouter,
) => {
  try {
    // サインインAPIを実行
    await apiClient
      .post("/auth/createAuthToken", {
        email,
        password,
      })
      .then(async (res) => {
        // 認証tokenを取得
        const token = res.data.token;

        // Cookieをセット
        const resSetCookie = await fetch("/api/setCookie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }).catch(() => {
          return null;
        });

        // 応答を処理
        // resSetCookieが存在しない、もしくはエラーステータスの場合
        if (!resSetCookie || resSetCookie.status !== 200) {
          throw new Error(
            resSetCookie?.statusText || "Cookieの設定に失敗しました",
          );
        }

        // userセット
        await fetchUser(setUser, setValidationErrorMessages, router);

        router.push("/mypage");
      })
      .catch((err) => {
        handleErrorResponse(
          err,
          router,
          router.asPath,
          setValidationErrorMessages,
        );
      });
  } catch (err) {
    alert("予期しないエラーが発生しました。\nもう一度やり直してください。");
  }
};

// サインアウト関数
export const signout = async (setUser, router) => {
  // Cookie削除
  await fetch("/api/clearCookie");

  // ユーザ情報削除
  setUser(null);

  // ログイン画面に遷移
  router.push("/auth/signin");
};