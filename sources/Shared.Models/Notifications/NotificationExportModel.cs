using Shared.Enums.Notifications;

namespace Shared.Models.Notifications
{
    public class NotificationExportModel
    {
        public long Id { get; set; }
        public NotificationTypeEnum NotificationType { get; set; }
        public string MessageResourceKey { get; set; } = null!;
        public bool IsActive { get; set; }
    }
}
