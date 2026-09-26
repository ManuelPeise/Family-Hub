using Data.Database.Context.Entities.User;
using Shared.Models.Auth;

namespace Logic.Authentication.Interfaces
{
    public interface ITokenService
    {
        /// <summary>
        /// Creates a signed JWT access token for the user. The user's roles must be loaded.
        /// </summary>
        IssuedToken CreateAccessToken(UserEntity user);

        /// <summary>
        /// Creates a random refresh token. Only its hash (see <see cref="HashRefreshToken"/>) may be stored.
        /// </summary>
        IssuedToken CreateRefreshToken();

        string HashRefreshToken(string refreshToken);
    }
}
