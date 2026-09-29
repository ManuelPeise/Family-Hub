import React from "react";
import type { NotificationModel } from "src/components/layout/types/NotificationModel";
import { StatelessApiClient } from "src/lib/api/StatelessApi";
import { useComponentInitializationAsync } from "src/hooks/useComponentInitializationAsync";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { NotificationsIcon } from "src/lib/utils/icons";

interface INotificationInitializationProps {
  notificationModels: NotificationModel[];
  updateNotification: (
    notification: NotificationModel,
    setState: (notifications: NotificationModel[]) => void,
  ) => Promise<void>;
}

interface INotificationModelState {
  notificationModels: NotificationModel[];
}

const initializeAsync = async (): Promise<INotificationInitializationProps> => {
  const notificationApi = StatelessApiClient.create<
    NotificationModel,
    NotificationModel[]
  >({
    url: "/UserNotification/GetUserNotifications",
    isResponse: (response: unknown): response is NotificationModel[] =>
      Array.isArray(response),
  });

  const notifications = await notificationApi.sendGet();

  const updateNotification = async (
    notification: NotificationModel,
    setState: (notifications: NotificationModel[]) => void,
  ) => {
    const updatedNotifications = await notificationApi.sendPost({
      url: "/UserNotification/UpdateUserNotifications",
      body: notification,
    });
    setState(updatedNotifications);
  };

  return {
    notificationModels: notifications,
    updateNotification: updateNotification,
  };
};

const AppbarNotificationContainer: React.FC = () => {
  const initialization =
    useComponentInitializationAsync<INotificationInitializationProps>(
      initializeAsync,
    );

  console.log(initialization.model?.notificationModels);

  if (
    !initialization.initialized ||
    !initialization.model?.notificationModels
  ) {
    return null;
  }

  return (
    <AppbarNotification
      notificationModels={initialization.model.notificationModels}
      updateNotification={initialization.model.updateNotification}
    />
  );
};

const AppbarNotification: React.FC<INotificationInitializationProps> = (
  props,
) => {
  const { notificationModels, updateNotification } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [state, setState] = React.useState<INotificationModelState>({
    notificationModels: notificationModels,
  });

  const handleUpdateNotificationState = React.useCallback(
    (items: NotificationModel[]) => {
      setState({
        ...state,
        notificationModels: items,
      });
    },
    [state],
  );
  return (
    <>
      <IconButton
        color="inherit"
        disabled={!state.notificationModels.length}
        onClick={(event) => {
          setAnchorEl(anchorEl ? null : event.currentTarget);
        }}
      >
        <NotificationsIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
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
        {state.notificationModels.map((item) => (
          <MenuItem
            key={item.id}
            onClick={() => {
              void updateNotification(
                {
                  ...item,
                  isActive: false,
                },
                handleUpdateNotificationState,
              );

              setAnchorEl(null);
            }}
          >
            <Typography variant="body2">{item.notification}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AppbarNotificationContainer;
