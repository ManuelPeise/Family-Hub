using Logic.Authentication;
using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Shared.Models.Auth;
using System.Security.Claims;
using Web.Api.Service.Attributes;
using Web.Api.Service.Auth;

namespace Web.Api.Service.ApiControllers.Auth
{
    public class AuthenticationController : ApiControllerBase
    {
        private readonly IAuthenticationService _authenticationService;
        public AuthenticationController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost(Name = "Login")]
        public async Task<IActionResult> Login([FromBody] AuthenticationRequest request)
        {
            var response = await _authenticationService.AuthenticateUser(request);

            if (response == null)
            {
                return BadRequest(new { message = "Username or password is incorrect" });
            }

            SetTokenCookies(response);

            return Ok();
        }

        [HttpPost(Name = "Logout")]
        public IActionResult Logout()
        {
            ClearTokenCookies();

            return Ok();
        }

        /// <summary>
        /// Issues a new access token and rotates the refresh token, both read from and written to the HttpOnly cookies.
        /// </summary>
        [HttpPost(Name = "Refresh")]
        public async Task<IActionResult> Refresh(CancellationToken cancellationToken)
        {
            var refreshToken = Request.Cookies[AuthCookieNames.RefreshToken];

            var response = string.IsNullOrEmpty(refreshToken)
                ? null
                : await _authenticationService.RefreshToken(refreshToken, cancellationToken);

            if (response == null)
            {
                ClearTokenCookies();

                return Unauthorized();
            }

            SetTokenCookies(response);

            return Ok();
        }

        /// <summary>
        /// Returns the signed-in user from the access token claims. The frontend calls it on startup to restore the session.
        /// </summary>
        [HttpGet(Name = "Session")]
        [ApiAuthentication]
        public ActionResult<SessionResponse> Session()
        {
            return new SessionResponse
            {
                UserName = User.Identity?.Name ?? string.Empty,
                Email = User.FindFirstValue(JwtRegisteredClaimNames.Email) ?? string.Empty,
                Roles = User.FindAll(JwtTokenParameters.RoleClaimType)
                            .Select(claim => claim.Value)
                            .ToList(),
                Scopes = User.FindAll(JwtTokenParameters.ScopeClaimType)
                             .Select(claim => claim.Value)
                             .ToList(),
            };
        }

        [NonAction]
        private void SetTokenCookies(TokenResponse tokenResponse)
        {
            Response.Cookies.Append(AuthCookieNames.AccessToken, tokenResponse.JwtToken, CreateTokenCookieOptions(tokenResponse.JwtTokenExpiresAt));
            Response.Cookies.Append(AuthCookieNames.RefreshToken, tokenResponse.RefreshToken, CreateTokenCookieOptions(tokenResponse.RefreshTokenExpiresAt));
        }

        [NonAction]
        private void ClearTokenCookies()
        {
            Response.Cookies.Delete(AuthCookieNames.AccessToken, CreateTokenCookieOptions());
            Response.Cookies.Delete(AuthCookieNames.RefreshToken, CreateTokenCookieOptions());
        }

        /// <summary>
        /// HttpOnly keeps the tokens away from JavaScript, SameSite=Strict keeps other sites from sending them (CSRF).
        /// </summary>
        [NonAction]
        private CookieOptions CreateTokenCookieOptions(DateTime? expiresAt = null)
        {
            return new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Strict,
                Expires = expiresAt,
            };
        }
    }
}
