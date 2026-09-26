using Data.Database.Configurations;
using Data.Database.Context.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Context.Configurations
{
    public class UserRoleEntityConfiguration : AEntityBaseConfiguration<UserRoleEntity>
    {
        private const string TableName = "UserRoles";

        public override void Configure(EntityTypeBuilder<UserRoleEntity> builder)
        {
            base.Configure(builder);

            builder.ToTable(TableName);

            builder.Property(r => r.RoleName)
                   .HasMaxLength(ColumnLengths.Name)
                   .IsRequired();

            builder.HasIndex(r => r.RoleName)
                   .IsUnique();

            builder.HasIndex(r => r.RoleType)
                   .IsUnique();
        }
    }
}
