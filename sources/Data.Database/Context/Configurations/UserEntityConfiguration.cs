using Data.Database.Configurations;
using Data.Database.Context.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Context.Configurations
{
    public class UserEntityConfiguration : AEntityBaseConfiguration<UserEntity>
    {
        private const string TableName = "Users";
        private const string UserRoleAssignmentTableName = "UserRoleAssignments";
        private const string UserIdColumnName = "UserId";
        private const string RoleIdColumnName = "RoleId";

        public override void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            base.Configure(builder);

            builder.ToTable(TableName);

            builder.Property(u => u.FirstName)
                   .HasMaxLength(ColumnLengths.Name);

            builder.Property(u => u.LastName)
                   .HasMaxLength(ColumnLengths.Name);

            builder.Property(u => u.Email)
                   .HasMaxLength(ColumnLengths.Email)
                   .IsRequired();

            builder.Property(u => u.UserName)
                   .HasMaxLength(ColumnLengths.UserName)
                   .IsRequired();

            builder.HasIndex(u => u.Email)
                   .IsUnique();

            builder.HasIndex(u => u.UserName)
                   .IsUnique();

            // The credential rows hold the UserId foreign key (unique, so one row per user) and are deleted with the user.
            // The database can't force a user to have credentials; registration and the admin seeder always create them.
            builder.HasOne(u => u.Credentials)
                   .WithOne(c => c.User)
                   .HasForeignKey<UserCredentialsEntity>(c => c.UserId)
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(u => u.RefreshToken)
                   .WithOne(t => t.User)
                   .HasForeignKey<UserRefreshTokenEntity>(t => t.UserId)
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(u => u.AppCredentials)
                   .WithOne(c => c.User)
                   .HasForeignKey<UserAppCredentialsEntity>(c => c.UserId)
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.Roles)
                   .WithMany()
                   .UsingEntity<Dictionary<string, object>>(
                       UserRoleAssignmentTableName,
                       right => right.HasOne<UserRoleEntity>()
                                     .WithMany()
                                     .HasForeignKey(RoleIdColumnName)
                                     .OnDelete(DeleteBehavior.Restrict),
                       left => left.HasOne<UserEntity>()
                                   .WithMany()
                                   .HasForeignKey(UserIdColumnName)
                                   .OnDelete(DeleteBehavior.Cascade),
                       join => join.HasKey(UserIdColumnName, RoleIdColumnName));
        }
    }
}
