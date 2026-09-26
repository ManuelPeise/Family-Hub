using Data.Database.Context.Entities.User;

namespace Data.Accessor.Interfaces
{
    public interface IIdentityUnitOfWork
    {
        IRepositoryBase<UserEntity> UserRepository { get; }
        IRepositoryBase <UserCredentialsEntity> CredentialsRepository { get; }
        IRepositoryBase<UserAppCredentialsEntity> AppCredentialsRepository { get; }
        IRepositoryBase<UserRefreshTokenEntity> RefreshTokenRepository { get; }
        IRepositoryBase<UserRoleEntity> RoleRepository { get; }
        IRepositoryBase<UserNotificationEntity> NotificationRepository { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
