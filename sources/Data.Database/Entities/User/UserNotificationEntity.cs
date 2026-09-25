using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Database.Entities.User
{
    public class UserNotificationEntity : AEntityBase
    {
        public long UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public UserEntity User { get; set; } = null!;
        public string Message { get; set; } = null!;
        public DateTime TimeStampUtc { get; set; }
        public bool IsRead { get; set; }
    }
}
