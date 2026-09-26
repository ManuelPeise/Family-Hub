import type { NotificationTypeEnum } from "src/components/layout/enums/NotificationTypeEnum";

/** Mirrors Shared.Models.Notifications.NotificationExportModel. */
export interface NotificationModel {
  notificationType: NotificationTypeEnum;
  messageResourceKey: string;
  isActive: boolean;
}
