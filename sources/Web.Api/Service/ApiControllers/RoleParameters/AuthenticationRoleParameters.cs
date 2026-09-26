using Shared.Enums.Auth;

namespace Web.Api.Service.ApiControllers.RoleParameters
{ 
    public static class AuthenticationRoleParameters
    {
        public const string AllUserRoles = nameof(UserRoleEnum.Admin) + "," + nameof(UserRoleEnum.User);
        public const string AdminOnly = nameof(UserRoleEnum.Admin);
        public const string UserOnly = nameof(UserRoleEnum.User);
    }
}
