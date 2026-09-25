using Data.Database.Configurations;
using Data.Database.Identity.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Identity.Configurations
{
    public class UserRefreshTokenEntityConfiguration : AEntityBaseConfiguration<UserRefreshTokenEntity>
    {
        private const string TableName = "UserRefreshTokens";

        public override void Configure(EntityTypeBuilder<UserRefreshTokenEntity> builder)
        {
            base.Configure(builder);

            builder.ToTable(TableName);

            builder.Property(t => t.RefreshToken)
                   .HasMaxLength(ColumnLengths.Token)
                   .IsRequired();

            builder.HasIndex(t => t.RefreshToken)
                   .IsUnique();
        }
    }
}
