using Shared.Enums.auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Database.Entities.User
{
    public class UserEntity : AEntityBase
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public DateOnly DateOfBirth { get; set; }
        public UserRoleEnum UserRole { get; set; }

        public UserCredentialsEntity? Credentials { get; set; }
        public ICollection<UserNotificationEntity> Notifications { get; set; } = [];
        public ICollection<RefreshTokenEntity> RefreshTokens { get; set; } = [];
    }

}
