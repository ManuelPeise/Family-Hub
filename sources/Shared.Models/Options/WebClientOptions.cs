namespace Shared.Models.Options
{
    /// <summary>
    /// The FamilyHub web client that is seeded into the IdentityServer configuration store on first start.
    /// </summary>
    public class WebClientOptions
    {
        public string ClientId { get; set; } = null!;
        public string ClientName { get; set; } = null!;
        public List<string> RedirectUris { get; set; } = [];
        public List<string> PostLogoutRedirectUris { get; set; } = [];
        public List<string> AllowedCorsOrigins { get; set; } = [];
    }
}
