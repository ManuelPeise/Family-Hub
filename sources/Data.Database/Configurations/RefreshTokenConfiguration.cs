using Data.Database.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Configurations
{
    public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshTokenEntity>
    {
        public void Configure(EntityTypeBuilder<RefreshTokenEntity> b)
        {
            b.Property(t => t.TokenHash).HasMaxLength(128).IsRequired();
            b.HasIndex(t => t.TokenHash).IsUnique();
        }
    }
}
