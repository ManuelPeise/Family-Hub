using Shared.Enums.Notifications;
using System.ComponentModel.DataAnnotations.Schema;


namespace Data.Database.Context.Entities.User
{
    public class UserNotificationEntity : AEntityBase
    {
        public NotificationTypeEnum NotificationType { get; set; }
        public string MessageResourceKey { get; set; } = null!;
        public bool IsActive { get; set; }
        public long UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public UserEntity User { get; set; } = null!;
    }
}
