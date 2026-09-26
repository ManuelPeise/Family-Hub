using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Database.Context.Entities.User
{
    public class UserCredentialsEntity: AEntityBase
    {
        public string PasswordHash { get; set; } = null!;
        public DateTime PasswordExpiresAt { get; set; }

        public long UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public UserEntity User { get; set; } = null!;
    }
}
