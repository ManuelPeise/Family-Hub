namespace Shared.Models.Options
{
    public class AdminOptions
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }
        public string Password { get; set; } = null!;
    }
}
