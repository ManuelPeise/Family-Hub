namespace Logic.Authentication.Interfaces
{
    public interface IDefaultAdminSeeder
    {
        /// <summary>
        /// Creates the default admin from the "Admin" configuration section if no user with the Admin role exists yet.
        /// </summary>
        Task SeedAsync(CancellationToken cancellationToken = default);
    }
}
