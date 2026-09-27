import React from "react";
import type { NotificationModel } from "src/components/layout/types/NotificationModel";
import { StatelessApiClient } from "src/lib/api/StatelessApi";
import { useComponentInitializationAsync } from "src/hooks/useComponentInitializationAsync";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { NotificationsIcon } from "src/components/layout/icons";
import isNotificationModelList from "src/components/layout/isNotificationModelList";

interface INotificationInitializationProps {
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

const initializeAsync = async (): Promise<INotificationInitializationProps> => {
  const notificationApi = StatelessApiClient.create<
    NotificationModel,
    NotificationModel[]
  >({
    url: "/api/UserNotification/GetUserNotifications",
    isResponse: isNotificationModelList,
  });

  const [notifications] = await Promise.all([notificationApi.sendGet()]);

  const updateNotification = async (
    notification: NotificationModel,
    setState: (notifications: NotificationModel[]) => void,
  ) => {
    const updatedNotifications = await notificationApi.sendPost({
      url: "/api/UserNotification/UpdateUserNotifications",
      body: notification,
    });
    setState(updatedNotifications);
  };

  return {
    notificationModels: notifications,
    updateNotification: updateNotification,
  };
};

const NotificationContainer: React.FC = () => {
  const initialization =
    useComponentInitializationAsync<INotificationInitializationProps>(
      initializeAsync,
    );

  if (
    !initialization.initialized ||
    !initialization.model?.notificationModels.length
  ) {
    return null;
  }

  return (
    <Notification
      notificationModels={initialization.model.notificationModels}
      updateNotification={initialization.model.updateNotification}
    />
  );
};

const Notification: React.FC<INotificationInitializationProps> = (props) => {
  const { notificationModels, updateNotification } = props;

  const [state, setState] = React.useState<INotificationModelState>({
    notificationModels: notificationModels,
    isNotificationMenuOpen: false,
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
        onClick={() => {
          handleUpdateNotificationState(state.notificationModels);
        }}
      >
        <NotificationsIcon />
      </IconButton>
      <Menu
        anchorEl={state.isNotificationMenuOpen ? document.body : null}
        open={state.isNotificationMenuOpen}
        onClose={() => {
          handleUpdateNotificationState(state.notificationModels);
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
            }}
          >
            <Typography variant="body2">{item.messageResourceKey}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationContainer;
