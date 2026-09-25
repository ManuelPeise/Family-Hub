using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Shared.Enums.Auth;

namespace Web.Api.Service.Attributes
{
    public class ApiAuthenticationAttribute : AuthorizeAttribute
    {
        public ApiAuthenticationAttribute(params UserRoleEnum[] roles)
        {
            AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme;

            if (roles.Length > 0)
            {
                Roles = string.Join(",", roles.Append(UserRoleEnum.Admin).Distinct());
            }
        }
    }
}
