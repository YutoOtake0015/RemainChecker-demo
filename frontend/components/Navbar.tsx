import {
  AppBar,
  Box,
  Container,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import React, { useState } from "react";
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

  const [open, setOpen] = useState<boolean>(false);

  const user = useRecoilValue(userAtom);

  // メニューの切り替え
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const router = useRouter();

  const handleSignout = () => {
    router.push("/signin");
    signout();
  };

  return (
    <AppBar
      component="header"
      position="static"
      sx={{ backgroundColor: "#87CEEB", width: "100%" }}
    >
      <Container maxWidth="md">
        <Box className={styles.headerContainer}>
          <Box component="h1">
            <Link href="/">
              <Image
                src="/logo.png"
                width={180}
                height={40}
                alt="RemainChecker"
              />
            </Link>
          </Box>
          <List component="nav" className={styles.listGroup}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleDrawerOpen}
                sx={{
                  whiteSpace: "nowrap",
                  color: "#333333",
                  display: { xs: "block", md: "none" },
                }}
              >
                <ListItemText primary={<MenuIcon />} />
              </ListItemButton>
            </ListItem>
            {!user ? (
              <>
                {navLinks.map((navLink) => (
                  <ListItem disablePadding key={navLink.url}>
                    <ListItemButton
                      sx={{
                        whiteSpace: "nowrap",
                        color: "#333333",
                        display: { xs: "none", md: "block" },
                      }}
                      href={navLink.url}
                    >
                      <ListItemText primary={navLink.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            ) : (
              <ListItem
                disablePadding
                sx={{ display: { xs: "none", md: "block" } }}
              >
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
        <Drawer
          anchor="right"
          open={open}
          onClose={handleDrawerClose}
          PaperProps={{ style: { width: "100%" } }}
        >
          <Box sx={{ p: 2 }} onClick={handleDrawerClose}>
            <IconButton>
              <CloseIcon />
            </IconButton>
          </Box>
          {!user ? (
            <>
              {navLinks.map((navLink) => (
                <ListItem
                  disablePadding
                  key={navLink.url}
                  sx={{
                    whiteSpace: "nowrap",
                    color: "#333333",
                    display: "block",
                    justifyContent: "normal",
                  }}
                >
                  <ListItemButton href={navLink.url}>
                    <ListItemText primary={navLink.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          ) : (
            <>
              <ListItem
                disablePadding
                sx={{
                  whiteSpace: "nowrap",
                  color: "#333333",
                  display: "block",
                  justifyContent: "normal",
                }}
              >
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
            </>
          )}
        </Drawer>
      </Container>
    </AppBar>
  );
};

export default Navbar;
