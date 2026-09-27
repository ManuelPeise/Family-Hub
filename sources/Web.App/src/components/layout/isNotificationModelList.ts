import type { NotificationModel } from "src/components/layout/types/NotificationModel";
import { NotificationTypes } from "src/components/layout/enums/NotificationTypeEnum";
import isRecord from "src/lib/utils/isRecord";

const notificationTypeValues: readonly unknown[] =
  Object.values(NotificationTypes);

const isNotificationModel = (value: unknown): value is NotificationModel =>
  isRecord(value) &&
  typeof value.id === "number" &&
  notificationTypeValues.includes(value.notificationType) &&
  typeof value.messageResourceKey === "string" &&
  typeof value.isActive === "boolean";

/** Narrows a response body (List<NotificationExportModel>) to NotificationModel[]. */
const isNotificationModelList = (
  value: unknown,
): value is NotificationModel[] =>
  Array.isArray(value) && value.every(isNotificationModel);

export default isNotificationModelList;
