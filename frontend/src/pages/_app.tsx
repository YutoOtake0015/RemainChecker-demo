// React & Next.js
import React from "react";
import type { AppProps } from "next/app";

// state
import { RecoilRoot } from "recoil";
import { AuthProvider } from "../context/auth";

// utility
import { ja } from "date-fns/locale";

// components
import Navbar from "../../components/Navbar";

// MUI
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <AuthProvider>
        <Navbar />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <CssBaseline />
          <Component {...pageProps} />
        </LocalizationProvider>
      </AuthProvider>
    </RecoilRoot>
  );
}
