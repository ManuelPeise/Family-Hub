using Data.Database.Context.Entities.Family;

namespace Data.Accessor.Interfaces
{
    public interface IFamilyUnitOfWork
    {
        IRepositoryBase<FamilyEntity> FamilyRepository { get; }
        IRepositoryBase<FamilyMemberEntity> FamilyMemberRepository { get; }
    }
}
