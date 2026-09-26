using Data.Database.Configurations;
using Data.Database.Context.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Context.Configurations
{
    public class UserRefreshTokenEntityConfiguration : AEntityBaseConfiguration<UserRefreshTokenEntity>
    {
        private const string TableName = "UserRefreshTokens";

        public override void Configure(EntityTypeBuilder<UserRefreshTokenEntity> builder)
        {
            base.Configure(builder);

            builder.ToTable(TableName);

            // Only the SHA-256 hash of the token is stored (64 hex characters), never the token itself.
            builder.Property(t => t.RefreshToken)
                   .HasMaxLength(ColumnLengths.Hash)
                   .IsRequired();

            builder.HasIndex(t => t.RefreshToken)
                   .IsUnique();
        }
    }
}
