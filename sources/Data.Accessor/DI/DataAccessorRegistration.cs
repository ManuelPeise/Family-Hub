using Data.Accessor.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Data.Accessor.DI
{
    public static class DataAccessorRegistration
    {
        public static void AddDataAccessorServices(this IServiceCollection services)
        {
            services.AddScoped<IApplicationUnitOfWork, ApplicationUnitOfWork>();
            services.AddScoped<IIdentityUnitOfWork, IdentityUnitOfWork>();            
        }
    }
}
