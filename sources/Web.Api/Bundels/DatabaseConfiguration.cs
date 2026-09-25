using Data.Database;
using Microsoft.EntityFrameworkCore;

namespace Web.Api.Bundels
{
    public static class DatabaseConfiguration
    {
        public static async Task EnsureDatabaseUpToDate(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
            
            var pendingMigrations = await dbContext.Database.GetPendingMigrationsAsync();
            
            if (pendingMigrations.Any())
            {
                await dbContext.Database.MigrateAsync();
            }
        }
    }
}
