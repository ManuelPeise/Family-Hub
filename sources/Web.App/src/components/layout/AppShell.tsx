import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import MuiTypography from "@mui/material/Typography";
import React from "react";
import { useState } from "react";
import { MenuIcon } from "src/lib/utils/icons";
import type { NavItem } from "src/components/layout/types/NavItem";
import NotificationContainer from "src/components/layout/appbar/AppbarNotifications";
import UserAppBarMenu from "src/components/layout/appbar/UserAppBarMenu";
import SideMenu from "src/components/layout/sidemenu/SideMenu";

interface IProps {
  appName: string;
  navItems: NavItem[];
  menuLabel: string;
  navigationLabel: string;
  logoutLabel: string;
  children: React.ReactNode;
}

/** Frame for all pages after login: app bar on top, navigation in a drawer behind the menu button. */
const AppShell: React.FC<IProps> = ({ appName, menuLabel, children }) => {
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

      <SideMenu
        open={drawerOpen}
        handleToggleOpen={(open: boolean) => {
          setDrawerOpen(open);
        }}
      />

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
