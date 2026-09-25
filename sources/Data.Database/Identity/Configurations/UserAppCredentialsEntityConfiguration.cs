using Data.Database.Configurations;
using Data.Database.Identity.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Identity.Configurations
{
    public class UserAppCredentialsEntityConfiguration : AEntityBaseConfiguration<UserAppCredentialsEntity>
    {
        private const string TableName = "UserAppCredentials";

        public override void Configure(EntityTypeBuilder<UserAppCredentialsEntity> builder)
        {
            base.Configure(builder);

            builder.ToTable(TableName);

            builder.Property(c => c.Pin)
                   .HasMaxLength(ColumnLengths.Hash)
                   .IsRequired();
        }
    }
}
