using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared.Enums.Family;
using Shared.Models.Family;

namespace Web.Api.Service.ApiControllers.Administration
{
    public class FamilyRequestController : ApiControllerBase
    {
        private readonly IFamilyMemberAdministrationModule _familyMemberAdministrationModule;
        public FamilyRequestController(IFamilyMemberAdministrationModule familyMemberAdministrationModule)
        {
            _familyMemberAdministrationModule = familyMemberAdministrationModule;
        }

        /// <summary>
        /// Stores a request for a new family. An invalid body is answered with 400 by [ApiController].
        /// </summary>
        [HttpPost(Name = "RequestFamilyAccess")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> RequestFamilyAccess([FromBody] FamilyMemberRequest request)
        {
            var result = await _familyMemberAdministrationModule.InsertFamilyRequest(request);

            return result switch
            {
                FamilyAccessRequestResultEnum.Created => Ok(),
                FamilyAccessRequestResultEnum.AlreadyRequested => Problem(statusCode: StatusCodes.Status409Conflict, detail: "This family has already been requested with this contact address."),
                FamilyAccessRequestResultEnum.EmailInUse => Problem(statusCode: StatusCodes.Status409Conflict, detail: "A user with this contact address already exists."),
                _ => throw new InvalidOperationException($"Unhandled {nameof(FamilyAccessRequestResultEnum)} value '{result}'."),
            };
        }
    }
}
