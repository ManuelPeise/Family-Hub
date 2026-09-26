using Shared.Enums.Family;

namespace Data.Database.Context.Entities.Family
{
    public class FamilyAccessRequestEntity: AEntityBase
    {
        public string FamilyName { get; set; } = null!;
        public string ContactMailAddress { get; set; } = null!;
        public string MainMemberFirstName { get; set; } = null!;
        public string MainMemberLastName { get; set; } = null!;
        public string MainMemberUserName { get; set; } = null!;
        public DateTime MainMemberDateOfBirth { get; set; }
        public FamilyAccessRequestStatusEnum Status { get; set; } = FamilyAccessRequestStatusEnum.Pending;
    }
}
