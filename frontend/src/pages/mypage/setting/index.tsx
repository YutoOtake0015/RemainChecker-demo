// React & Next.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// state
import { useRecoilState } from "recoil";
import userAtom from "../../../../recoil/atom/userAtoms";
import errMessagesAtom from "../../../../recoil/atom/errMessagesAtom";

// library
import apiClient from "../../../lib/apiClient";
import { signout } from "../../../lib/authHelpers";
import { handleErrorResponse } from "../../../lib/errorHandler";

// components
import BackLink from "../../../../components/BackLink";
import PageHead from "../../../../components/PageHead";
import ProtectRoute from "../../../../components/ProtectRoute";
import ErrorMessageList from "../../../../components/ErrorMessageList";

// MUI
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

// CSS
import styles from "../../../styles/common.module.css";

const Setting = () => {
  const router = useRouter();

  // アカウント情報
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string | null>("");

  // 共有情報
  const [user, setUser] = useRecoilState(userAtom);
  const [validationErrorMessages, setValidationErrorMessages] =
    useRecoilState(errMessagesAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiClient
        .post("/users/update", {
          id: user.id,
          email,
          password,
        })
        .then((res) => {
          alert(res.data.message);
          router.back();
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

  const handleDeleteUser = async () => {
    try {
      // 削除確認
      const confirmed = window.confirm("本当に削除しますか？");
      if (confirmed) {
        await apiClient
          .delete("/users/delete/", {
            data: {
              id: user.id,
            },
          })
          .then(() => {
            alert("ユーザアカウトを削除しました");
            signout(setUser, router);
          })
          .catch((err) => {
            if (err.response.status === 500) {
              // サーバー側での問題が発生
              alert("サーバーエラーが発生しました。");
            } else {
              // その他のエラー
              alert(err.response.data.message || "エラーが発生しました");
            }
          });
      } else {
        alert("処理を中断しました");
      }
    } catch (err) {
      alert("入力内容が正しくありません");
    }
  };

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  return (
    <>
      <ProtectRoute user={user}>
        <PageHead>
          <title>マイページ</title>
        </PageHead>
        <Container component="main" maxWidth="xs">
          <Box className={styles.mainContainer}>
            <Typography component="h1" variant="h5">
              アカウントを編集
            </Typography>
            {validationErrorMessages && (
              <ErrorMessageList messages={validationErrorMessages} />
            )}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="メールアドレス"
                      name="email"
                      autoComplete="email"
                      value={email}
                      InputLabelProps={{
                        shrink: !!email,
                      }}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="パスワード"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, color: "#FFFFFF" }}
              >
                変更
              </Button>
            </Box>
          </Box>
          <Box className={styles.optionContainer}>
            <BackLink />
            <Button onClick={handleDeleteUser}>ユーザアカウント削除</Button>
          </Box>
        </Container>
      </ProtectRoute>
    </>
  );
};

export default Setting;
