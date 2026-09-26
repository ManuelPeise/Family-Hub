using Shared.Enums.Security;

namespace Data.Database.Context.Entities.Security
{
    public class ScopeEntity : AEntityBase
    {
        public string Name { get; set; } = null!;
        public ScopeTypeEnum ScopeType { get; set; }
    }
}
