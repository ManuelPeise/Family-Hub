using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Database.Context.Entities.User
{
    public class UserAppCredentialsEntity: AEntityBase
    {
        public string Pin { get; set; } = null!;

        public long UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public UserEntity User { get; set; } = null!;
    }
}
