using Shared.Models.Family;

namespace Logic.Shared.Interfaces
{
    public interface IFamilyMemberAdministrationModule
    {
        Task InsertFamilyRequest(FamilyMemberRequest request);
    }
}
