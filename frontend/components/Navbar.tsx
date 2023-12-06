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
import { useAuth } from "../src/context/auth";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
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
        sx={{ backgroundColor: "gray" }}
      >
        <Container maxWidth="md">
          <Box className={styles.headerContainer}>
            <Box>
              {user && (
                <Typography component="h1">
                  <Link
                    className={styles.topPageLink}
                    sx={{ color: "white", textDecoration: " none" }}
                    href="/"
                  >
                    あなたの余命
                  </Link>
                </Typography>
              )}
            </Box>
            <List component="nav" className={styles.listGroup}>
              {!user ? (
                <>
                  {navLinks.map((navLink) => (
                    <ListItem disablePadding key={navLink.url}>
                      <ListItemButton
                        className={styles.listDisplay}
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
                    className={styles.listDisplay}
                    onClick={handleSignout}
                  >
                    <ListItemText primary={`サインアウト`} />
                  </ListItemButton>
                  <ListItemButton className={styles.listDisplay} href="/mypage">
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
