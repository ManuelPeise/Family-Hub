using Serilog;

namespace Web.Api.Bundels
{
    internal static class AppConfiguration
    {
        internal static async Task Configure(this WebApplication app)
        {
            await app.EnsureDatabaseUpToDate();

            app.UseSerilogRequestLogging();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseCors();

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();
        }
    }
}
