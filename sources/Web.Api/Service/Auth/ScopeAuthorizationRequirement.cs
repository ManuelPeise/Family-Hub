using Logic.Authentication;
using Microsoft.AspNetCore.Authorization;
using Shared.Enums.Auth;
using Shared.Enums.Security;

namespace Web.Api.Service.Auth
{
    /// <summary>
    /// Requires a scope claim for every requested permission. Admin always passes, as it does for roles.
    /// The requirement is its own handler, so the built-in PassThroughAuthorizationHandler runs it and no DI registration is needed.
    /// </summary>
    internal class ScopeAuthorizationRequirement : AuthorizationHandler<ScopeAuthorizationRequirement>, IAuthorizationRequirement
    {
        private readonly List<string> _requiredClaimValues;

        public ScopeAuthorizationRequirement(ScopeTypeEnum scope, ScopePermissionEnum permissions)
        {
            _requiredClaimValues = JwtTokenParameters.CreateScopeClaimValues(scope, permissions).ToList();
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ScopeAuthorizationRequirement requirement)
        {
            var user = context.User;

            if (user.IsInRole(nameof(UserRoleEnum.Admin))
                || requirement._requiredClaimValues.All(value => user.HasClaim(JwtTokenParameters.ScopeClaimType, value)))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
