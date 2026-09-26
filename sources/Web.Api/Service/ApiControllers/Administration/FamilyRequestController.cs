using Logic.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc;
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

        [HttpPost(Name = "RequestFamilyAccess")]

        public async Task<IActionResult> RequestFamilyAccess([FromBody] FamilyMemberRequest request)
        {
            await _familyMemberAdministrationModule.InsertFamilyRequest(request);

            return Ok();
        }
    }
}
