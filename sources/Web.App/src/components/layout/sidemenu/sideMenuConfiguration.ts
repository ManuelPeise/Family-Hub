import type {
  SideMenuConfiguration,
  SideMenuItemConfiguration,
} from "src/components/layout/sidemenu/models/SideMenuConfiguration";
import { sideMenuConfigurationKeys } from "src/components/layout/sidemenu/sideMenuConfigurationKeys";
import {
  AdminPanelSettingsIcon,
  FamilyRestroomIcon,
} from "src/lib/utils/icons";

export const sideMenuConfiguration: SideMenuConfiguration = {
  appName: "Family Hub",
  items: [
    {
      [sideMenuConfigurationKeys.administration]: {
        hasIcon: true,
        IconComponent: AdminPanelSettingsIcon,
        isCollapsible: true,
        requiredScope: "administration.view",
      },
      [sideMenuConfigurationKeys.familyAdministration]: {
        hasIcon: true,
        IconComponent: FamilyRestroomIcon,
        isCollapsible: true,
        requiredScope: "familyadministration.view",
      },
    },
  ],
};

export const getSideMenuConfiguration = (
  key: string,
): SideMenuItemConfiguration | null => {
  const configuration = sideMenuConfiguration.items.find((item) => item[key]);

  if (!configuration) {
    return null;
  }
  return configuration[key] ?? null;
};
