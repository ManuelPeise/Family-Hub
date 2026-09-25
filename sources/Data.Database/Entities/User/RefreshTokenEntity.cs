using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Database.Entities.User
{
    public class RefreshTokenEntity : AEntityBase
    {
        public long UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public UserEntity User { get; set; } = null!;
        public string TokenHash { get; set; } = null!;
        public DateTime ExpiresAtUtc { get; set; }
        public DateTime? RevokedAtUtc { get; set; }
    }
}
