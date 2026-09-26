using Data.Database.Context.Entities.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Shared.Enums.Security;

namespace Data.Database.Context.Seeds
{
    internal class ScopeSeed : IEntityTypeConfiguration<ScopeEntity>
    {
        public void Configure(EntityTypeBuilder<ScopeEntity> builder)
        {
            var timeStamp = DateTime.Parse("2026-01-01");

            var entities = new List<ScopeEntity>
            {
                new ScopeEntity { Id = 1, Name = "Administration", ScopeType = ScopeTypeEnum.Administration, CreatedAt = timeStamp, CreatedBy = "System" },
            };

            builder.HasData(entities);
        }
    }
}
