
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Database.Entities.User
{
    public class UserCredentialsEntity : AEntityBase
    {
        public long UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public UserEntity User { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public DateTime PasswordExpiresAtUtc { get; set; }
    }
}
