import {
  AppBar,
  Box,
  Container,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { useAuth } from "../src/context/auth";
import userAtom from "../recoil/atom/userAtoms";

// CSSインポート
import styles from "../src/styles/components/NavbarStyle.module.css";

type navType = {
  text: string;
  url: string;
};

const navLinks: Array<navType> = [
  { text: "サインアップ", url: "/signup" },
  { text: "ログイン", url: "/signin" },
];

const Navbar = () => {
  const { signout } = useAuth();
  const user = useRecoilValue(userAtom);

  const router = useRouter();

  const handleSignout = () => {
    router.push("/signin");
    signout();
  };

  return (
    <>
      <AppBar
        component="header"
        position="static"
        sx={{ backgroundColor: "#87CEEB" }}
      >
        <Container maxWidth="md">
          <Box className={styles.headerContainer}>
            <Typography component="h1">
              <Link href="/">
                <Image
                  src="/logo.png"
                  width={180}
                  height={40}
                  alt="RemainChecker"
                />
              </Link>
            </Typography>
            <List component="nav" className={styles.listGroup}>
              {!user ? (
                <>
                  {navLinks.map((navLink) => (
                    <ListItem disablePadding key={navLink.url}>
                      <ListItemButton
                        sx={{ whiteSpace: "nowrap", color: "#333333" }}
                        href={navLink.url}
                      >
                        <ListItemText primary={navLink.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </>
              ) : (
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{ whiteSpace: "nowrap", color: "#333333" }}
                    onClick={handleSignout}
                  >
                    <ListItemText primary={`サインアウト`} />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ whiteSpace: "nowrap", color: "#333333" }}
                    href="/mypage"
                  >
                    <ListItemText primary={`ユーザ設定`} />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </Box>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
