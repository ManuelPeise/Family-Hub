namespace Shared.Models.Auth
{
    public class IssuedToken
    {
        public string Value { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
    }
}
