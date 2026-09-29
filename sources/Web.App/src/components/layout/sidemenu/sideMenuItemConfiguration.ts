import type { ResourceKey } from "src/hooks/types/UseLocalisationResult";
import type { SideMenuItemModel } from "src/components/layout/sidemenu/models/SideMenuItemModel";

export const getSideMenuItemConfiguration = (
  getResource: (key: ResourceKey) => string,
): SideMenuItemModel[] => {
  return [
    {
      configurationKey: "administration",
      label: getResource("navigation:labelAdministration"),
      route: "/administration",
      subItems: [
        {
          configurationKey: "accessRequests",
          label: getResource("navigation:labelAccessRequests"),
          route: "/administration/access-requests",
          subItems: [],
        },
        {
          configurationKey: "userAdministration",
          label: getResource("navigation:labelUserAdministration"),
          route: "/administration/user-administration",
          subItems: [],
        },
      ],
    },
    {
      configurationKey: "familyAdministration",
      label: getResource("navigation:labelFamilyAdministration"),
      route: "/family-administration",
      subItems: [
        {
          configurationKey: "familyMembers",
          label: getResource("navigation:labelFamilyMembers"),
          route: "/family-administration/family-members",
          subItems: [],
        },
      ],
    },
  ];
};
