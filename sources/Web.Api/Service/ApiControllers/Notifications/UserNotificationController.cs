using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.Notifications;
using Web.Api.Service.ApiControllers.RoleParameters;
using Web.Api.Service.Attributes;

namespace Web.Api.Service.ApiControllers.Notifications
{
    public class UserNotificationController: ApiControllerBase
    {
        private readonly IUserNotificationService _userNotificationService;
        public UserNotificationController(IUserNotificationService userNotificationService)
        {
            _userNotificationService = userNotificationService;
        }

        [ApiAuthentication(roles: AuthenticationRoleParameters.AllUserRoles)]
        [HttpGet(Name = "GetUserNotifications")]
        public async Task<List<NotificationExportModel>> GetUserNotifications()
        {
            return await _userNotificationService.GetUserNotificationsAsync();
        }
    }
}
