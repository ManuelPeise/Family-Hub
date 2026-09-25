namespace Web.Api.Bundels
{
    internal static class AppConfiguration
    {
        internal static async Task Configure(this WebApplication app)
        {
            await app.EnsureDatabaseUpToDate();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.ConfigureCors();

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();
        }

        private static void ConfigureCors(this WebApplication app)
        {
            app.UseCors(builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
        }
    }
}
