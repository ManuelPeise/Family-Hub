using Shared.Models.User;

namespace Logic.Shared.Interfaces
{
    public interface IUserProfileService
    {
        Task<UserProfile?> GetUserProfileAsync();
    }
}
