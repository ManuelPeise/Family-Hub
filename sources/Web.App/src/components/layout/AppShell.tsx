import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import MuiTypography from "@mui/material/Typography";
import React from "react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MenuIcon } from "src/components/layout/icons";
import type { NavItem } from "src/components/layout/types/NavItem";
import NotificationContainer from "src/components/layout/Notification";
import UserAppBarMenu from "src/components/user/UserAppBarMenu";

interface IProps {
  appName: string;
  navItems: NavItem[];
  menuLabel: string;
  navigationLabel: string;
  logoutLabel: string;
  children: React.ReactNode;
}

/** Frame for all pages after login: app bar on top, navigation in a drawer behind the menu button. */
const AppShell: React.FC<IProps> = ({
  appName,
  navItems,
  menuLabel,
  navigationLabel,
  children,
}) => {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label={menuLabel}
            aria-controls="main-navigation"
            aria-expanded={drawerOpen}
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            <MenuIcon />
          </IconButton>

          <MuiTypography variant="h6" component="span" sx={{ flexGrow: 1 }}>
            {appName}
          </MuiTypography>

          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", minWidth: 0 }}
          >
            <NotificationContainer />
            <UserAppBarMenu />
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        id="main-navigation"
        anchor="left"
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
        slotProps={{ paper: { sx: { width: "85vw", maxWidth: 280 } } }}
      >
        <Toolbar>
          <MuiTypography variant="h6" component="span">
            {appName}
          </MuiTypography>
        </Toolbar>
        <List component="nav" aria-label={navigationLabel} sx={{ px: 1 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              selected={pathname === item.to}
              onClick={() => {
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flex: 1, px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 5 } }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppShell;
