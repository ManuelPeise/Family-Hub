using Data.Accessor.Interfaces;
using Logic.Shared;
using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shared.Models.User;

namespace Logic.UserService
{
    public class UserProfileService : ALogicBase, IUserProfileService
    {
        private readonly ILogger<UserProfileService> _logger;
        private readonly IApplicationUnitOfWork _applicationUnitOfWork;

        public UserProfileService(
            ILogger<UserProfileService> logger,
            IHttpContextAccessor httpContextAccessor,
            IApplicationUnitOfWork applicationUnitOfWork) : base(httpContextAccessor)
        {
            _logger = logger;
            _applicationUnitOfWork = applicationUnitOfWork;
        }

        public async Task<UserProfile?> GetUserProfileAsync()
        {
            try
            {
                var userProfile = _applicationUnitOfWork.IdentityUnitOfWork.UserRepository.Query()
                    .Where(u => u.Id == CurrentUser.UserId)
                    .Select(u => new UserProfile
                    {
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        UserName = u.UserName,
                        Email = u.Email,
                        DateOfBirth = u.DateOfBirth
                    })
                    .FirstOrDefault();

                return userProfile;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while retrieving user profile.");

                return null;
            }
        }
    }
}
