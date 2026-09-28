namespace Shared.Models.User
{
    public class UserCredentialsUpdateModel
    {
        public string CurrentPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
        public string NewPasswordReplication { get; set; } = null!;

        public bool Match()
        {
            return NewPassword == NewPasswordReplication;
        }
    }
}
