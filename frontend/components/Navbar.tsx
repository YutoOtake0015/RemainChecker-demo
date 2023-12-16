// React & Next.js
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// state
import { useRecoilState } from "recoil";
import userAtom from "../recoil/atom/userAtoms";

// library
import { signout } from "../src/lib/authHelpers";

// MUI
import {
  AppBar,
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";

// CSS
import styles from "../src/styles/components/NavbarStyle.module.css";

const buttonStyle = {
  whiteSpace: "nowrap",
  color: "#333333",
};

const Navbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [user, setUser] = useRecoilState(userAtom);

  // メニューの切り替え
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSignout = () => {
    signout(setUser);
    handleDrawerClose();
  };

  const handleMypage = () => {
    handleDrawerClose();
  };

  const handleSignin = () => {
    handleDrawerClose();
  };

  const handleSignup = () => {
    handleDrawerClose();
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
                  ...buttonStyle,
                  display: { xs: "block", md: "none" },
                }}
              >
                <ListItemText primary={<MenuIcon />} />
              </ListItemButton>
            </ListItem>
            {!user ? (
              <>
                <ListItem
                  disablePadding
                  sx={{ display: { xs: "none", md: "block" } }}
                >
                  <div style={{ display: "flex" }}>
                    <Link href={`/signin`} style={{ textDecoration: "none" }}>
                      <ListItemButton sx={buttonStyle}>
                        <ListItemText primary={`ログイン`} />
                      </ListItemButton>
                    </Link>
                    <Link href={`/signup`} style={{ textDecoration: "none" }}>
                      <ListItemButton sx={buttonStyle}>
                        <ListItemText primary={`サインアップ`} />
                      </ListItemButton>
                    </Link>
                  </div>
                </ListItem>
              </>
            ) : (
              <ListItem
                disablePadding
                sx={{ display: { xs: "none", md: "block" } }}
              >
                <div style={{ display: "flex" }}>
                  <Link href={`/signin`} style={{ textDecoration: "none" }}>
                    <ListItemButton sx={buttonStyle} onClick={handleSignout}>
                      <ListItemText primary={`サインアウト`} />
                    </ListItemButton>
                  </Link>
                  <Link href={`/mypage`} style={{ textDecoration: "none" }}>
                    <ListItemButton sx={buttonStyle}>
                      <ListItemText primary={`ユーザ設定`} />
                    </ListItemButton>
                  </Link>
                </div>
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
              <ListItem disablePadding sx={{ display: "block" }}>
                <Link href={`/signin`} style={{ textDecoration: "none" }}>
                  <ListItemButton sx={buttonStyle} onClick={handleSignin}>
                    <ListItemText primary={`ログイン`} />
                  </ListItemButton>
                </Link>

                <Link href={`/signup`} style={{ textDecoration: "none" }}>
                  <ListItemButton sx={buttonStyle} onClick={handleSignup}>
                    <ListItemText primary={`サインアップ`} />
                  </ListItemButton>
                </Link>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding sx={{ display: "block" }}>
                <Link href={`/signin`} style={{ textDecoration: "none" }}>
                  <ListItemButton sx={buttonStyle} onClick={handleSignout}>
                    <ListItemText primary={`サインアウト`} />
                  </ListItemButton>
                </Link>

                <Link href={`/mypage`} style={{ textDecoration: "none" }}>
                  <ListItemButton sx={buttonStyle} onClick={handleMypage}>
                    <ListItemText primary={`ユーザ設定`} />
                  </ListItemButton>
                </Link>
              </ListItem>
            </>
          )}
        </Drawer>
      </Container>
    </AppBar>
  );
};

export default Navbar;
