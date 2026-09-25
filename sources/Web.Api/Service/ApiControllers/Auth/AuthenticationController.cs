using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.Auth;

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

            return Ok(response);
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
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", tokenResponse.RefreshToken, cookieOptions);
        }

        [NonAction]
        private void ClearTokenCookies()
        {
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");
        }
    }
}
