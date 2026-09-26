using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;
using Web.Api.Service.Attributes;

namespace Web.Api.Service.OpenApi
{
    /// <summary>
    /// Marks endpoints protected by [ApiAuthentication] (or any [Authorize]) as requiring the bearer token,
    /// and documents their 401 / 403 responses. Anonymous endpoints stay unlocked in Swagger UI.
    /// </summary>
    internal class BearerSecurityRequirementTransformer : IOpenApiOperationTransformer
    {
        public Task TransformAsync(OpenApiOperation operation, OpenApiOperationTransformerContext context, CancellationToken cancellationToken)
        {
            var endpointMetadata = context.Description.ActionDescriptor.EndpointMetadata;
            var authorizeData = endpointMetadata.OfType<IAuthorizeData>().ToList();

            if (authorizeData.Count == 0 || endpointMetadata.OfType<IAllowAnonymous>().Any())
            {
                return Task.CompletedTask;
            }

            operation.Security ??= [];
            operation.Security.Add(new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference(BearerSecuritySchemeTransformer.SchemeName, context.Document)] = [],
            });

            operation.Responses ??= [];
            operation.Responses.TryAdd(StatusCodes.Status401Unauthorized.ToString(), new OpenApiResponse { Description = "Missing, invalid or expired access token." });

            var roles = authorizeData.Where(a => !string.IsNullOrEmpty(a.Roles))
                                     .Select(a => a.Roles)
                                     .ToList();

            var scopes = authorizeData.OfType<ApiAuthenticationAttribute>()
                                      .Where(a => a.Scope.HasValue)
                                      .Select(a => $"{a.Scope} ({a.ScopePermissions})")
                                      .ToList();

            var forbiddenReasons = new List<string>();

            if (roles.Count > 0)
            {
                forbiddenReasons.Add($"Requires role: {string.Join(" and ", roles)}.");
            }

            if (scopes.Count > 0)
            {
                forbiddenReasons.Add($"Requires scope: {string.Join(" and ", scopes)}.");
            }

            if (forbiddenReasons.Count > 0)
            {
                operation.Responses.TryAdd(StatusCodes.Status403Forbidden.ToString(), new OpenApiResponse { Description = string.Join(" ", forbiddenReasons) });
            }

            return Task.CompletedTask;
        }
    }
}
