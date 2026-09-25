using Data.Database;
using System.Linq.Expressions;

namespace Data.Accessor.Interfaces
{
    public interface IRepositoryBase<TEntity> where TEntity : AEntityBase
    {
        IQueryable<TEntity> Query(bool asNoTracking = false);

        Task<TEntity?> GetByIdAsync(long id, CancellationToken cancellationToken = default);

        Task<List<TEntity>> GetAllAsync(bool asNoTracking = false, CancellationToken cancellationToken = default);

        Task<List<TEntity>> GetWhereAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = false, CancellationToken cancellationToken = default);

        Task<TEntity?> GetFirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = false, CancellationToken cancellationToken = default);

        Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);

        Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null, CancellationToken cancellationToken = default);

        Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);

        Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default);

        void Update(TEntity entity);

        void Delete(TEntity entity);

        void DeleteRange(IEnumerable<TEntity> entities);

        Task<bool> DeleteByIdAsync(long id, CancellationToken cancellationToken = default);
    }
}
