using Data.Database.Identity;
using Data.Database.StudyHub;
using Logic.Authentication.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Web.Api.Bundels
{
    internal static class DatabaseConfiguration
    {
        internal static async Task EnsureDatabasesUpToDate(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var identityDbContext = scope.ServiceProvider.GetRequiredService<IdentityDbContext>();
            var studyHubDbContext = scope.ServiceProvider.GetRequiredService<StudyHubDbContext>();

            var pendingMigrationsIdentity = await identityDbContext.Database.GetPendingMigrationsAsync();
            var pendingMigrationsStudyHub = await studyHubDbContext.Database.GetPendingMigrationsAsync();

            if (pendingMigrationsIdentity.Any())
            {
                await identityDbContext.Database.MigrateAsync();
            }

            if (pendingMigrationsStudyHub.Any())
            {
                await studyHubDbContext.Database.MigrateAsync();
            }
        }

        internal static async Task SeedDefaultAdmin(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var defaultAdminSeeder = scope.ServiceProvider.GetRequiredService<IDefaultAdminSeeder>();

            await defaultAdminSeeder.SeedAsync();
        }
    }
}
