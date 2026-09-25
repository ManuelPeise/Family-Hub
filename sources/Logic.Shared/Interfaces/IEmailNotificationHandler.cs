namespace Logic.Shared.Interfaces
{
    public interface IEmailNotificationHandler
    {
        Task SendRegistrationSuccessNotification(string toAddress, string oneTimePassword);
        Task SendEmailNotification(string to, string subject, string body, CancellationToken cancellationToken = default);
    }
}
