namespace Data.Database.Context.Entities.Family
{
    public class FamilyEntity : AEntityBase
    {
        public string Name { get; set; } = null!;
        public string ContactEmail { get; set; } = null!;
        public bool IsActive { get; set; } = true;

        // Navigation property for the members of the family
        public ICollection<FamilyMemberEntity> Members { get; set; } = [];
    }
}
