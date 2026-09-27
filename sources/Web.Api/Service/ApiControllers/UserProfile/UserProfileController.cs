using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.User;
using Web.Api.Service.ApiControllers.RoleParameters;
using Web.Api.Service.Attributes;

namespace Web.Api.Service.ApiControllers.UserProfile
{
    public class UserProfileController : ApiControllerBase
    {
        private readonly IUserProfileService _userProfileService;

        public UserProfileController(IUserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
        }

        [ApiAuthentication(roles: AuthenticationRoleParameters.AllUserRoles)]
        [HttpGet(Name = "GetUserProfile")]
        public async Task<UserProfileModel?> GetUserProfile()
        {
            return await _userProfileService.GetUserProfileAsync();
        }

        [ApiAuthentication(roles: AuthenticationRoleParameters.AllUserRoles)]
        [HttpPost(Name = "UpdateUserProfile")]
        public async Task<UserProfileModel> UpdateUserProfile([FromBody] UserProfileModel userProfile)
        {
            return await _userProfileService.UpdateProfile(userProfile);
        }

        [ApiAuthentication(roles: AuthenticationRoleParameters.AllUserRoles)]
        [HttpPost(Name = "UpdateCredentials")]
        public async Task<bool> UpdateCredentials([FromBody] UserCredentialsUpdateModel credentialsUpdate)
        {
            return await _userProfileService.UpdatePassword(credentialsUpdate);
        }
    }
}
