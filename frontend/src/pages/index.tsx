import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import RemainingLife from "../../components/RemainingLife";
import { format, differenceInYears } from "date-fns";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import PageHead from "../../components/PageHead";
import { useRecoilValue } from "recoil";
import userAtom from "../../recoil/atom/userAtoms";
import { useRouter } from "next/router";

type sexType = "male" | "female";

const CenteredModalContainer = styled("div")({
  position: "fixed",
  top: "50%",
  left: "50%",
});

const modalStyle = {
  transform: "translate(-50%, -50%)",
  border: "2px solid #000",
  boxShadow: "0px 3px 5px 2px rgba(0,0,0,0.3)",
  padding: "1rem",
  backgroundColor: "rgba(255, 255, 255, 0.9)", // 半透明の背景色
  borderRadius: "10px",
};

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
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
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
            sx={{ marginTop: "1rem" }}
          >
            情報を設定
          </Button>
        )}
        <Box sx={{ marginTop: "20px" }}>
          {person && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                backgroundColor: "#f0f0f0",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <Box sx={{ marginBottom: "20px", textAlign: "center" }}>
                <Typography variant="subtitle1">
                  <Box component="span" sx={{ fontSize: "2rem" }}>
                    {format(person.birthDate, "yyyy年MM月dd日")}
                  </Box>
                  生まれ
                </Typography>
                <Typography variant="h5">
                  <Box component="span" sx={{ fontSize: "2rem" }}>
                    {calculateAge(person.birthDate)}歳
                  </Box>
                  の{person.sex === "male" ? "男性" : "女性"}
                </Typography>
              </Box>
            </Box>
          )}
          {person && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  alignItems: "center",
                }}
              >
                <HistoryToggleOffIcon
                  sx={{ marginRight: "0.5rem", fontSize: "2.5rem" }}
                />
                あなたに残された時間
              </Typography>
              <Box sx={{ fontSize: "1.5rem" }}>
                <RemainingLife key={remainingLifeKey} person={person} />
              </Box>
            </Box>
          )}
        </Box>
        {showModal && (
          <>
            <Modal open={showModal} onClose={() => setShowModal(false)}>
              <CenteredModalContainer>
                <Box sx={modalStyle}>
                  <Box sx={{ marginBottom: "10px" }}>
                    <Typography variant="h6" sx={{ marginBottom: "5px" }}>
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
                  <Box sx={{ marginBottom: "10px" }}>
                    <Typography variant="h6" sx={{ marginBottom: "5px" }}>
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
                  <Button
                    variant="contained"
                    onClick={handleSetting}
                    sx={{ marginTop: "10px" }}
                  >
                    設定
                  </Button>
                </Box>
              </CenteredModalContainer>
            </Modal>
          </>
        )}
      </Container>
    </>
  );
}
