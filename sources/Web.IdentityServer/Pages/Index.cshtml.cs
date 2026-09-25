using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Web.IdentityServer.Pages.Home
{
    [AllowAnonymous]
    public class Index : PageModel
    {
    }
}
