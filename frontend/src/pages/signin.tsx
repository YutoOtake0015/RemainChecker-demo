import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import apiClient from "../lib/apiClient";
import { useRouter } from "next/router";
import { useAuth } from "../context/auth";
import PageHead from "../../components/PageHead";
import HomeLink from "../../components/HomeLink";

export default function SignIn() {
  // アカウント情報
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  // エラー表示
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const router = useRouter();

  const { signin } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // サインインAPIを実行
      await apiClient
        .post("/auth/signin", {
          email,
          password,
        })
        .then((res) => {
          const token = res.data.token;

          signin(token);
          router.push("/");
        })
        .catch((err) => {
          handleErrorResponse(err);
        });
    } catch (error) {
      alert("予期しないエラーが発生しました。\nもう一度やり直してください。");
    }
  };

  const handleErrorResponse = (err) => {
    switch (err.response.status) {
      case 500:
        alert("サーバで問題が発生しました。\nもう一度やり直してください。");
        router.push("/signin");
        break;
      case 400:
        setValidationErrors(err.response.data.messages);
        break;
      case 401:
        alert(err.response.data.message);
        setValidationErrors([]);
        break;
      default:
        alert("予期しないエラーが発生しました。\nもう一度やり直してください。");
    }
  };

  return (
    <>
      <PageHead>
        <title>ログイン</title>
      </PageHead>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            アカウントにログイン
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
              sx={{ mt: 3, mb: 2 }}
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
