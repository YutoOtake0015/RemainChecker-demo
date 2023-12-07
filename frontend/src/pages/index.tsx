import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Modal,
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
  const [showModal, setShowModal] = useState(false);
  const [remainingLifeKey, setRemainingLifeKey] = useState<number>(0);

  const calculateAge = (birthDate: Date) => {
    const currentDate = new Date();
    return differenceInYears(currentDate, birthDate);
  };

  const handleSetting = async () => {
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
      setShowModal(false);

      // 再作成したRemainingLifeコンポーネントのkeyを更新
      setRemainingLifeKey((prevKey) => prevKey + 1);
    } catch (err) {
      router.push("/");
    }
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
        <title>あなたの余命</title>
      </PageHead>
      <Container>
        <Box className={styles.container}>
          {user ? (
            <Button
              href="/persons"
              variant="contained"
              sx={{ marginTop: "1rem" }}
            >
              みんなの余命
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => setShowModal(true)}
              sx={{ marginTop: "1rem 0" }}
            >
              情報を設定
            </Button>
          )}
          <Box className={styles.personInfo}>
            {person && (
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
            )}
            {person && (
              <Box className={styles.remainingLifeContainer}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    fontWeight: "bold",
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
            )}
          </Box>
          {showModal && (
            <>
              <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box className={styles.modalContainer}>
                  <Box className={styles.modalStyle}>
                    <Box className={styles.modalBoxBottm}>
                      <Typography
                        variant="h6"
                        className={styles.modalTextBottom}
                      >
                        生年月日
                      </Typography>
                      <DatePicker
                        value={selectBirthDate}
                        onChange={(e: Date) => setSelectBirthDate(e as Date)}
                        maxDate={new Date()}
                        openTo="year"
                        views={["year", "month", "day"]}
                      />
                    </Box>
                    <Box className={styles.modalBoxBottm}>
                      <Typography
                        variant="h6"
                        className={styles.modalTextBottom}
                      >
                        性別
                      </Typography>
                      <Select
                        value={selectSex}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSelectSex(e.target.value as sexType)
                        }
                      >
                        <MenuItem value={"male"}>男</MenuItem>
                        <MenuItem value={"female"}>女</MenuItem>
                      </Select>
                    </Box>
                    <Button variant="contained" onClick={handleSetting}>
                      設定
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </>
          )}
        </Box>
      </Container>
    </>
  );
}
