// React & Next.js
import React, { useEffect, useState } from "react";
import Link from "next/link";

// state
import { useRecoilValue } from "recoil";
import userAtom from "../../../recoil/atom/userAtoms";

// utility
import { format, differenceInYears } from "date-fns";

// components
import RemainingLife from "../../../components/RemainingLife";
import PageHead from "../../../components/PageHead";

// types
import { SexType, userProfileType } from "../../types/type";

// hooks
import { useLoading } from "../../hooks/useLoading";

// MUI
import { Box, Button, Container, Typography } from "@mui/material";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";

// CSS
import styles from "../../styles/indexStyle.module.css";

export default function Home() {
  // 共有情報
  const user = useRecoilValue(userAtom);

  // 人物情報
  const [person, setPerson] = useState<userProfileType>(null);

  // ローディング状態
  const { startLoading, stopLoading } = useLoading();

  // 年齢算出
  const calculateAge = (birthDate: Date) => {
    const currentDate = new Date();
    return differenceInYears(currentDate, birthDate);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    startLoading();
    if (!user) {
      setPerson(null);
      stopLoading();
    } else {
      setPerson({
        birthDate: new Date(user.birthDate),
        sex: user.sex as SexType,
      });
      stopLoading();
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
              <Link href="/mypage/persons" passHref>
                <Button
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
              </Link>
            </>
          )}

          {person && (
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
                  <RemainingLife person={person} />
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </>
  );
}
