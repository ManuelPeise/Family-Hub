using Shared.Enums.User;

namespace Shared.Models.User
{
    public class UserProfileModel
    {
        public long Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }
        public LanguageTypeEnum Language { get; set; }

    }
}
