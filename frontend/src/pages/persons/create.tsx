// React & Next.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// state
import { useRecoilValue } from "recoil";
import userAtom from "../../../recoil/atom/userAtoms";

// library
import apiClient from "../../lib/apiClient";

// components
import BackLink from "../../../components/BackLink";
import PageHead from "../../../components/PageHead";
import ProtectRoute from "../../../components/ProtectRoute";

// MUI
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

// CSS
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

  // 登録件数を確認
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const getPersonsCount = async () => {
      await apiClient.get("/persons/findAllCount").catch((err) => {
        console.log("err: ", err);
        handleErrorResponse(err);
        router.push("/persons");
      });
    };

    getPersonsCount();
  }, []);

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
      case 403:
        console.log("通過");
        alert(err.response.data.message);
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
                  <FormControl fullWidth>
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
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={8}>
                  <FormControl fullWidth>
                    <DatePicker
                      label="生年月日"
                      onChange={(e: Date) => setBirthDate(e as Date)}
                      value={birthDate}
                      maxDate={new Date()}
                      openTo="year"
                      views={["year", "month", "day"]}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="gender">性別</InputLabel>
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
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#1565C0",
                  color: "#FFFFFF",
                }}
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
