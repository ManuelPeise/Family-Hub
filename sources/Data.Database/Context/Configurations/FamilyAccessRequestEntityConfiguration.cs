using Data.Database.Configurations;
using Data.Database.Context.Entities.Family;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Context.Configurations
{
    public class FamilyAccessRequestEntityConfiguration : AEntityBaseConfiguration<FamilyAccessRequestEntity>
    {
        private const string TableName = "FamilyAccessRequests";

        public override void Configure(EntityTypeBuilder<FamilyAccessRequestEntity> builder)
        {
            base.Configure(builder);

            builder.ToTable(TableName);

            builder.Property(r => r.FamilyName)
                   .HasMaxLength(ColumnLengths.Name)
                   .IsRequired();

            builder.Property(r => r.ContactMailAddress)
                   .HasMaxLength(ColumnLengths.Email)
                   .IsRequired();

            builder.Property(r => r.MainMemberFirstName)
                   .HasMaxLength(ColumnLengths.Name)
                   .IsRequired();

            builder.Property(r => r.MainMemberLastName)
                   .HasMaxLength(ColumnLengths.Name)
                   .IsRequired();

            builder.Property(r => r.MainMemberUserName)
                   .HasMaxLength(ColumnLengths.UserName)
                   .IsRequired();

            // A family can be requested only once per contact address. The service checks this first,
            // and the index catches two identical requests that arrive at the same time.
            builder.HasIndex(r => new { r.FamilyName, r.ContactMailAddress })
                   .IsUnique();
        }
    }
}
