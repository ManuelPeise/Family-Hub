namespace Data.Database.Context.Entities
{
    public class UserRefreshTokenEntity: AEntityBase
    {
        public string RefreshToken { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
    }
}
