using Data.Database.Identity.Entities;

namespace Data.Accessor.Interfaces
{
    public interface IUserRepository : IRepositoryBase<UserEntity>
    {
        /// <summary>
        /// Loads a tracked user with credentials, roles and refresh token, matching either the user name or the email.
        /// </summary>
        Task<UserEntity?> GetByUserNameOrEmailAsync(string userNameOrEmail, CancellationToken cancellationToken = default);
    }
}
