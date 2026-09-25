using Data.Accessor.Interfaces;
using Data.Database;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Data.Accessor
{
    public class RepositoryBase<TEntity> : IRepositoryBase<TEntity>  where TEntity : AEntityBase
    {
        private readonly DbContext _context;

        private readonly DbSet<TEntity> DbSet;

        public RepositoryBase(DbContext context)
        {
           _context = context;
           DbSet = _context.Set<TEntity>();
        }

        public IQueryable<TEntity> Query(bool asNoTracking = false)
        {
            return asNoTracking
                ? DbSet.AsNoTracking()
                : DbSet;
        }

        public async Task<TEntity?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            return await DbSet.FindAsync([id], cancellationToken);
        }

        public async Task<List<TEntity>> GetAllAsync(bool asNoTracking = false, CancellationToken cancellationToken = default)
        {
            return await Query(asNoTracking).ToListAsync(cancellationToken);
        }

        public async Task<List<TEntity>> GetWhereAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = false, CancellationToken cancellationToken = default)
        {
            return await Query(asNoTracking).Where(predicate)
                                            .ToListAsync(cancellationToken);
        }

        public async Task<TEntity?> GetFirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = false, CancellationToken cancellationToken = default)
        {
            return await Query(asNoTracking).FirstOrDefaultAsync(predicate, cancellationToken);
        }

        public async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
        {
            return await DbSet.AnyAsync(predicate, cancellationToken);
        }

        public async Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null, CancellationToken cancellationToken = default)
        {
            return predicate is null
                ? await DbSet.CountAsync(cancellationToken)
                : await DbSet.CountAsync(predicate, cancellationToken);
        }

        public async Task AddAsync(TEntity entity, CancellationToken cancellationToken = default)
        {
            await DbSet.AddAsync(entity, cancellationToken);
        }

        public async Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default)
        {
            await DbSet.AddRangeAsync(entities, cancellationToken);
        }

        public void Update(TEntity entity)
        {
            DbSet.Update(entity);
        }

        public void Delete(TEntity entity)
        {
            DbSet.Remove(entity);
        }

        public void DeleteRange(IEnumerable<TEntity> entities)
        {
            DbSet.RemoveRange(entities);
        }

        public async Task<bool> DeleteByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            var entity = await GetByIdAsync(id, cancellationToken);

            if (entity is null)
            {
                return false;
            }

            Delete(entity);

            return true;
        }

       
    }
}
