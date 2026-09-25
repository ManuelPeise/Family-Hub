using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Shared.Models.Options;
using System.Text;

namespace Logic.Authentication
{
    /// <summary>
    /// Settings shared by token creation (<see cref="TokenService"/>) and token validation (JwtBearer in Web.Api),
    /// so both sides always use the same key, algorithm and claim types.
    /// </summary>
    public static class JwtTokenParameters
    {
        public const string SigningAlgorithm = SecurityAlgorithms.HmacSha256;
        public const string NameClaimType = JwtRegisteredClaimNames.UniqueName;
        public const string RoleClaimType = "role";

        private const int MinimumSigningKeyBytes = 32;
        private static readonly TimeSpan ClockSkew = TimeSpan.FromSeconds(30);

        public static void Validate(JwtOptions jwtOptions)
        {
            if (string.IsNullOrEmpty(jwtOptions.Issuer) || string.IsNullOrEmpty(jwtOptions.Audience))
            {
                throw new InvalidOperationException("Jwt:Issuer and Jwt:Audience must be configured.");
            }

            if (jwtOptions.AccessTokenMinutes <= 0 || jwtOptions.RefreshTokenDays <= 0)
            {
                throw new InvalidOperationException("Jwt:AccessTokenMinutes and Jwt:RefreshTokenDays must be greater than 0.");
            }

            if (Encoding.UTF8.GetByteCount(jwtOptions.SigningKey ?? string.Empty) < MinimumSigningKeyBytes)
            {
                throw new InvalidOperationException($"Jwt:SigningKey must be at least {MinimumSigningKeyBytes} bytes long for HMAC-SHA256.");
            }
        }

        public static SymmetricSecurityKey CreateSigningKey(JwtOptions jwtOptions)
        {
            Validate(jwtOptions);

            return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey));
        }

        public static TokenValidationParameters CreateValidationParameters(JwtOptions jwtOptions)
        {
            return new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtOptions.Issuer,
                ValidateAudience = true,
                ValidAudience = jwtOptions.Audience,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = CreateSigningKey(jwtOptions),
                ValidAlgorithms = [SigningAlgorithm],
                ValidateLifetime = true,
                RequireExpirationTime = true,
                ClockSkew = ClockSkew,
                NameClaimType = NameClaimType,
                RoleClaimType = RoleClaimType,
            };
        }
    }
}
