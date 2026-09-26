using Logic.Administration.Family;
using Logic.Shared.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Logic.Administration.DI
{
    public static class AdministrationServiceRegistration
    {
        public static void AddAdministrationServices(this IServiceCollection services)
        {
            services.AddScoped<IFamilyMemberAdministrationModule, FamilyMemberAdministrationModule>();
        }
    }
}
