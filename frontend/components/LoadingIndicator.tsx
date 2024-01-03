// React & Next.js
import React from "react";
import { ClockLoader } from "react-spinners";

// state
import { useRecoilValue } from "recoil";
import { loadingAtom } from "../recoil/atom/loadingAtom";

// MUI
import { Box } from "@mui/material";

const clockStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
};

const LoadingIndicator = () => {
  const isLoading = useRecoilValue(loadingAtom);

  if (!isLoading) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", ...clockStyle }}>
      <ClockLoader size={150} color={"#000000"} speedMultiplier={1} />
    </Box>
  );
};

export default LoadingIndicator;
