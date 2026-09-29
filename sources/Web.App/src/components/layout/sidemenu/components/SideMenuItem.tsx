import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { useNavigate } from "react-router-dom";
import type { SideMenuItemModel } from "src/components/layout/sidemenu/models/SideMenuItemModel";
import { getSideMenuConfiguration } from "src/components/layout/sidemenu/sideMenuConfiguration";
import { useSession } from "src/hooks/useSession";

import { ExpandLessIcon, ExpandMoreIcon } from "src/lib/utils/icons";

interface Props {
  item: SideMenuItemModel;
}

const SideMenuItem: React.FC<Props> = ({ item }) => {
  const session = useSession();
  const navigation = useNavigate();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const configuration = getSideMenuConfiguration(item.configurationKey);

  const hasRequiredScope =
    !configuration?.requiredScope ||
    session.session?.scopes.includes(configuration.requiredScope);

  const hasSubItems = item.subItems.length > 0;
  const isCollapsible = configuration?.isCollapsible ?? false;
  const canToggle = isCollapsible && hasSubItems;
  const showSubItems = hasSubItems && (isExpanded || !isCollapsible);

  const handleClick = React.useCallback((): void => {
    if (canToggle) {
      setIsExpanded((expanded) => !expanded);
    } else {
      void navigation(item.route);
    }
  }, [canToggle, item]);

  const handleSubItemClick = React.useCallback(
    (subItem: SideMenuItemModel): void => {
      void navigation(subItem.route);
    },
    [navigation],
  );

  if (!configuration || !hasRequiredScope) {
    return null;
  }

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        onClick={handleClick}
        aria-expanded={canToggle ? isExpanded : undefined}
      >
        <ListItemIcon>
          {configuration.hasIcon && configuration.IconComponent && (
            <configuration.IconComponent />
          )}
        </ListItemIcon>
        <ListItemText primary={item.label} />
        {canToggle && (isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
      </ListItemButton>
      {hasSubItems && (
        <Collapse in={showSubItems} unmountOnExit>
          <List disablePadding>
            {item.subItems.map((subItem) => (
              <ListItem key={subItem.route} disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleSubItemClick(subItem);
                  }}
                  sx={{ pl: 4 }}
                >
                  <ListItemText sx={{ pl: 2 }} primary={subItem.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </ListItem>
  );
};

export default SideMenuItem;
