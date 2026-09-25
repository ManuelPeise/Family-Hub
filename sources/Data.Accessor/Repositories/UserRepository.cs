using Data.Accessor.Interfaces;
using Data.Database.Identity;
using Data.Database.Identity.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Accessor.Repositories
{
    public class UserRepository : RepositoryBase<UserEntity>, IUserRepository
    {
        public UserRepository(IdentityDbContext context)
            : base(context)
        {
        }

        public async Task<UserEntity?> GetByUserNameOrEmailAsync(string userNameOrEmail, CancellationToken cancellationToken = default)
        {
            return await Query().Include(u => u.Credentials)
                                .Include(u => u.Roles)
                                .Include(u => u.RefreshToken)
                                .FirstOrDefaultAsync(u => u.UserName == userNameOrEmail || u.Email == userNameOrEmail, cancellationToken);
        }
    }
}
