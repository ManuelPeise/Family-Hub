using Shared.Enums.User;

namespace Data.Database.Context.Entities.User
{
    public class UserEntity: AEntityBase
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }
        public LanguageTypeEnum Language { get; set; } = LanguageTypeEnum.English;
        // The credential rows hold the UserId foreign key and are deleted with the user
        public UserCredentialsEntity Credentials { get; set; } = null!;
        public UserRefreshTokenEntity? RefreshToken { get; set; }
        public UserAppCredentialsEntity? AppCredentials { get; set; }
        // Navigation property for the roles associated with the user
        public ICollection<UserRoleEntity> Roles { get; set; } = [];
        public ICollection<UserScopeEntity> UserScopes { get; set; } = [];
        public ICollection<UserNotificationEntity> Notifications { get; set; } = [];
    }
}
