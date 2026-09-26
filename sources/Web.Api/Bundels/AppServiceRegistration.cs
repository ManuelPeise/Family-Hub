using Data.Database.Context;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Shared.Models.Options;
using Data.Accessor.DI;
using Logic.Authentication;
using Logic.Authentication.DI;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Net.Http.Headers;
using Web.Api.Service.Auth;
using Web.Api.Service.OpenApi;
using Logic.Shared.DI;

namespace Web.Api.Bundels
{
    internal static class AppServiceRegistration
    {
        private const string JwtOptionsSectionName = "Jwt";
        private const string EmailOptionsSectionName = "Email";
        private const string SeqOptionsSectionName = "Seq";
        private const string AdminOptionsSectionName = "Admin";
        private const string FamilyHubConnectionStringName = "FamilyHubContext";

        internal const string OpenApiDocumentName = "v1";
        internal const string OpenApiDocumentTitle = "FamilyHub API";

        internal static void AddAppServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpContextAccessor();
            services.AddLoggingServices(configuration);
            services.AddDatabaseServices(configuration);
            services.AddOptionModels(configuration);
            services.AddJwtAuthentication(configuration);
            services.AddDataAccessorServices();
            services.AddAuthenticationServices();
            services.AddSharedServices();

            services.AddCorsServices();

            services.AddControllers();
            services.AddOpenApiServices();
        }

        private static void AddOpenApiServices(this IServiceCollection services)
        {
            services.AddOpenApi(OpenApiDocumentName, options =>
            {
                options.AddDocumentTransformer((document, context, cancellationToken) =>
                {
                    document.Info.Title = OpenApiDocumentTitle;
                    return Task.CompletedTask;
                });
                options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
                options.AddOperationTransformer<BearerSecurityRequirementTransformer>();
            });
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
            var familyHubConnectionString = configuration.GetConnectionString(FamilyHubConnectionStringName)
                ?? throw new InvalidOperationException($"Connection string '{FamilyHubConnectionStringName}' not found.");

            services.AddDbContext<FamilyHubDbContext>(options => options.UseMySQL(familyHubConnectionString));
        }

        private static void AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtOptions = configuration.GetSection(JwtOptionsSectionName).Get<JwtOptions>()
                ?? throw new InvalidOperationException($"Configuration section '{JwtOptionsSectionName}' not found.");

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        // Keep the claim names from the token ("sub", "email", "role") instead of mapping them to long URIs.
                        options.MapInboundClaims = false;
                        options.TokenValidationParameters = JwtTokenParameters.CreateValidationParameters(jwtOptions);

                        // Browsers send the token in the HttpOnly cookie set by Login; an Authorization header still takes precedence.
                        options.Events = new JwtBearerEvents
                        {
                            OnMessageReceived = context =>
                            {
                                if (!context.Request.Headers.ContainsKey(HeaderNames.Authorization))
                                {
                                    context.Token = context.Request.Cookies[AuthCookieNames.AccessToken];
                                }

                                return Task.CompletedTask;
                            },
                        };
                    });
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
