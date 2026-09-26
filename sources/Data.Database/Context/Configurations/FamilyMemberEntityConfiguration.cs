using Data.Database.Configurations;
using Data.Database.Context.Entities.Family;
using Data.Database.Context.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Context.Configurations
{
    public class FamilyMemberEntityConfiguration : AEntityBaseConfiguration<FamilyMemberEntity>
    {
        private const string TableName = "FamilyMembers";

        public override void Configure(EntityTypeBuilder<FamilyMemberEntity> builder)
        {
            base.Configure(builder);

            builder.ToTable(TableName);

            builder.Property(m => m.MemberType)
                   .IsRequired();

            // A user can join a family only once. FamilyId leads the index, so it also serves
            // the "members of a family" lookup and the FK, and no separate FamilyId index is needed.
            builder.HasIndex(m => new { m.FamilyId, m.UserId })
                   .IsUnique();

            // Deleting a user removes their memberships, but never the family itself.
            builder.HasOne(m => m.User)
                   .WithMany()
                   .HasForeignKey(m => m.UserId)
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
