using Data.Accessor;
using Data.Accessor.Interfaces;
using Data.Database;
using Logic.Shared;
using Logic.Shared.Interfaces;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Shared.Models.Options;

namespace Web.Api.Bundels
{
    internal static class AppServiceRegistration
    {
        private const string ConnectionStringName = "StudyHubContext";
        private const string JwtOptionsSectionName = "Jwt";
        private const string EmailOptionsSectionName = "Email";
        private const string SeqOptionsSectionName = "Seq";
        private const string AdminOptionsSectionName = "Admin";

        internal static void AddAppServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddLoggingServices(configuration);
            services.AddDatabaseServices(configuration);
            services.AddOptionModels(configuration);
            services.AddLogicServices();

            services.AddCorsServices();

            services.AddControllers();
            services.AddOpenApi();
        }

        private static void AddLoggingServices(this IServiceCollection services, IConfiguration configuration)
        {
            var seqOptions = configuration.GetSection(SeqOptionsSectionName).Get<SeqOptions>()
                ?? throw new InvalidOperationException($"Configuration section '{SeqOptionsSectionName}' not found.");

            services.AddSerilog((serviceProvider, loggerConfiguration) =>
            {
                loggerConfiguration.ReadFrom.Configuration(configuration)
                                   .ReadFrom.Services(serviceProvider)
                                   .Enrich.FromLogContext()
                                   .WriteTo.Console()
                                   .WriteTo.Seq(seqOptions.ServerUrl);
            });
        }

        private static void AddDatabaseServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString(ConnectionStringName)
                ?? throw new InvalidOperationException($"Connection string '{ConnectionStringName}' not found.");

            services.AddDbContext<DatabaseContext>(options => options.UseMySQL(connectionString));
            services.AddScoped(typeof(IRepositoryBase<>), typeof(RepositoryBase<>));
        }

        private static void AddLogicServices(this IServiceCollection services)
        {
            services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
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
            services.Configure<AdminOptions>(configuration.GetSection(AdminOptionsSectionName));
        }
    }
}
