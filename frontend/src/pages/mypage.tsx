import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../context/auth";
import apiClient from "../lib/apiClient";
import { useRouter } from "next/router";
import BackLink from "../../components/BackLink";
import PageHead from "../../components/PageHead";
import { useRecoilValue } from "recoil";
import userAtom from "../../recoil/atom/userAtoms";
import ProtectRoute from "../../components/ProtectRoute";

// CSSインポート
import styles from "../styles/common.module.css";

const MyPage = () => {
  const router = useRouter();
  const { signout } = useAuth();
  const user = useRecoilValue(userAtom);

  // アカウント情報
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string | null>("");

  // エラー表示
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
          router.push("/");
        })
        .catch((err) => {
          handleErrorResponse(err);
        });
    } catch (err) {
      alert("予期しないエラーが発生しました。\nもう一度やり直してください。");
    }
  };

  const handleErrorResponse = (err) => {
    switch (err.response.status) {
      case 500:
        alert("サーバで問題が発生しました。\nもう一度やり直してください。");
        router.push("/mypage");
        break;
      case 400:
        err.response.data.message
          ? alert(err.response.data.message)
          : setValidationErrors(err.response.data.messages);
        break;
      case 401:
        alert(err.response.data.message);
        setValidationErrors([]);
        break;
      default:
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
            signout();
            router.push("/");
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
            {validationErrors.length > 0 && (
              <Box style={{ color: "red" }}>
                <ul>
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Box>
            )}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
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

export default MyPage;
