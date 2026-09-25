namespace Shared.Models.Options
{
    /// <summary>
    /// Where the React UI (Web.IdentityServerUi) of the IdentityServer runs, and the routes it provides.
    /// </summary>
    public class IdentityServerUiOptions
    {
        public string BaseUrl { get; set; } = null!;
        public string LoginPath { get; set; } = null!;
        public string LogoutPath { get; set; } = null!;
        public string ErrorPath { get; set; } = null!;
        public string ConfirmEmailPath { get; set; } = null!;
        public string ResetPasswordPath { get; set; } = null!;

        public string GetUrl(string path)
        {
            return $"{BaseUrl.TrimEnd('/')}/{path.TrimStart('/')}";
        }
    }
}
