using Data.Database.Configurations;
using Data.Database.Identity.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Identity.Configurations
{
    public class UserCredentialsEntityConfiguration : AEntityBaseConfiguration<UserCredentialsEntity>
    {
        private const string TableName = "UserCredentials";

        public override void Configure(EntityTypeBuilder<UserCredentialsEntity> builder)
        {
            base.Configure(builder);

            builder.ToTable(TableName);

            builder.Property(c => c.PasswordHash)
                   .HasMaxLength(ColumnLengths.Hash)
                   .IsRequired();
        }
    }
}
