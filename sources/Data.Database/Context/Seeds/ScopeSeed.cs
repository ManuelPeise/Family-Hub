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
                new ScopeEntity { Id = (long)ScopeTypeEnum.Administration, Name = "Administration", ScopeType = ScopeTypeEnum.Administration, CreatedAt = timeStamp, CreatedBy = "System" },
                new ScopeEntity { Id = (long)ScopeTypeEnum.FamilyAdministration, Name = "Administration.FamilyAdministration", ScopeType = ScopeTypeEnum.FamilyAdministration, CreatedAt = timeStamp, CreatedBy = "System" },
                new ScopeEntity { Id = (long)ScopeTypeEnum.UserAdministration, Name = "Administration.UserAdministration", ScopeType = ScopeTypeEnum.UserAdministration, CreatedAt = timeStamp, CreatedBy = "System" },
            };

            builder.HasData(entities);
        }
    }
}
