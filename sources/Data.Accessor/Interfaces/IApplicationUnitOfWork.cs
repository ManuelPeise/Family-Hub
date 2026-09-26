namespace Data.Accessor.Interfaces
{
    public interface IApplicationUnitOfWork
    {
        IIdentityUnitOfWork IdentityUnitOfWork { get; }
        IFamilyUnitOfWork FamilyUnitOfWork { get; }
        IAdministrationUnitOfWork AdministrationUnitOfWork { get; }
        Task SaveChanges();
    }
}
