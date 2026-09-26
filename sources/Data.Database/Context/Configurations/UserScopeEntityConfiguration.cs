using Data.Database.Configurations;
using Data.Database.Context.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Context.Configurations
{
    public class UserScopeEntityConfiguration : AEntityBaseConfiguration<UserScopeEntity>
    {
        private const string TableName = "UserScopes";

        public override void Configure(EntityTypeBuilder<UserScopeEntity> builder)
        {
            base.Configure(builder);

            builder.ToTable(TableName);

            // A user holds each scope only once. UserId leads the index, so it also serves
            // the "scopes of a user" lookup and the FK, and no separate UserId index is needed.
            builder.HasIndex(us => new { us.UserId, us.ScopeId })
                   .IsUnique();

            // Deleting a user removes their scope grants.
            builder.HasOne(us => us.User)
                   .WithMany(u => u.UserScopes)
                   .HasForeignKey(us => us.UserId)
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Cascade);

            // A scope that is still granted to a user can't be deleted.
            builder.HasOne(us => us.Scope)
                   .WithMany()
                   .HasForeignKey(us => us.ScopeId)
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
