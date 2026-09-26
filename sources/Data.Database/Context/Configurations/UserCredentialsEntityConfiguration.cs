using Data.Database.Configurations;
using Data.Database.Context.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Context.Configurations
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
