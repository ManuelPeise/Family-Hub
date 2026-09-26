using Data.Database.Configurations;
using Data.Database.Context.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Context.Configurations
{
    public class UserNotificationEntityConfiguration : AEntityBaseConfiguration<UserNotificationEntity>
    {
        private const string TableName = "UserNotifications";

        public override void Configure(EntityTypeBuilder<UserNotificationEntity> builder)
        {
            base.Configure(builder);

            builder.ToTable(TableName);

            builder.Property(n => n.MessageResourceKey)
                   .HasMaxLength(ColumnLengths.ResourceKey)
                   .IsRequired();

            // Serves the "active notifications of a user" lookup. UserId leads the index,
            // so it also serves the FK, and no separate UserId index is needed.
            builder.HasIndex(n => new { n.UserId, n.IsActive });

            // Deleting a user removes their notifications.
            builder.HasOne(n => n.User)
                   .WithMany(u => u.Notifications)
                   .HasForeignKey(n => n.UserId)
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
