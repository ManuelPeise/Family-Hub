/**
 * Mirrors Shared.Enums.Notifications.NotificationTypeEnum. The API sends the numeric value.
 * A const object instead of a TypeScript enum, because erasableSyntaxOnly forbids enums.
 */
export const NotificationTypes = {
  FamilyMemberRequest: 0,
} as const;

export type NotificationTypeEnum =
  (typeof NotificationTypes)[keyof typeof NotificationTypes];
