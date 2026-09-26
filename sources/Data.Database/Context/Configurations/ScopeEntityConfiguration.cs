using Data.Database.Configurations;
using Data.Database.Context.Entities.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Context.Configurations
{
    public class ScopeEntityConfiguration : AEntityBaseConfiguration<ScopeEntity>
    {
        private const string TableName = "Scopes";

        public override void Configure(EntityTypeBuilder<ScopeEntity> builder)
        {
            base.Configure(builder);

            builder.ToTable(TableName);

            builder.Property(s => s.Name)
                   .HasMaxLength(ColumnLengths.Name)
                   .IsRequired();

            builder.HasIndex(s => s.Name)
                   .IsUnique();

            builder.HasIndex(s => s.ScopeType)
                   .IsUnique();
        }
    }
}
