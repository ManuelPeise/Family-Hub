using Data.Database.Identity;
using Data.Database.StudyHub;
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
            //using var scope = app.Services.CreateScope();
            //var dbContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>();

            //var defaultAdminExists = await dbContext.UserTable.AnyAsync(u => u.UserRole == UserRoleEnum.Admin);

            //if (!defaultAdminExists)
            //{
            //    var adminOptions = scope.ServiceProvider.GetRequiredService<IOptions<AdminOptions>>().Value;
            //    var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
            //    var timeStamp = DateTime.UtcNow;

            //    var defaultAdmin = new UserEntity
            //    {
            //        FirstName = "Default",
            //        LastName = "Admin",
            //        Email = adminOptions.Email,
            //        UserName = adminOptions.UserName,
            //        DateOfBirth = adminOptions.DateOfBirth,
            //        UserRole = UserRoleEnum.Admin,
            //        UserCredentials = new UserCredentials
            //        {
            //            PasswordHash = passwordHasher.HashPassword(adminOptions.Password),
            //            PasswordExpiresAt = timeStamp.AddDays(90),
            //            CreatedAt = timeStamp,
            //            CreatedBy = "System",
            //        },
            //        CreatedAt = timeStamp,
            //        CreatedBy = "System",
            //    };

            //    dbContext.UserTable.Add(defaultAdmin);
            //    await dbContext.SaveChangesAsync();
            }
        }
    }


