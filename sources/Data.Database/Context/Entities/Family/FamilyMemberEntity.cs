using Data.Database.Context.Entities.User;
using Shared.Enums.Family;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Database.Context.Entities.Family
{
    public class FamilyMemberEntity : AEntityBase
    {
        public FamilyMemberTypeEnum MemberType { get; set; }

        // Foreign key for the FamilyEntity
        public long FamilyId { get; set; }
        [ForeignKey(nameof(FamilyId))]
        public FamilyEntity Family { get; set; } = null!;
        // Foreign key for the UserEntity
        public long UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public UserEntity User { get; set; } = null!;
    }
}
