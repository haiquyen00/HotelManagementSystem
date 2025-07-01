using System.Linq.Expressions;

namespace Repositories.Interfaces
{
    public interface IBaseRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(Guid id);
        Task<T?> GetByConditionAsync(Expression<Func<T, bool>> condition);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> GetAllByConditionAsync(Expression<Func<T, bool>> condition);
        Task<T> CreateAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Expression<Func<T, bool>> condition);
        Task<int> CountAsync(Expression<Func<T, bool>>? condition = null);
    }
}
