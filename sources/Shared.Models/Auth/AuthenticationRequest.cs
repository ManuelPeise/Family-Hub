namespace Shared.Models.Auth
{
    public class AuthenticationRequest
    {
        public string UserNameOrEmail { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
