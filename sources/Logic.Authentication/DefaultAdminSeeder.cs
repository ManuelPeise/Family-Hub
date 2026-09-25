using Data.Accessor.Interfaces;
using Data.Database.Identity.Entities;
using Logic.Authentication.Interfaces;
using Logic.Shared.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Shared.Enums.Auth;
using Shared.Models.Options;

namespace Logic.Authentication
{
    public class DefaultAdminSeeder : IDefaultAdminSeeder
    {
        private const int PasswordLifetimeDays = 90;

        private readonly ILogger<DefaultAdminSeeder> _logger;
        private readonly IApplicationUnitOfWork _applicationUnitOfWork;
        private readonly IPasswordHasher _passwordHasher;
        private readonly AdminOptions _adminOptions;

        public DefaultAdminSeeder(
            ILogger<DefaultAdminSeeder> logger,
            IApplicationUnitOfWork applicationUnitOfWork,
            IPasswordHasher passwordHasher,
            IOptions<AdminOptions> adminOptions)
        {
            _logger = logger;
            _applicationUnitOfWork = applicationUnitOfWork;
            _passwordHasher = passwordHasher;
            _adminOptions = adminOptions.Value;
        }

        public async Task SeedAsync(CancellationToken cancellationToken = default)
        {
            var identityUnitOfWork = _applicationUnitOfWork.IdentityUnitOfWork;

            var adminExists = await identityUnitOfWork.UserRepository.AnyAsync(u => u.Roles.Any(r => r.RoleType == UserRoleEnum.Admin), cancellationToken);

            if (adminExists)
            {
                return;
            }

            ValidateAdminOptions();

            var userNameOrEmailTaken = await identityUnitOfWork.UserRepository.AnyAsync(u => u.UserName == _adminOptions.UserName || u.Email == _adminOptions.Email, cancellationToken);

            if (userNameOrEmailTaken)
            {
                _logger.LogWarning("No admin exists, but the configured admin user name '{UserName}' or email is already used by another user. The default admin was not created.", _adminOptions.UserName);

                return;
            }

            var adminRole = await identityUnitOfWork.RoleRepository.GetFirstOrDefaultAsync(r => r.RoleType == UserRoleEnum.Admin, cancellationToken: cancellationToken)
                ?? throw new InvalidOperationException("The Admin role is missing. It is seeded by the Identity migrations.");

            var admin = new UserEntity
            {
                FirstName = _adminOptions.FirstName,
                LastName = _adminOptions.LastName,
                Email = _adminOptions.Email,
                UserName = _adminOptions.UserName,
                DateOfBirth = _adminOptions.DateOfBirth,
                Roles = [adminRole],
                Credentials = new UserCredentialsEntity
                {
                    PasswordHash = _passwordHasher.HashPassword(_adminOptions.Password),
                    PasswordExpiresAt = DateTime.UtcNow.AddDays(PasswordLifetimeDays),
                },
            };

            await identityUnitOfWork.UserRepository.AddAsync(admin, cancellationToken);
            await _applicationUnitOfWork.SaveChanges();

            _logger.LogInformation("Default admin '{UserName}' created.", admin.UserName);
        }

        private void ValidateAdminOptions()
        {
            if (string.IsNullOrWhiteSpace(_adminOptions.UserName)
                || string.IsNullOrWhiteSpace(_adminOptions.Email)
                || string.IsNullOrWhiteSpace(_adminOptions.Password))
            {
                throw new InvalidOperationException("No admin user exists. Configure Admin:UserName, Admin:Email and Admin:Password to create the default admin.");
            }
        }
    }
}
