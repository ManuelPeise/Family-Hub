using Data.Database.Context.Entities.Family;

namespace Data.Accessor.Interfaces
{
    public interface IAdministrationUnitOfWork
    {
        IRepositoryBase<FamilyAccessRequestEntity> FamilyAccessRequestRepository { get; }
    }
}
