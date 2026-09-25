using Data.Database.Configurations;
using Data.Database.Identity.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Identity.Configurations
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

            // The user holds the foreign keys, so the credential rows are the principals.
            // Restrict / SetNull keep a credential delete from cascading into the user.
            builder.HasOne(u => u.Credentials)
                   .WithOne()
                   .HasForeignKey<UserEntity>(u => u.CredentialsId)
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(u => u.RefreshToken)
                   .WithOne()
                   .HasForeignKey<UserEntity>(u => u.RefreshTokenId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.SetNull);

            builder.HasOne(u => u.AppCredentials)
                   .WithOne()
                   .HasForeignKey<UserEntity>(u => u.AppCredentialsId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.SetNull);

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
