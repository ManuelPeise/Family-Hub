using Data.Database.Context.Entities.Family;
using Data.Database.Context.Entities.Security;
using Data.Database.Context.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace Data.Database.Context
{
    public class FamilyHubDbContext : DbContext
    {
        // user related tables
        public DbSet<UserEntity> UserTable => Set<UserEntity>();
        public DbSet<UserCredentialsEntity> UserCredentialsTable => Set<UserCredentialsEntity>();
        public DbSet<UserRefreshTokenEntity> UserRefreshTokenTable => Set<UserRefreshTokenEntity>();
        public DbSet<UserRoleEntity> UserRoleTable => Set<UserRoleEntity>();
        public DbSet<UserAppCredentialsEntity> UserAppCredentialsTable => Set<UserAppCredentialsEntity>();
        public DbSet<UserScopeEntity> UserScopeTable => Set<UserScopeEntity>();
        public DbSet<UserNotificationEntity> UserNotificationTable => Set<UserNotificationEntity>();

        // security related tables
        public DbSet<ScopeEntity> ScopeTable => Set<ScopeEntity>();

        // family related tables
        public DbSet<FamilyAccessRequestEntity> FamilyAccessRequestTable => Set<FamilyAccessRequestEntity>();
        public DbSet<FamilyEntity> FamilyTable => Set<FamilyEntity>();
        public DbSet<FamilyMemberEntity> FamilyMemberTable => Set<FamilyMemberEntity>();
       

        public FamilyHubDbContext(DbContextOptions<FamilyHubDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Picks up every IEntityTypeConfiguration in this assembly (Context/Configurations and Context/Seeds),
            // so a new entity configuration or seed can't be forgotten here.
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(FamilyHubDbContext).Assembly);
        }
    }
}
