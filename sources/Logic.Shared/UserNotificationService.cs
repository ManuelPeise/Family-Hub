using Data.Accessor.Interfaces;
using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shared.Enums.Notifications;
using Shared.Enums.User;
using Shared.Models.Notifications;
using System.Globalization;

namespace Logic.Shared
{
    public class UserNotificationService : ALogicBase, IUserNotificationService
    {
        private readonly ILogger<UserNotificationService> _logger;
        private readonly IApplicationUnitOfWork _applicationUnitOfWork;

        public UserNotificationService(
            IHttpContextAccessor httpContextAccessor,
            ILogger<UserNotificationService> logger,
            IApplicationUnitOfWork applicationUnitOfWork) : base(httpContextAccessor)
        {
            _logger = logger;
            _applicationUnitOfWork = applicationUnitOfWork;
        }

        public async Task<List<NotificationExportModel>> GetUserNotificationsAsync()
        {
            try
            {
                var userEntity = _applicationUnitOfWork.IdentityUnitOfWork.UserRepository.Query()
                    .Include(u => u.Notifications)
                    .FirstOrDefault(u => u.Id == CurrentUser.UserId);

                if (userEntity == null)
                {
                    _logger.LogWarning("User not found for userId: {UserId}", CurrentUser.UserId);
                    return new List<NotificationExportModel>();
                }

                var culture = userEntity.Language == LanguageTypeEnum.English ? "en-US" : "de-DE";

                // Set the current thread's culture to the user's preferred language
                Thread.CurrentThread.CurrentCulture = new CultureInfo(culture);

                var notificationGroups = userEntity.Notifications
                      .GroupBy(n => n.NotificationType)
                      .ToList();

                var notifications = new List<NotificationExportModel>();

                foreach (var group in notificationGroups)
                {
                    if (!group.Any(x => x.IsActive))
                    {
                        continue;
                    }

                    var notificationExportModel = new NotificationExportModel
                    {
                        Id = group.First().Id,
                        NotificationType = group.Key,
                        Notification = GetNotificationMessage(group.Key, group.Count(x => x.IsActive)),
                        IsActive = group.First().IsActive
                    };

                    notifications.Add(notificationExportModel);
                }

                return notifications;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while getting user notifications for userId: {UserId}", CurrentUser.UserId);

                return new List<NotificationExportModel>();
            }
        }



        public async Task<List<NotificationExportModel>> UpdateUserNotificationsAsync(NotificationExportModel notification)
        {
            try
            {
                var userEntity = _applicationUnitOfWork.IdentityUnitOfWork.UserRepository.Query()
                    .Include(u => u.Notifications)
                    .FirstOrDefault(u => u.Id == CurrentUser.UserId);

                if (userEntity == null)
                {
                    _logger.LogWarning("User not found for userId: {UserId}", CurrentUser.UserId);

                    return await GetUserNotificationsAsync();
                }

                var notifications = userEntity.Notifications.Where(n => n.NotificationType == notification.NotificationType).ToList();

                if (!notifications.Any())
                {
                    _logger.LogWarning("No notifications found for notificationType: {NotificationType} and userId: {UserId}", notification.NotificationType, CurrentUser.UserId);

                    return await GetUserNotificationsAsync();
                }

                foreach (var notificationEntity in notifications)
                {
                    notificationEntity.IsActive = notification.IsActive;
                    _applicationUnitOfWork.IdentityUnitOfWork.NotificationRepository.Update(notificationEntity);
                }

                await _applicationUnitOfWork.SaveChanges();

                return await GetUserNotificationsAsync();

            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error occurred while getting user notifications for userId: {UserId}", CurrentUser.UserId);

                return await GetUserNotificationsAsync();
            }
        }

        private string GetNotificationMessage(NotificationTypeEnum key, int v)
        {
            switch (key)
            {
                case NotificationTypeEnum.FamilyMemberRequest:
                    return RESX.Notification.NotificationIncomingAccessRequest.Replace("{Count}", v.ToString());
                default:
                    return string.Empty;
            }
        }
    }
}
