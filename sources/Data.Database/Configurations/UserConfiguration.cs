using Data.Database.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> b)
        {
            b.Property(u => u.Email).HasMaxLength(256).IsRequired();
            b.Property(u => u.UserName).HasMaxLength(64).IsRequired();
            b.Property(u => u.FirstName).HasMaxLength(100);
            b.Property(u => u.LastName).HasMaxLength(100);
            b.Property(u => u.UserRole).HasConversion<string>().HasMaxLength(32);

            b.HasIndex(u => u.Email).IsUnique();
            b.HasIndex(u => u.UserName).IsUnique();

            b.HasOne(u => u.Credentials)
             .WithOne(c => c.User)
             .HasForeignKey<UserCredentialsEntity>(c => c.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasMany(u => u.Notifications)
             .WithOne(n => n.User)
             .HasForeignKey(n => n.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasMany(u => u.RefreshTokens)
             .WithOne(t => t.User)
             .HasForeignKey(t => t.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
