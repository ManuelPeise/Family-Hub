using System.ComponentModel.DataAnnotations;

namespace Data.Database
{
    public abstract class AEntityBase
    {
        [Key]
        public long Id { get; set; }

        public string CreatedBy { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
