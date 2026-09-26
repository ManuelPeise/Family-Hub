using Data.Accessor.Interfaces;
using Data.Accessor.Repositories;
using Data.Database.Context;
using Data.Database.Context.Entities.User;

namespace Data.Accessor
{
    public class IdentityUnitOfWork: IIdentityUnitOfWork
    {
        private readonly FamilyHubDbContext _identityDbContext;

        private readonly IRepositoryBase<UserEntity> _userRepository;
        private readonly IRepositoryBase<UserCredentialsEntity> _credentialsRepository;
        private readonly IRepositoryBase<UserAppCredentialsEntity> _appCredentialsRepository;
        private readonly IRepositoryBase<UserRefreshTokenEntity> _refreshTokenRepository;
        private readonly IRepositoryBase<UserRoleEntity> _roleRepository;

        public IRepositoryBase<UserEntity> UserRepository => _userRepository;
        public IRepositoryBase<UserCredentialsEntity> CredentialsRepository => _credentialsRepository;
        public IRepositoryBase<UserAppCredentialsEntity> AppCredentialsRepository => _appCredentialsRepository;
        public IRepositoryBase<UserRefreshTokenEntity> RefreshTokenRepository => _refreshTokenRepository;
        public IRepositoryBase<UserRoleEntity> RoleRepository => _roleRepository;

        public IdentityUnitOfWork(FamilyHubDbContext identityDbContext)
        {
            _identityDbContext = identityDbContext;
            _userRepository = new RepositoryBase<UserEntity>(_identityDbContext);
            _credentialsRepository = new RepositoryBase<UserCredentialsEntity>(_identityDbContext);
            _appCredentialsRepository = new RepositoryBase<UserAppCredentialsEntity>(_identityDbContext);
            _refreshTokenRepository = new RepositoryBase<UserRefreshTokenEntity>(_identityDbContext);
            _roleRepository = new RepositoryBase<UserRoleEntity>(_identityDbContext);
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _identityDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
