using Data.Accessor.Interfaces;
using Data.Accessor.Repositories;
using Data.Database.Context;
using Data.Database.Context.Entities.Family;

namespace Data.Accessor
{
    public class FamilyUnitOfWork: IFamilyUnitOfWork
    {
        private readonly FamilyHubDbContext _context;

        private IRepositoryBase<FamilyEntity> _familyRepository;   
        private IRepositoryBase<FamilyMemberEntity> _familyMemberRepository;

        public IRepositoryBase<FamilyEntity> FamilyRepository => _familyRepository;
        public IRepositoryBase<FamilyMemberEntity> FamilyMemberRepository => _familyMemberRepository;

        public FamilyUnitOfWork(FamilyHubDbContext context)
        {
            _context = context;

            _familyRepository = new RepositoryBase<FamilyEntity>(_context);
            _familyMemberRepository = new RepositoryBase<FamilyMemberEntity>(_context);
        }
    }
}
