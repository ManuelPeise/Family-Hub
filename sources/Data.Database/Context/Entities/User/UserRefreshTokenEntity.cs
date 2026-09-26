namespace Data.Database.Context.Entities.User
{
    public class UserRefreshTokenEntity: AEntityBase
    {
        public string RefreshToken { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
    }
}
