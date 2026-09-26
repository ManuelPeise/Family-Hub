using Shared.Enums.Auth;

namespace Data.Database.Context.Entities
{
    public class UserRoleEntity: AEntityBase
    {
        public string RoleName { get; set; } = null!;
        public UserRoleEnum RoleType { get; set; }
    }
}
