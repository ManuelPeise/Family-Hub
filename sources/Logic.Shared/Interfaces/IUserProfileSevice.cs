using Shared.Models.User;

namespace Logic.Shared.Interfaces
{
    public interface IUserProfileService
    {
        Task<UserProfileModel?> GetUserProfileAsync();
        Task<UserProfileModel> UpdateProfile(UserProfileModel profile);
        Task<bool> UpdatePassword(UserCredentialsUpdateModel credentialsUpdate);
    }
}
