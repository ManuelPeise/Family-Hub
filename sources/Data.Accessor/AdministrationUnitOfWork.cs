using Data.Accessor.Interfaces;
using Data.Accessor.Repositories;
using Data.Database.Context;
using Data.Database.Context.Entities.Family;

namespace Data.Accessor
{
    public class AdministrationUnitOfWork : IAdministrationUnitOfWork
    {
        private readonly IRepositoryBase<FamilyAccessRequestEntity> _familyAccessRequestRepository;

        public IRepositoryBase<FamilyAccessRequestEntity> FamilyAccessRequestRepository => _familyAccessRequestRepository;
        public AdministrationUnitOfWork(FamilyHubDbContext familyHubDbContext)
        {
            _familyAccessRequestRepository = new RepositoryBase<FamilyAccessRequestEntity>(familyHubDbContext);
        }
    }
}
