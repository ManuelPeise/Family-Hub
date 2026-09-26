namespace Shared.Models.Family
{
    public class FamilyMemberRequest
    {
        public string FamilyName { get; set; } = null!;
        public string ContactMailAddress { get; set; } = null!;
        public string MainMemberFirstName { get; set; } = null!;
        public string MainMemberLastName { get; set; } = null!;
        public string MainMemberUserName { get; set; } = null!;
        public DateTime MainMemberDateOfBirth { get; set; }
    }
}
