import React from "react";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";

const BackLink = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      style={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        color: "blue",
        border: "none",
        backgroundColor: "transparent",
        cursor: "pointer",
      }}
    >
      <ArrowBackIcon style={{ marginRight: "5px" }} />
      戻る
    </Button>
  );
};

export default BackLink;
