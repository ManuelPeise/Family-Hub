using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.Auth;
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
        public async Task<IActionResult> Authenticate([FromBody] AuthenticationRequest request)
        {
            ClearTokenCookies();

            return Ok();
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
