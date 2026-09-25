using Logic.Authentication.Interfaces;
using Logic.Shared;
using Logic.Shared.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Logic.Authentication.DI
{
    public static class AuthenticationServiceRegistration
    {
        public static void AddAuthenticationServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthenticationService, AuthenticationService>();
            services.AddScoped<IPasswordHasher, PasswordHasher>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IDefaultAdminSeeder, DefaultAdminSeeder>();
        }
    }
}
