using Logic.Shared.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Logic.UserService.DI
{
    public static class UserServiceRegistration
    {
        public static void RegisterUserServices(this IServiceCollection services)
        {
            services.AddScoped<IUserProfileService, UserProfileService>();
        }


    }
}
