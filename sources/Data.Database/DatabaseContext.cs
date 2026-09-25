using Microsoft.EntityFrameworkCore;

namespace Data.Database
{
    public class DatabaseContext: DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
            
        }
    }
}
