using Microsoft.EntityFrameworkCore;

namespace Data.Database.StudyHub
{
    public class StudyHubDbContext : ADbContextBase
    {
        public const string ConnectionStringName = "StudyHubContext";

        public StudyHubDbContext(DbContextOptions<StudyHubDbContext> options)
            : base(options)
        {
        }
    }
}
