using Shared.Models.Auth;

namespace Logic.Shared.Interfaces
{
    public interface IAuthenticationService
    {
        Task<TokenResponse?> AuthenticateUser(AuthenticationRequest request, CancellationToken cancellationToken = default);
        Task<TokenResponse?> RefreshToken(string refreshToken, CancellationToken cancellationToken = default);
        Task<bool> RegisterUser(RegistrationRequest request);
    }
}
