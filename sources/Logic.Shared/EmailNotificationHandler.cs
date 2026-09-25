using Logic.Shared.Interfaces;
using Shared.Enums.Email;

namespace Logic.Shared
{
    public class EmailNotificationHandler: IEmailNotificationHandler
    {
        private readonly IEmailSender _emailSender;

        public EmailNotificationHandler(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public async Task SendRegistrationSuccessNotification(string toAddress, string oneTimePassword)
        {
            var emailContent = EmailContentFactory.CreateEmailContent(EmailNotificationTypeEnum.RegistrationSuccess, oneTimePassword);

            await _emailSender.SendAsync(toAddress, emailContent.Subject, emailContent.HtmlBody);
        }

        public async Task SendEmailNotification(string to, string subject, string body, CancellationToken cancellationToken = default)
        {
            await _emailSender.SendAsync(to, subject, body, cancellationToken);
        }
    }
}
