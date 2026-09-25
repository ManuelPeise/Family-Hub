namespace Shared.Models.Auth
{
    public class TokenResponse
    {
        public string JwtToken { get; set; } = null!;
        public DateTime JwtTokenExpiresAt { get; set; }
        public string RefreshToken { get; set; } = null!;
        public DateTime RefreshTokenExpiresAt { get; set; }
    }
}
