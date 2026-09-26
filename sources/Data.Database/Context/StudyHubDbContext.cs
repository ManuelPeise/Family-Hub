using Data.Database.Context.Configurations;
using Data.Database.Context.Entities;
using Data.Database.Context.Seeds;
using Microsoft.EntityFrameworkCore;

namespace Data.Database.Context
{
    public class StudyHubDbContext : ADbContextBase
    {
        public const string ConnectionStringName = "IdentityContext";

        public DbSet<UserEntity> UserTable => Set<UserEntity>();
        public DbSet<UserCredentialsEntity> UserCredentialsTable => Set<UserCredentialsEntity>();
        public DbSet<UserRefreshTokenEntity> UserRefreshTokenTable => Set<UserRefreshTokenEntity>();
        public DbSet<UserRoleEntity> UserRoleTable => Set<UserRoleEntity>();
        public DbSet<UserAppCredentialsEntity> UserAppCredentialsTable => Set<UserAppCredentialsEntity>();

        public StudyHubDbContext(DbContextOptions<StudyHubDbContext> options)
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

            modelBuilder.ApplyConfiguration(new UserRoleSeed());
        }
    }
}
