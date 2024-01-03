// React & Next.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// state
import { useRecoilValue } from "recoil";
import userAtom from "../../../../recoil/atom/userAtoms";

// library
import apiClient from "../../../lib/apiClient";
import { handleErrorResponse } from "../../../lib/errorHandler";

// components
import BackLink from "../../../../components/BackLink";
import PageHead from "../../../../components/PageHead";
import ErrorMessageList from "../../../../components/ErrorMessageList";

// types
import { SexType } from "../../../types/type";

// hooks
import { useLoading } from "../../../hooks/useLoading";

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
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

// CSS
import styles from "../../../styles/persons/personStyle.module.css";

const PersonPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // 共有情報
  const user = useRecoilValue(userAtom);
  const [validationErrorMessages, setValidationErrorMessages] = useState([]);

  // 人物情報
  const [person, setPerson] = useState(null);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [personName, setPersonName] = useState("");
  const [sex, setSex] = useState<SexType>("");

  // ローディング状態
  const { startLoading, stopLoading } = useLoading();

  const token = "token";
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const fetchPerson = async () => {
      startLoading();
      try {
        const response = await apiClient.get(`/persons/find/${id}`);
        setPerson(response.data.person);
        setPersonName(response.data.person.personName);
        setSex(response.data.person.sex);
        setBirthDate(new Date(response.data.person.birthDate));
      } catch (error) {
        setValidationErrorMessages(["人物情報の取得に失敗しました。"]);
      } finally {
        stopLoading();
      }
    };

    if (id) {
      fetchPerson();
    }
  }, [id]);

  // 情報更新
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startLoading();
    try {
      await apiClient.post(`/persons/edit/${id}`, {
        personName,
        sex,
        birthDate,
      });
      alert("人物情報を更新しました。");
      router.push("/mypage/persons");
    } catch (error) {
      console.error("エラーが発生しました: ", error);
      setValidationErrorMessages(["人物情報の更新に失敗しました。"]);
    } finally {
      stopLoading();
    }
  };

  // 情報削除
  const handleDeletePerson = async () => {
    try {
      // 削除確認
      const confirmed = window.confirm("本当に削除しますか？");
      if (confirmed) {
        await apiClient
          .delete(`/persons/delete/${person.id}`, {
            data: { userId: user?.id },
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
      }
    } catch (err) {
      alert("予期しないエラーが発生しました\nもう一度やり直してください");
    }
  };

  // 人物情報取得まで待機
  if (!person) {
    return null;
  }

  return (
    <>
      {user && person && user.id === person.userId ? (
        <>
          <PageHead>
            <title>情報編集</title>
          </PageHead>
          <Container component="main" maxWidth="xs">
            <Box className={styles.mainContainer}>
              <Typography component="h1" variant="h5">
                情報編集
              </Typography>
              {validationErrorMessages && (
                <ErrorMessageList messages={validationErrorMessages} />
              )}
              <Box
                component="form"
                noValidate
                onSubmit={handleUpdate}
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
                        value={personName}
                        InputLabelProps={{
                          shrink: !!personName,
                        }}
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
                        value={birthDate}
                        closeOnSelect={false}
                        onChange={(e: Date | null) =>
                          setBirthDate(e as Date | null)
                        }
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
                        onChange={(e: SelectChangeEvent<SexType>) =>
                          setSex(e.target.value as SexType)
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
                  編集
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <BackLink />
              {!person.isAccountUser && (
                <Button onClick={handleDeletePerson}>削除</Button>
              )}
            </Box>
          </Container>
        </>
      ) : (
        router.back()
      )}
    </>
  );
};

export default PersonPage;
