using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Database.Context.Entities
{
    public class UserEntity: AEntityBase
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }

        // Navigation property for the roles associated with the user
        public ICollection<UserRoleEntity> Roles { get; set; } = [];
        // Foreign key for the UserCredentialsEntity
        public long CredentialsId { get; set; }
        [ForeignKey(nameof(CredentialsId))]
        public UserCredentialsEntity Credentials { get; set; } = null!;
        // Foreign key for the RefreshTokenEntity
        public long? RefreshTokenId { get; set; }
        [ForeignKey(nameof(RefreshTokenId))]
        public UserRefreshTokenEntity? RefreshToken { get; set; }
        // Foreign key for the AppCredentialsEntity
        public long? AppCredentialsId { get; set; }
        [ForeignKey(nameof(AppCredentialsId))]
        public UserAppCredentialsEntity? AppCredentials { get; set; }
    }
}
