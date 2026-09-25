using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Configurations
{
    public abstract class AEntityBaseConfiguration<TEntity> : IEntityTypeConfiguration<TEntity> where TEntity : AEntityBase
    {
        public virtual void Configure(EntityTypeBuilder<TEntity> builder)
        {
            builder.HasKey(e => e.Id);

            builder.Property(e => e.CreatedBy)
                   .HasMaxLength(ColumnLengths.UserName)
                   .IsRequired();

            builder.Property(e => e.UpdatedBy)
                   .HasMaxLength(ColumnLengths.UserName);
        }
    }
}
