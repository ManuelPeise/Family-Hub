using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace Web.Api.Service.OpenApi
{
    /// <summary>
    /// Adds the JWT bearer scheme to the OpenAPI document, which gives Swagger UI its "Authorize" button.
    /// </summary>
    internal class BearerSecuritySchemeTransformer : IOpenApiDocumentTransformer
    {
        internal const string SchemeName = "Bearer";

        public Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
        {
            document.Components ??= new OpenApiComponents();
            document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();
            document.Components.SecuritySchemes[SchemeName] = new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "Access token (jwtToken) from POST /api/Authentication/Login, without the \"Bearer \" prefix.",
            };

            return Task.CompletedTask;
        }
    }
}
