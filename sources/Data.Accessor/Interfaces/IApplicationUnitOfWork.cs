namespace Data.Accessor.Interfaces
{
    public interface IApplicationUnitOfWork
    {
        IIdentityUnitOfWork IdentityUnitOfWork { get; }
        Task SaveChanges();
    }
}
