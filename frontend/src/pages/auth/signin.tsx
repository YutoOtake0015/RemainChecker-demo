// React & Next.js
import React, { useState } from "react";
import { useRouter } from "next/router";

// state
import { useRecoilState, useSetRecoilState } from "recoil";
import errMessagesAtom from "../../../recoil/atom/errMessagesAtom";
import userAtom from "../../../recoil/atom/userAtoms";

// library
import apiClient from "../../lib/apiClient";
import { fetchUser } from "../../lib/authHelpers";
import { handleErrorResponse } from "../../lib/errorHandler";

// components
import PageHead from "../../../components/PageHead";
import HomeLink from "../../../components/HomeLink";
import ErrorMessageList from "../../../components/ErrorMessageList";

// MUI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

// CSS
import styles from "../../styles/common.module.css";

export default function SignIn() {
  const router = useRouter();

  // アカウント情報
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  // 共有情報
  const setUser = useSetRecoilState(userAtom);
  const [validationErrorMessages, setValidationErrorMessages] =
    useRecoilState(errMessagesAtom);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

  return (
    <>
      <PageHead>
        <title>ログイン</title>
      </PageHead>
      <Container component="main" maxWidth="xs">
        <Box className={styles.mainContainer}>
          <Typography component="h1" variant="h5">
            アカウントにログイン
          </Typography>
          {validationErrorMessages && (
            <ErrorMessageList messages={validationErrorMessages} />
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="メールアドレス"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="パスワード"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, color: "#FFFFFF" }}
            >
              ログイン
            </Button>
          </Box>
        </Box>
        <HomeLink />
      </Container>
    </>
  );
}
