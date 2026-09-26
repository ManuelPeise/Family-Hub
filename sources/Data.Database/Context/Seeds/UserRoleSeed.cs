using Data.Database.Context.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shared.Enums.Auth;

namespace Data.Database.Context.Seeds
{
    internal class UserRoleSeed : IEntityTypeConfiguration<UserRoleEntity>
    {
        public void Configure(EntityTypeBuilder<UserRoleEntity> builder)
        {
            var timeStamp = DateTime.Parse("2026-01-01");

            var entities = new List<UserRoleEntity>
            {
                new UserRoleEntity { Id = 1, RoleName = "Admin",  RoleType = UserRoleEnum.Admin, CreatedAt = timeStamp, CreatedBy = "System"},
                new UserRoleEntity { Id = 2, RoleName = "User", RoleType = UserRoleEnum.User, CreatedAt = timeStamp,CreatedBy = "System" },
            };

            builder.HasData(entities);
        }
    }
}
