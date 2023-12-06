import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import apiClient from "../../lib/apiClient";
import { useRouter } from "next/router";
import BackLink from "../../../components/BackLink";
import PageHead from "../../../components/PageHead";
import { useRecoilValue } from "recoil";
import userAtom from "../../../recoil/atom/userAtoms";
import ProtectRoute from "../../../components/ProtectRoute";

// CSSインポート
import styles from "../../styles/persons/createStyle.module.css";

type sexType = "male" | "female";

const CreatePersonData = () => {
  const router = useRouter();
  const user = useRecoilValue(userAtom);

  // ユーザ情報
  const [personName, setPersonName] = useState<string>();
  const [sex, setSex] = useState<sexType | "">("");
  const [birthDate, setBirthDate] = useState<Date>(null);

  // エラー表示
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // アカウント新規登録APIを実行
      await apiClient
        .post("/persons/create", {
          personName,
          birthDate,
          sex,
          userId: user.id,
        })
        .then(() => {
          router.push("/persons");
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
        router.push("/persons/create");
        break;
      case 400:
        setValidationErrors(err.response.data.messages);
        break;
      default:
        alert("予期しないエラーが発生しました。\nもう一度やり直してください。");
    }
  };

  return (
    <>
      <ProtectRoute user={user}>
        <PageHead>
          <title>余命登録</title>
        </PageHead>
        <Container component="main" maxWidth="xs">
          <Box className={styles.mainContainer}>
            <Typography component="h1" variant="h5">
              余命を登録しましょう
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
                    autoComplete="given-name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="名前"
                    autoFocus
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPersonName(e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={8}>
                  <DatePicker
                    label="生年月日"
                    onChange={(e: Date) => setBirthDate(e as Date)}
                    value={birthDate}
                    maxDate={new Date()}
                    openTo="year"
                    views={["year", "month", "day"]}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Select
                    value={sex}
                    required
                    label="性別"
                    fullWidth
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSex(e.target.value as sexType)
                    }
                  >
                    <MenuItem value={"male"}>男</MenuItem>
                    <MenuItem value={"female"}>女</MenuItem>
                  </Select>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                登録
              </Button>
            </Box>
          </Box>
          <BackLink />
        </Container>
      </ProtectRoute>
    </>
  );
};

export default CreatePersonData;
