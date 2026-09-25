using Microsoft.EntityFrameworkCore;

namespace Data.Database
{
    public abstract class ADbContextBase : DbContext
    {
        public const string SystemUser = "System";

        protected ADbContextBase(DbContextOptions options)
            : base(options)
        {
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            SetAuditFields();

            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override async Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            SetAuditFields();

            return await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void SetAuditFields()
        {
            var timeStamp = DateTime.UtcNow;

            foreach (var entry in ChangeTracker.Entries<AEntityBase>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = timeStamp;
                        if (string.IsNullOrEmpty(entry.Entity.CreatedBy))
                        {
                            entry.Entity.CreatedBy = SystemUser;
                        }
                        break;

                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = timeStamp;
                        break;
                }
            }
        }
    }
}
