namespace Web.Api.Service.Auth
{
    /// <summary>
    /// Names of the HttpOnly cookies that carry the tokens. Set by AuthenticationController, read by the JwtBearer handler.
    /// </summary>
    internal static class AuthCookieNames
    {
        internal const string AccessToken = "accessToken";
        internal const string RefreshToken = "refreshToken";
    }
}
