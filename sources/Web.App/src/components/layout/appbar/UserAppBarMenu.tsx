import React from "react";
import { useLocalization } from "src/hooks/useLocalization";
import { Menu, Box, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuthenticationState from "src/hooks/useAuthenticationState";
import UserMenuItem from "src/components/layout/appbar/UserMenuItem";

export type MenuItemType = {
  key: string;
  label: string;
  onClick: () => Promise<void>;
};

const UserAppBarMenu: React.FC = () => {
  const localization = useLocalization();
  const authenticationState = useAuthenticationState();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = React.useCallback(async (): Promise<void> => {
    await authenticationState.handleLogout();
  }, [authenticationState]);

  const menuItems = React.useMemo<MenuItemType[]>(() => {
    return [
      {
        key: "profile",
        label: localization.getResource("common:labelProfile"),
        onClick: async () => {
          await navigate("/user/profile");
          handleMenuClose();
        },
      },
      {
        key: "logout",
        label: localization.getResource("common:labelLogout"),
        onClick: handleLogout,
      },
    ];
  }, [localization, handleLogout, navigate]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          gap: 1,
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          {authenticationState.session?.userName.charAt(0).toUpperCase()}
        </Avatar>
        <Box onClick={handleMenuOpen}>
          <Typography variant="body1" component="span">
            {authenticationState.session?.email}
          </Typography>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        disableAutoFocusItem
        slotProps={{
          paper: {
            sx: {
              minWidth: 200,
              borderRadius: 0,
              padding: 0,
              margin: 0,
            },
          },
        }}
      >
        {menuItems.map((item) => (
          <UserMenuItem {...item} key={item.key} />
        ))}
      </Menu>
    </Box>
  );
};

export default UserAppBarMenu;
