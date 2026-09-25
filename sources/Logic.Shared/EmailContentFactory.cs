using Shared.Enums.Email;
using Shared.Models.Email;
using System.Net;

namespace Logic.Shared
{
    /// <summary>
    /// Builds the HTML content of the emails the application sends. Values passed in are HTML-encoded.
    /// </summary>
    public static class EmailContentFactory
    {
        private const string SignatureHtml = "<p>Best regards,<br>The Team</p>";

        public static EmailContent CreateEmailContent(EmailNotificationTypeEnum emailNotificationTypeEnum, params string[] args)
        {
            switch (emailNotificationTypeEnum)
            {
                case EmailNotificationTypeEnum.RegistrationSuccess:
                    return CreateRegistrationSuccess(args[0]);
                default:
                    throw new ArgumentOutOfRangeException(nameof(emailNotificationTypeEnum), emailNotificationTypeEnum, null);
            }
        }

        private static EmailContent CreateRegistrationSuccess(string oneTimePassword)
        {
            ArgumentException.ThrowIfNullOrEmpty(oneTimePassword);

            return Create("Registration Successful",
                          "Your registration was successful.",
                          "Welcome!",
                          $"Your one-time password is: {oneTimePassword}");
        }

        private static EmailContent Create(string subject, params string[] paragraphs)
        {
            var paragraphsHtml = string.Concat(paragraphs.Select(p => $"<p>{WebUtility.HtmlEncode(p)}</p>"));

            return new EmailContent
            {
                Subject = subject,
                HtmlBody = paragraphsHtml + SignatureHtml,
            };
        }
    }
}
