import React from "react";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";

const HomeLink = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/")}
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
      トップページへ
    </Button>
  );
};

export default HomeLink;
