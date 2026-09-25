using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.Auth;

namespace Web.Api.Service.ApiControllers.Auth
{
    public class RegistrationController : ApiControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public RegistrationController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost(Name = "Register")]
        public async Task<IActionResult> Register([FromBody] RegistrationRequest request)
        {
            var response = await _authenticationService.RegisterUser(request);

            if (!response)
            {
                return BadRequest(new { message = "Registration failed" });
            }

            return Ok();
        }
    }
}
