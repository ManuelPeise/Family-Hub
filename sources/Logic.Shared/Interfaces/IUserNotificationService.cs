using Shared.Models.Notifications;
namespace Logic.Shared.Interfaces
{
    public interface IUserNotificationService
    {
        Task<List<NotificationExportModel>> GetUserNotificationsAsync();
    }
}
