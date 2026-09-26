using Data.Database.Context.Entities.User;
using Logic.Authentication.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Shared.Models.Auth;
using Shared.Models.Options;
using System.Buffers.Text;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Logic.Authentication
{
    public class TokenService : ITokenService
    {
        private const int RefreshTokenBytes = 64;

        private readonly JwtOptions _jwtOptions;
        private readonly SigningCredentials _signingCredentials;
        private readonly JsonWebTokenHandler _tokenHandler = new();

        public TokenService(IOptions<JwtOptions> jwtOptions)
        {
            _jwtOptions = jwtOptions.Value;
            _signingCredentials = new SigningCredentials(JwtTokenParameters.CreateSigningKey(_jwtOptions), JwtTokenParameters.SigningAlgorithm);
        }

        public IssuedToken CreateAccessToken(UserEntity user)
        {
            var issuedAt = DateTime.UtcNow;
            var expiresAt = issuedAt.AddMinutes(_jwtOptions.AccessTokenMinutes);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(JwtRegisteredClaimNames.UniqueName, user.UserName),
                new(JwtRegisteredClaimNames.Email, user.Email),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            // The enum name (not the display RoleName) is the claim value, so [ApiAuthentication(UserRoleEnum.X)] matches it.
            claims.AddRange(user.Roles.Select(r => new Claim(JwtTokenParameters.RoleClaimType, r.RoleType.ToString())));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _jwtOptions.Issuer,
                Audience = _jwtOptions.Audience,
                Subject = new ClaimsIdentity(claims),
                IssuedAt = issuedAt,
                NotBefore = issuedAt,
                Expires = expiresAt,
                SigningCredentials = _signingCredentials,
            };

            return new IssuedToken
            {
                Value = _tokenHandler.CreateToken(tokenDescriptor),
                ExpiresAt = expiresAt,
            };
        }

        public IssuedToken CreateRefreshToken()
        {
            return new IssuedToken
            {
                Value = Base64Url.EncodeToString(RandomNumberGenerator.GetBytes(RefreshTokenBytes)),
                ExpiresAt = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenDays),
            };
        }

        public string HashRefreshToken(string refreshToken)
        {
            return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken)));
        }
    }
}
