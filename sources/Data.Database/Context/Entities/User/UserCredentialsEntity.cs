namespace Data.Database.Context.Entities.User
{
    public class UserCredentialsEntity: AEntityBase
    {
        public string PasswordHash { get; set; } = null!;
        public DateTime PasswordExpiresAt { get; set; }
    }
}
