import type { SvgIconTypeMap } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export type SideMenuItemConfiguration = {
  hasIcon: boolean;
  IconComponent?: OverridableComponent<SvgIconTypeMap> & {
    muiName: string;
  };
  isCollapsible: boolean;
  requiredScope: string;
};

export type SideMenuConfiguration = {
  appName: string;
  items: Record<string, SideMenuItemConfiguration>[];
};
