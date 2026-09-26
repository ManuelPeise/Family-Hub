namespace Shared.Models.Auth
{
    /// <summary>
    /// The signed-in user, as read from the access token claims.
    /// </summary>
    public class SessionResponse
    {
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public List<string> Roles { get; set; } = [];
    }
}
