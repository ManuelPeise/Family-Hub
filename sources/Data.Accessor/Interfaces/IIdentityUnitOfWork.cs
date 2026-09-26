using Data.Database.Context.Entities;

namespace Data.Accessor.Interfaces
{
    public interface IIdentityUnitOfWork
    {
        IRepositoryBase<UserEntity> UserRepository { get; }
        IRepositoryBase <UserCredentialsEntity> CredentialsRepository { get; }
        IRepositoryBase<UserAppCredentialsEntity> AppCredentialsRepository { get; }
        IRepositoryBase<UserRefreshTokenEntity> RefreshTokenRepository { get; }
        IRepositoryBase<UserRoleEntity> RoleRepository { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
