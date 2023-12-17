// React & Next.js
import React from "react";

// MUI
import { Box, Container, Typography } from "@mui/material";

// CSS
import styles from "../styles/common.module.css";
import BackLink from "../../components/BackLink";

const Custom404 = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box className={styles.container}>
        <Typography variant="h5" gutterBottom sx={{ margin: "1rem 0" }}>
          申し訳ありません
          <br />
          ページが見つかりません
        </Typography>
        <BackLink />
      </Box>
    </Container>
  );
};

export default Custom404;
