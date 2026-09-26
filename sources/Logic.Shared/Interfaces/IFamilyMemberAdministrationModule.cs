using Shared.Enums.Family;
using Shared.Models.Family;

namespace Logic.Shared.Interfaces
{
    public interface IFamilyMemberAdministrationModule
    {
        /// <summary>
        /// Stores the request and notifies all admins. Duplicates are returned as a result, not thrown.
        /// </summary>
        Task<FamilyAccessRequestResultEnum> InsertFamilyRequest(FamilyMemberRequest request);
    }
}
