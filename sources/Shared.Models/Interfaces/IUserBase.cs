namespace Shared.Models.Interfaces
{
    public interface IUserBase
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; } 
        public string UserName { get; set; } 
    }
}
