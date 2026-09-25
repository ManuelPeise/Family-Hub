using Shared.Models.Interfaces;

namespace Shared.Models.Auth
{
    public class RegistrationRequest : IUserBase
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = null!;
    }
}
