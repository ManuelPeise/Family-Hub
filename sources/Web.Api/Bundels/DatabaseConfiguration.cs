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
            var familyHubDbContext = scope.ServiceProvider.GetRequiredService<FamilyHubDbContext>();

            var pendingMigrationsFamilyHub = await familyHubDbContext.Database.GetPendingMigrationsAsync();

            if (pendingMigrationsFamilyHub.Any())
            {
                await familyHubDbContext.Database.MigrateAsync();
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
