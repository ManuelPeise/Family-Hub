using Data.Database;
using Microsoft.EntityFrameworkCore;
using Shared.Models.Options;

namespace Web.Api.Bundels
{
    internal static class AppServiceRegistration
    {
        private const string ConnectionStringName = "StudyHubContext";
        private const string JwtOptionsSectionName = "Jwt";
        private const string EmailOptionsSectionName = "Email";

        internal static void AddAppServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDatabaseServices(configuration);
            services.AddOptionModels(configuration);

            services.AddCorsServices();

            services.AddControllers();
            services.AddOpenApi();
        }

        private static void AddDatabaseServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionSting = configuration.GetConnectionString(ConnectionStringName) ?? throw new InvalidOperationException("Connection string 'StudyHubContext' not found.");

            services.AddDbContext<DatabaseContext>(options => options.UseMySQL(connectionSting));
        }

        private static void AddCorsServices(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });
        }

        private static void AddOptionModels(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<JwtOptions>(configuration.GetSection(JwtOptionsSectionName));
            services.Configure<EmailOptions>(configuration.GetSection(EmailOptionsSectionName));
        }
    }
}
