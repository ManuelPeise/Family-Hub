using Data.Database.Context;
using Logic.Authentication.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Web.Api.Bundels
{
    internal static class DatabaseConfiguration
    {
        internal static async Task EnsureDatabasesUpToDate(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var studyHubDbContext = scope.ServiceProvider.GetRequiredService<StudyHubDbContext>();

            var pendingMigrationsStudyHub = await studyHubDbContext.Database.GetPendingMigrationsAsync();

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
