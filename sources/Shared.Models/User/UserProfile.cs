using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Models.User
{
    public class UserProfile
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }

    }
}
