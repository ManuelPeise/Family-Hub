using Logic.Shared.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Logic.Shared.DI
{
    public static class SharedServiceRegistration
    {
        public static void AddSharedServices(this IServiceCollection services)
        {
            services.AddSingleton<IPasswordHasher, PasswordHasher>();
            services.AddSingleton<IEmailSender, SmtpEmailSender>();
            services.AddSingleton<IEmailNotificationHandler, EmailNotificationHandler>();
        }
    }
}
