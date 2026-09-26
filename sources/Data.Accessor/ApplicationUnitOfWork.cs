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
        private readonly StudyHubDbContext _studyHubDbContext;

        public IIdentityUnitOfWork IdentityUnitOfWork => _identityUnitOfWork;
        
        public ApplicationUnitOfWork(
            IHttpContextAccessor httpContextAccessor,
            StudyHubDbContext identityDbContext, 
            StudyHubDbContext studyHubDbContext)
        {
            _httpContextAccessor = httpContextAccessor;
            _studyHubDbContext = studyHubDbContext;
            _identityUnitOfWork = new IdentityUnitOfWork(identityDbContext);
        }

        public Task SaveChanges()
        {
            StampAuditFields();

            var studyHubRows = _studyHubDbContext.SaveChangesAsync();

            return Task.WhenAll(studyHubRows);
        }

        private void StampAuditFields()
        {
            var currentUser = GetCurrentUser();
            var now = DateTime.UtcNow;

            foreach (var entry in _studyHubDbContext.ChangeTracker.Entries<AEntityBase>())
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
