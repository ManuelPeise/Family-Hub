import React from "react";
import { useLocalization } from "src/hooks/useLocalization";
import { sideMenuConfiguration } from "src/components/layout/sidemenu/sideMenuConfiguration";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import type { SideMenuItemModel } from "src/components/layout/sidemenu/models/SideMenuItemModel";
import SideMenuItem from "src/components/layout/sidemenu/components/SideMenuItem";
import Typography from "src/components/labels/Typography";
import { Divider } from "@mui/material";
import { getSideMenuItemConfiguration } from "src/components/layout/sidemenu/sideMenuItemConfiguration";

const drawerMinWidth = 320;

interface SideMenuProps {
  open: boolean;
  handleToggleOpen: (open: boolean) => void;
}

const SideMenu: React.FC<SideMenuProps> = (props) => {
  const { open, handleToggleOpen } = props;
  const localization = useLocalization();

  const sideMenuItems = React.useMemo((): SideMenuItemModel[] => {
    return getSideMenuItemConfiguration(localization.getResource);
  }, [localization.getResource]);

  return (
    <Drawer
      id="main-navigation"
      anchor="left"
      open={open}
      onClose={() => {
        handleToggleOpen(false);
      }}
      sx={{ minWidth: drawerMinWidth }}
      slotProps={{ paper: { sx: { width: "85vw", maxWidth: 280 } } }}
    >
      <Toolbar>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            mt: 2,
            gap: 2,
          }}
        >
          <Typography variant="h6" component="span">
            {sideMenuConfiguration.appName}
          </Typography>
          <Typography variant="body2" component="span">
            {localization.getResource("common:labelAppDescription")}
          </Typography>
          <Divider />
        </Box>
      </Toolbar>
      <List component="nav" sx={{ px: 1 }}>
        {sideMenuItems.map((item) => (
          <SideMenuItem key={item.configurationKey} item={item} />
        ))}
      </List>
    </Drawer>
  );
};

export default SideMenu;
