import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import MuiTypography from "@mui/material/Typography";
import React from "react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LogoutIcon,
  MenuIcon,
  NotificationsIcon,
} from "src/components/layout/icons";
import type { NavItem } from "src/components/layout/types/NavItem";
import { useComponentInitializationAsync } from "src/hooks/useComponentInitializationAsync";
import type { NotificationModel } from "src/components/layout/types/NotificationModel";
import { StatelessApiClient } from "src/lib/api/StatelessApi";
import { Menu, MenuItem, Typography } from "@mui/material";

interface IProps {
  appName: string;
  userName: string;
  navItems: NavItem[];
  menuLabel: string;
  navigationLabel: string;
  logoutLabel: string;
  loggingOut: boolean;
  onLogout: () => void;
  children: React.ReactNode;
}

interface IAppShellInitializationProps {
  notificationModels: NotificationModel[];
  updateNotification: (
    notification: NotificationModel,
    setState: (notifications: NotificationModel[]) => void,
  ) => Promise<void>;
}

interface INotificationModelState {
  notificationModels: NotificationModel[];
  isNotificationMenuOpen: boolean;
}

const initializeAsync = async (): Promise<IAppShellInitializationProps> => {
  const notificationApi = StatelessApiClient.create<
    NotificationModel,
    NotificationModel[]
  >({
    baseUrl: "api/usernotification/getusernotifications",
  });

  const [notifications] = await Promise.all([notificationApi.sendGet()]);

  const updateNotification = async (
    notification: NotificationModel,
    setState: (notifications: NotificationModel[]) => void,
  ) => {
    const updatedNotifications = await notificationApi.sendPost({
      body: notification,
    });
    setState(updatedNotifications);
  };

  return {
    notificationModels: notifications,
    updateNotification: updateNotification,
  };
};

const AppShellContainer: React.FC<IProps> = (props) => {
  const { initialized, model } =
    useComponentInitializationAsync(initializeAsync);

  if (!initialized || !model) {
    return null;
  }

  return <AppShell {...props} {...model} />;
};

/** Frame for all pages after login: app bar on top, navigation in a drawer behind the menu button. */
const AppShell: React.FC<IProps & IAppShellInitializationProps> = ({
  appName,
  userName,
  navItems,
  menuLabel,
  navigationLabel,
  logoutLabel,
  loggingOut,
  onLogout,
  notificationModels,
  updateNotification,
  children,
}) => {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationState, setNotificationState] =
    useState<INotificationModelState>({
      notificationModels: notificationModels,
      isNotificationMenuOpen: false,
    });

  const handleUpdateNotificationState = React.useCallback(
    (partialState: Partial<INotificationModelState>) => {
      setNotificationState({
        ...notificationState,
        ...partialState,
      });
    },
    [notificationState],
  );

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
            <Tooltip title={userName}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
            {/* On phones only the avatar (with tooltip) is shown to save space. */}
            <MuiTypography
              variant="subtitle2"
              component="span"
              noWrap
              sx={{ display: { xs: "none", sm: "block" }, maxWidth: 240 }}
            >
              {userName}
            </MuiTypography>

            <IconButton
              color="inherit"
              disabled={
                loggingOut || !notificationState.notificationModels.length
              }
              onClick={() => {
                handleUpdateNotificationState({
                  isNotificationMenuOpen:
                    !notificationState.isNotificationMenuOpen,
                });
              }}
            >
              <NotificationsIcon />
            </IconButton>
            <Menu
              anchorEl={
                notificationState.isNotificationMenuOpen ? document.body : null
              }
              open={notificationState.isNotificationMenuOpen}
              onClose={() => {
                handleUpdateNotificationState({
                  isNotificationMenuOpen: false,
                });
              }}
            >
              {notificationState.notificationModels.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() =>
                    updateNotification.bind(null, {
                      ...item,
                      isActive: false,
                    })
                  }
                >
                  <Typography variant="body2">
                    {item.messageResourceKey}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>

            <Tooltip title={logoutLabel}>
              <span>
                <IconButton
                  color="inherit"
                  aria-label={logoutLabel}
                  disabled={loggingOut}
                  onClick={onLogout}
                >
                  <LogoutIcon />
                </IconButton>
              </span>
            </Tooltip>
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

export default AppShellContainer;
