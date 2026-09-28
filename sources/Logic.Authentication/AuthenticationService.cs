using Data.Accessor.Interfaces;
using Data.Database.Context.Entities.User;
using Logic.Authentication.Interfaces;
using Logic.Shared.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shared.Models.Auth;

namespace Logic.Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly ILogger<AuthenticationService> _logger;
        private readonly IApplicationUnitOfWork _applicationUnitOfWork;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ITokenService _tokenService;
        private readonly IEmailNotificationHandler _emailNotificationHandler;

        public AuthenticationService(
            ILogger<AuthenticationService> logger, 
            IApplicationUnitOfWork applicationUnitOfWork, 
            IPasswordHasher passwordHasher, 
            ITokenService tokenService,
            IEmailNotificationHandler emailNotificationHandler)
        {
            _logger = logger;
            _applicationUnitOfWork = applicationUnitOfWork;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
            _emailNotificationHandler = emailNotificationHandler;
        }

        public async Task<TokenResponse?> AuthenticateUser(AuthenticationRequest request, CancellationToken cancellationToken = default)
        {
            try
            {
                ArgumentException.ThrowIfNullOrEmpty(request.UserNameOrEmail, nameof(request.UserNameOrEmail));
                ArgumentException.ThrowIfNullOrEmpty(request.Password, nameof(request.Password));

                var identityUnitOfWork = _applicationUnitOfWork.IdentityUnitOfWork;
                
                var userEntity = QueryUsersWithTokenClaims(identityUnitOfWork)
                    .Include(u => u.Credentials)
                    .Include(u => u.RefreshToken)
                    .FirstOrDefault(u => u.UserName == request.UserNameOrEmail || u.Email == request.UserNameOrEmail);

                if (userEntity == null || userEntity.Credentials == null)
                {
                    return null;
                }

                if (!_passwordHasher.VerifyPassword(request.Password, userEntity.Credentials.PasswordHash))
                {
                    return null;
                }

                var accessToken = _tokenService.CreateAccessToken(userEntity);
                var refreshToken = _tokenService.CreateRefreshToken();

                StoreRefreshToken(userEntity, _tokenService.HashRefreshToken(refreshToken.Value), refreshToken.ExpiresAt);

                await identityUnitOfWork.SaveChangesAsync(cancellationToken);

                return new TokenResponse
                {
                    JwtToken = accessToken.Value,
                    JwtTokenExpiresAt = accessToken.ExpiresAt,
                    RefreshToken = refreshToken.Value,
                    RefreshTokenExpiresAt = refreshToken.ExpiresAt,
                };
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while authenticating user.");

                return null;
            }
        }

        public async Task<TokenResponse?> RefreshToken(string refreshToken, CancellationToken cancellationToken = default)
        {
            try
            {
                ArgumentException.ThrowIfNullOrEmpty(refreshToken, nameof(refreshToken));
                
                var identityUnitOfWork = _applicationUnitOfWork.IdentityUnitOfWork;
                
                var userEntity = QueryUsersWithTokenClaims(identityUnitOfWork)
                    .Include(u => u.RefreshToken)
                    .Where(u => u.RefreshToken!.RefreshToken == _tokenService.HashRefreshToken(refreshToken))
                    .FirstOrDefault();

                if (userEntity == null || userEntity.RefreshToken == null || userEntity.RefreshToken.ExpiresAt < DateTime.UtcNow)
                {
                    return null;
                }
                
                var accessToken = _tokenService.CreateAccessToken(userEntity);
                var newRefreshToken = _tokenService.CreateRefreshToken();
                
                StoreRefreshToken(userEntity, _tokenService.HashRefreshToken(newRefreshToken.Value), newRefreshToken.ExpiresAt);
                
                await identityUnitOfWork.SaveChangesAsync(cancellationToken);
                
                return new TokenResponse
                {
                    JwtToken = accessToken.Value,
                    JwtTokenExpiresAt = accessToken.ExpiresAt,
                    RefreshToken = newRefreshToken.Value,
                    RefreshTokenExpiresAt = newRefreshToken.ExpiresAt,
                };
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while refreshing token.");
                return null;
            }
        }

        /// <summary>
        /// Loads what <see cref="ITokenService.CreateAccessToken"/> writes into the token: roles and scopes.
        /// </summary>
        private static IQueryable<UserEntity> QueryUsersWithTokenClaims(IIdentityUnitOfWork identityUnitOfWork)
        {
            return identityUnitOfWork.UserRepository.Query()
                                     .Include(u => u.Roles)
                                     .Include(u => u.UserScopes)
                                     .ThenInclude(us => us.Scope)
                                     .AsSplitQuery();
        }

        private static void StoreRefreshToken(UserEntity userEntity, string refreshTokenHash, DateTime expiresAt)
        {
            if (userEntity.RefreshToken == null)
            {
                userEntity.RefreshToken = new UserRefreshTokenEntity
                {
                    RefreshToken = refreshTokenHash,
                    ExpiresAt = expiresAt,
                    CreatedBy = userEntity.UserName,
                };

                return;
            }

            userEntity.RefreshToken.RefreshToken = refreshTokenHash;
            userEntity.RefreshToken.ExpiresAt = expiresAt;
            userEntity.RefreshToken.UpdatedBy = userEntity.UserName;
        }
    }
}
