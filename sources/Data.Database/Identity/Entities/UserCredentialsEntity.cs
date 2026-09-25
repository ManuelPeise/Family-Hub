namespace Data.Database.Identity.Entities
{
    public class UserCredentialsEntity: AEntityBase
    {
        public string PasswordHash { get; set; } = null!;
        public DateTime PasswordExpiresAt { get; set; }
    }
}
