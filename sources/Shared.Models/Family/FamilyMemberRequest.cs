using System.ComponentModel.DataAnnotations;

namespace Shared.Models.Family
{
    /// <summary>
    /// [ApiController] rejects an invalid request with 400 before it reaches the service.
    /// The max lengths match the FamilyAccessRequests columns (ColumnLengths in Data.Database).
    /// </summary>
    public class FamilyMemberRequest
    {
        [Required, MaxLength(100)]
        public string FamilyName { get; set; } = null!;

        [Required, EmailAddress, MaxLength(256)]
        public string ContactMailAddress { get; set; } = null!;

        [Required, MaxLength(100)]
        public string MainMemberFirstName { get; set; } = null!;

        [Required, MaxLength(100)]
        public string MainMemberLastName { get; set; } = null!;

        [Required, MaxLength(256)]
        public string MainMemberUserName { get; set; } = null!;

        public DateTime MainMemberDateOfBirth { get; set; }
    }
}
