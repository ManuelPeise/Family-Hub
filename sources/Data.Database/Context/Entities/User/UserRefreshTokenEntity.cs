using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Database.Context.Entities.User
{
    public class UserRefreshTokenEntity: AEntityBase
    {
        public string RefreshToken { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }

        public long UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public UserEntity User { get; set; } = null!;
    }
}
