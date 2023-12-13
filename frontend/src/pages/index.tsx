import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import RemainingLife from "../../components/RemainingLife";
import { format, differenceInYears } from "date-fns";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import PageHead from "../../components/PageHead";
import { useRecoilValue } from "recoil";
import userAtom from "../../recoil/atom/userAtoms";
import { useRouter } from "next/router";

// CSSインポート
import styles from "../styles/indexStyle.module.css";
import Link from "next/link";

type sexType = "male" | "female";

type personType = {
  birthDate: Date;
  sex: sexType;
} | null;

export default function Home() {
  const user = useRecoilValue(userAtom);
  const router = useRouter();

  const [person, setPerson] = useState<personType>(null);
  const [selectBirthDate, setSelectBirthDate] = useState<Date | null>(null);
  const [selectSex, setSelectSex] = useState<sexType | "">("");
  const [remainingLifeKey, setRemainingLifeKey] = useState<number>(0);

  const calculateAge = (birthDate: Date) => {
    const currentDate = new Date();
    return differenceInYears(currentDate, birthDate);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!selectBirthDate || !selectSex) {
        return alert("情報を設定してください");
      }

      // バリデーション
      const currentDate = new Date(new Date().toDateString());
      const minBirthDate = new Date(new Date("1900-01-01").toDateString());

      // 生年月日：形式確認
      if (isNaN(selectBirthDate.getTime())) {
        return alert("正しい生年月日を入力してください");
      }

      // 生年月日：範囲確認
      const sanitizedBirthDate = new Date(selectBirthDate.toDateString()); // 比較のために時刻をクリア
      if (
        sanitizedBirthDate < minBirthDate ||
        currentDate < sanitizedBirthDate
      ) {
        return alert("生年月日が範囲外です（1900年1月1日〜本日）");
      }

      // 性別：値確認
      if (selectSex !== "male" && selectSex !== "female") {
        return alert("性別を選択してください（maleまたはfemale）");
      }

      setPerson({
        birthDate: selectBirthDate,
        sex: selectSex,
      });

      // 初期化
      setSelectBirthDate(null);
      setSelectSex("");

      // 再作成したRemainingLifeコンポーネントのkeyを更新
      setRemainingLifeKey((prevKey) => prevKey + 1);
    } catch (err) {
      router.push("/");
    }
  };

  const handleReset = () => {
    setSelectBirthDate(null);
    setSelectSex("");
    setPerson(null);
    setRemainingLifeKey(0);
  };

  useEffect(() => {
    if (!user) {
      setPerson(null);
    } else {
      setPerson({
        birthDate: new Date(user.birthDate),
        sex: user.sex as sexType,
      });
    }
  }, [user]);

  return (
    <>
      <PageHead>
        <title>RemainChecker</title>
      </PageHead>
      <Container>
        <Box className={styles.container}>
          {user && (
            <>
              <Button
                href="/persons"
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#1565C0",
                  color: "#FFFFFF",
                  margin: "1rem 0",
                }}
              >
                みんなの余命
              </Button>
            </>
          )}

          {!user && person && (
            <>
              <Link href="/" passHref>
                <Button
                  component="a"
                  onClick={handleReset}
                  variant="contained"
                  style={{ margin: "1rem 0" }}
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: "#1565C0",
                    color: "#FFFFFF",
                    margin: "1rem 0",
                  }}
                >
                  再設定
                </Button>
              </Link>
            </>
          )}

          {person ? (
            <>
              <Box className={styles.infoBox}>
                <Typography variant="subtitle1">
                  <Box component="span" className={styles.infoText}>
                    {format(person.birthDate, "yyyy年MM月dd日")}
                  </Box>
                  生まれ
                </Typography>
                <Typography variant="h5">
                  <Box component="span" className={styles.infoText}>
                    {calculateAge(person.birthDate)}歳
                  </Box>
                  の{person.sex === "male" ? "男性" : "女性"}
                </Typography>
              </Box>
              <Box className={styles.remainingLifeContainer}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    // widthが600px以下でアイコンとテキストを縦表示
                    "@media screen and (max-width:600px)": {
                      display: "flex",
                      flexDirection: "column",
                    },
                  }}
                >
                  <HistoryToggleOffIcon
                    sx={{ marginRight: "0.5rem", fontSize: "2.5rem" }}
                  />
                  あなたに残された時間
                </Typography>
                <Box className={styles.remainingLife}>
                  <RemainingLife key={remainingLifeKey} person={person} />
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box className={styles.settingContainer}>
                <Typography component="h1" variant="h5">
                  情報を設定して余命を表示しましょう
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8} sx={{ margin: "auto" }}>
                      <FormControl fullWidth>
                        <DatePicker
                          label="生年月日"
                          onChange={(e: Date) => setSelectBirthDate(e as Date)}
                          value={selectBirthDate}
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
                          value={selectSex}
                          required
                          label="性別"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSelectSex(e.target.value as sexType)
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
                    設定
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </>
  );
}
