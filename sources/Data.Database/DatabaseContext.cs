using Data.Database.Configurations;
using Data.Database.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace Data.Database
{
    public class DatabaseContext : DbContext
    {
        // Define DbSet properties for your entities
        public DbSet<UserEntity> UserTable  => Set<UserEntity>();
        public DbSet<UserCredentialsEntity> UserCredentialsTable => Set<UserCredentialsEntity>();
        public DbSet<RefreshTokenEntity> RefreshTokenTable => Set<RefreshTokenEntity>();
        public DbSet<UserNotificationEntity> UserNotificationTable => Set<UserNotificationEntity>();

        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new RefreshTokenConfiguration());
            modelBuilder.ApplyConfiguration(new UserNotificationConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}
