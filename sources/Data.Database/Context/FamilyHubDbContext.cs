using Data.Database.Context.Configurations;
using Data.Database.Context.Entities.Family;
using Data.Database.Context.Entities.User;
using Data.Database.Context.Seeds;
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

        // family related tables
        public DbSet<FamilyEntity> FamilyTable => Set<FamilyEntity>();
        public DbSet<FamilyMemberEntity> FamilyMemberTable => Set<FamilyMemberEntity>();

        public FamilyHubDbContext(DbContextOptions<FamilyHubDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new UserEntityConfiguration());
            modelBuilder.ApplyConfiguration(new UserCredentialsEntityConfiguration());
            modelBuilder.ApplyConfiguration(new UserRefreshTokenEntityConfiguration());
            modelBuilder.ApplyConfiguration(new UserRoleEntityConfiguration());
            modelBuilder.ApplyConfiguration(new UserAppCredentialsEntityConfiguration());

            modelBuilder.ApplyConfiguration(new FamilyEntityConfiguration());
            modelBuilder.ApplyConfiguration(new FamilyMemberEntityConfiguration());

            modelBuilder.ApplyConfiguration(new UserRoleSeed());
        }
    }
}
