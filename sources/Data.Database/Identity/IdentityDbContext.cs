using Data.Database.Identity.Configurations;
using Data.Database.Identity.Entities;
using Data.Database.Identity.Seeds;
using Microsoft.EntityFrameworkCore;

namespace Data.Database.Identity
{
    public class IdentityDbContext : ADbContextBase
    {
        public const string ConnectionStringName = "IdentityContext";

        public DbSet<UserEntity> UserTable => Set<UserEntity>();
        public DbSet<UserCredentialsEntity> UserCredentialsTable => Set<UserCredentialsEntity>();
        public DbSet<UserRefreshTokenEntity> UserRefreshTokenTable => Set<UserRefreshTokenEntity>();
        public DbSet<UserRoleEntity> UserRoleTable => Set<UserRoleEntity>();
        public DbSet<UserAppCredentialsEntity> UserAppCredentialsTable => Set<UserAppCredentialsEntity>();

        public IdentityDbContext(DbContextOptions<IdentityDbContext> options)
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
