using Data.Accessor.Interfaces;
using Data.Database.Context.Entities.User;
using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Shared.Models.Notifications;
using System;
using System.Collections.Generic;
using System.Text;

namespace Logic.Shared
{
    public class UserNotificationService : ALogicBase,  IUserNotificationService
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
                var notificationEntities = _applicationUnitOfWork.IdentityUnitOfWork.NotificationRepository.Query()
                    .Where(n => n.UserId == CurrentUser.UserId)
                    .ToList();

                return MapToExportModel(notificationEntities.ToList());
            }
            catch(Exception exception)
            {
                _logger.LogError(exception, "Error occurred while getting user notifications for userId: {UserId}", CurrentUser.UserId);
               
                return new List<NotificationExportModel>();
            }
        }

        private List<NotificationExportModel> MapToExportModel(List<UserNotificationEntity> notificationEntities)
        {
            var notificationExportModels = notificationEntities?.Select(n => new NotificationExportModel
            {
                NotificationType = n.NotificationType,
                MessageResourceKey = n.MessageResourceKey,
                IsActive = n.IsActive
            }).ToList() ?? new List<NotificationExportModel>();

            return notificationExportModels;
        }
    }
}
