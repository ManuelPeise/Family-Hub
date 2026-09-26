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
            // Scoped: it uses the scoped unit of work (DbContext) and reads the current request's user.
            services.AddScoped<IUserNotificationService, UserNotificationService>();
        }
    }
}
