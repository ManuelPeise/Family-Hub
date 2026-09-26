using Logic.Shared.Models;
using Microsoft.AspNetCore.Http;

namespace Logic.Shared
{
    public abstract class ALogicBase
    {
        private readonly HttpContext _httpContext;
        protected CurrentUserInfo CurrentUser;

        protected ALogicBase(IHttpContextAccessor httpContextAccessor)
        {
            _httpContext = httpContextAccessor?.HttpContext ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            CurrentUser = GetCurrentUserInfo();
        }

        private CurrentUserInfo GetCurrentUserInfo()
        {
            var user = _httpContext?.User?? null;
            var isAuthenticated = user?.Identity?.IsAuthenticated ?? false;

            if (user == null || !isAuthenticated)
            {
               throw new UnauthorizedAccessException("User is not authenticated.");
            }
            
            var userIdClaimValue = user.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            var emailClaimValue = user.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;


            if (string.IsNullOrEmpty(userIdClaimValue) || string.IsNullOrEmpty(emailClaimValue))
            {
                throw new UnauthorizedAccessException("User claims are missing.");
            }

            return new CurrentUserInfo
            {
                UserId = long.Parse(userIdClaimValue),
                CurrentUserMail = emailClaimValue
            };

        }
    }
}
