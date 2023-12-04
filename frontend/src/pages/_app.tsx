import type { AppProps } from "next/app";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ja } from "date-fns/locale";
import Navbar from "../../components/Navbar";
import { AuthProvider } from "../context/auth";
import { RecoilRoot } from "recoil";
import { CssBaseline } from "@mui/material";

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
