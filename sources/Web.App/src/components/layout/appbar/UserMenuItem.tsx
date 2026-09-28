import React from "react";
import { MenuItem } from "@mui/material";
import type { MenuItemType } from "src/components/layout/appbar/UserAppBarMenu";

const UserMenuItem: React.FC<MenuItemType> = (props) => {
  const { label, onClick } = props;

  const handleClick = (): void => {
    void onClick();
  };

  return (
    <MenuItem
      sx={{ border: "none", borderRadius: 0, padding: "10px 0px" }}
      onClick={handleClick}
    >
      {label}
    </MenuItem>
  );
};

export default UserMenuItem;
