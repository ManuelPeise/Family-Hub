using Data.Database.Configurations;
using Data.Database.Context.Entities.Family;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Context.Configurations
{
    public class FamilyEntityConfiguration : AEntityBaseConfiguration<FamilyEntity>
    {
        private const string TableName = "Families";

        public override void Configure(EntityTypeBuilder<FamilyEntity> builder)
        {
            base.Configure(builder);

            builder.ToTable(TableName);

            builder.Property(f => f.Name)
                   .HasMaxLength(ColumnLengths.Name)
                   .IsRequired();

            builder.Property(f => f.ContactEmail)
                   .HasMaxLength(ColumnLengths.Email)
                   .IsRequired();

            // Members only exist inside a family, so deleting the family removes them.
            builder.HasMany(f => f.Members)
                   .WithOne(m => m.Family)
                   .HasForeignKey(m => m.FamilyId)
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
