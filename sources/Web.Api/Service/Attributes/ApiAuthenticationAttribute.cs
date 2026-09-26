using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Shared.Enums.Auth;
using Shared.Enums.Security;
using Web.Api.Service.Auth;

namespace Web.Api.Service.Attributes
{
    /// <summary>
    /// Requires a valid access token from the Authorization header or the access token cookie (see AddJwtAuthentication).
    /// <list type="bullet">
    /// <item><c>[ApiAuthentication]</c>: any signed-in user.</item>
    /// <item><c>[ApiAuthentication(UserRoleEnum.User)]</c>: one of the roles.</item>
    /// <item><c>[ApiAuthentication(roles: AuthenticationRoleParameters.AllUserRoles)]</c>: one of the roles in a named role set.</item>
    /// <item><c>[ApiAuthentication(ScopeTypeEnum.Administration, ScopePermissionEnum.View | ScopePermissionEnum.Edit)]</c>: all listed permissions in the scope.</item>
    /// </list>
    /// Admin always passes. Stack the attribute to require several scopes.
    /// </summary>
    public class ApiAuthenticationAttribute : AuthorizeAttribute, IAuthorizationRequirementData
    {
        public ScopeTypeEnum? Scope { get; }
        public ScopePermissionEnum ScopePermissions { get; }

        public ApiAuthenticationAttribute(params UserRoleEnum[] roles)
        {
            AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme;

            if (roles.Length > 0)
            {
                SetRoles(roles);
            }
        }

        /// <summary>
        /// Takes a comma-separated role set from <c>AuthenticationRoleParameters</c>. Every name must be a <see cref="UserRoleEnum"/> value.
        /// </summary>
        public ApiAuthenticationAttribute(string roles)
        {
            AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme;

            var parsedRoles = roles.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                                   .Select(role => Enum.TryParse<UserRoleEnum>(role, ignoreCase: false, out var parsedRole) && Enum.IsDefined(parsedRole)
                                       ? parsedRole
                                       : throw new ArgumentException($"'{role}' is not a {nameof(UserRoleEnum)} value.", nameof(roles)))
                                   .ToList();

            if (parsedRoles.Count == 0)
            {
                throw new ArgumentException("At least one role is required.", nameof(roles));
            }

            SetRoles(parsedRoles);
        }

        public ApiAuthenticationAttribute(ScopeTypeEnum scope, ScopePermissionEnum permissions)
        {
            if (permissions == ScopePermissionEnum.None)
            {
                throw new ArgumentException("At least one scope permission is required.", nameof(permissions));
            }

            AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme;
            Scope = scope;
            ScopePermissions = permissions;
        }

        // Admin always passes, so it is added to every role set.
        private void SetRoles(IEnumerable<UserRoleEnum> roles)
        {
            Roles = string.Join(",", roles.Append(UserRoleEnum.Admin).Distinct());
        }

        public IEnumerable<IAuthorizationRequirement> GetRequirements()
        {
            // ASP.NET Core builds a policy from these, and a policy with no requirements throws, so always require a signed-in user.
            yield return new DenyAnonymousAuthorizationRequirement();

            if (Scope.HasValue)
            {
                yield return new ScopeAuthorizationRequirement(Scope.Value, ScopePermissions);
            }
        }
    }
}
