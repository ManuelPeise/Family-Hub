import type { NotificationTypeEnum } from "src/lib/enums/NotificationTypeEnum";

/** Mirrors Shared.Models.Notifications.NotificationExportModel. */
export interface NotificationModel {
  id: number;
  notificationType: NotificationTypeEnum;
  notification: string;
  isActive: boolean;
}
