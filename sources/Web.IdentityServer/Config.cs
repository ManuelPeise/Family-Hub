using Duende.IdentityServer.Models;

namespace Web.IdentityServer
{
    public static class Config
    {
        public static class Policies
        {
            public const string Admin = "admin";
        }

        public static IEnumerable<IdentityResource> IdentityResources =>
            [
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Email(),
                new IdentityResources.Phone(),
                new IdentityResources.Address(),
            ];

    }
}
