using Data.Accessor.Interfaces;
using Data.Database;
using Data.Database.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Data.Accessor
{
    public class ApplicationUnitOfWork: IApplicationUnitOfWork
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IIdentityUnitOfWork _identityUnitOfWork;
        private readonly IFamilyUnitOfWork _familyUnitOfWork;
        private readonly IAdministrationUnitOfWork _administrationUnitOfWork;
        private readonly FamilyHubDbContext _familyHubDbContext;

        public IIdentityUnitOfWork IdentityUnitOfWork => _identityUnitOfWork;
        public IFamilyUnitOfWork FamilyUnitOfWork => _familyUnitOfWork;
        public IAdministrationUnitOfWork AdministrationUnitOfWork => _administrationUnitOfWork;


        public ApplicationUnitOfWork(
            IHttpContextAccessor httpContextAccessor,
            FamilyHubDbContext identityDbContext, 
            FamilyHubDbContext familyHubDbContext)
        {
            _httpContextAccessor = httpContextAccessor;
            _familyHubDbContext = familyHubDbContext;
            _identityUnitOfWork = new IdentityUnitOfWork(identityDbContext);
            _familyUnitOfWork = new FamilyUnitOfWork(familyHubDbContext);
            _administrationUnitOfWork = new AdministrationUnitOfWork(familyHubDbContext);
        }

        public Task SaveChanges()
        {
            StampAuditFields();

            var familyHubRows = _familyHubDbContext.SaveChangesAsync();

            return Task.WhenAll(familyHubRows);
        }

        private void StampAuditFields()
        {
            var currentUser = GetCurrentUser();
            var now = DateTime.UtcNow;

            foreach (var entry in _familyHubDbContext.ChangeTracker.Entries<AEntityBase>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAt = now;
                    entry.Entity.CreatedBy = currentUser;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = now;
                    entry.Entity.UpdatedBy = currentUser;
                }
            }
        }

        private string GetCurrentUser()
        {
            var user = _httpContextAccessor.HttpContext?.User;

            return user?.FindFirstValue("email")
                ?? user?.FindFirstValue(ClaimTypes.Email)
                ?? "System";
        }
    }
}
