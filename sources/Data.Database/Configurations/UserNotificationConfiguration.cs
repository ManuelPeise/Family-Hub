using Data.Database.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Database.Configurations
{
    public class UserNotificationConfiguration : IEntityTypeConfiguration<UserNotificationEntity>
    {
        public void Configure(EntityTypeBuilder<UserNotificationEntity> b)
        {
            b.Property(n => n.Message).HasMaxLength(1000).IsRequired();
            b.HasIndex(n => new { n.UserId, n.TimeStampUtc });
        }
    }
}
