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

        public async Task<UserProfileModel?> GetUserProfileAsync()
        {
            try
            {
                var userProfile = _applicationUnitOfWork.IdentityUnitOfWork.UserRepository.Query()
                    .Where(u => u.Id == CurrentUser.UserId)
                    .Select(u => new UserProfileModel
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        UserName = u.UserName,
                        Email = u.Email,
                        DateOfBirth = u.DateOfBirth,
                        Language = u.Language
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

        public async Task<UserProfileModel> UpdateProfile(UserProfileModel profile)
        {
            try
            {
                var currentUserId = CurrentUser.UserId;

                var userEntity = await _applicationUnitOfWork.IdentityUnitOfWork.UserRepository.GetByIdAsync(currentUserId);
                 
                if (userEntity != null)
                {
                    userEntity.FirstName = profile.FirstName;
                    userEntity.LastName = profile.LastName;
                    userEntity.DateOfBirth = profile.DateOfBirth;
                    userEntity.Language = profile.Language;

                    await _applicationUnitOfWork.IdentityUnitOfWork.SaveChangesAsync();

                    return new UserProfileModel
                    {
                        Id = userEntity.Id,
                        FirstName = userEntity.FirstName,
                        LastName = userEntity.LastName,
                        UserName = userEntity.UserName,
                        Email = userEntity.Email,
                        DateOfBirth = userEntity.DateOfBirth,
                        Language = userEntity.Language,
                    };
                }

                throw new Exception("User not found.");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while updating user profile.");

                return profile;
            }
        }

        public async Task<bool> UpdatePassword(UserCredentialsUpdateModel credentialsUpdate)
        {
            try
            {
                if (!credentialsUpdate.Match())
                {
                    throw new Exception("New password and its replication do not match.");
                }

                var userEntity = _applicationUnitOfWork.IdentityUnitOfWork.UserRepository.Query()
                    .Include(u => u.Credentials)
                    .Where(u => u.Id == CurrentUser.UserId)
                    .FirstOrDefault();

                if (userEntity != null)
                {
                    var passwordHasher = new PasswordHasher();

                    if (!passwordHasher.VerifyPassword(credentialsUpdate.CurrentPassword, userEntity.Credentials.PasswordHash))
                    {
                        throw new Exception("Current password is incorrect.");
                    }

                    userEntity.Credentials.PasswordHash = passwordHasher.HashPassword(credentialsUpdate.NewPassword);
                    userEntity.Credentials.IsOnTimePassword = false;
                    userEntity.Credentials.PasswordExpiresAt = DateTime.UtcNow.AddDays(90);

                    await _applicationUnitOfWork.IdentityUnitOfWork.SaveChangesAsync();

                    return true;
                }
                throw new Exception("User not found.");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while updating user password.");

                return false;
            }
        }
    }
}
