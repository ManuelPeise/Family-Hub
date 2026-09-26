using Data.Database.Context.Entities.Security;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Database.Context.Entities.User
{
    public class UserScopeEntity : AEntityBase
    {
        public bool CanCreate { get; set; }
        public bool CanView { get; set; }
        public bool CanEdit { get; set; }
        public bool CanDelete { get; set; }

        public long UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public UserEntity User { get; set; } = null!;
        public long ScopeId { get; set; }
        [ForeignKey(nameof(ScopeId))]
        public ScopeEntity Scope { get; set; } = null!;
    }
}
