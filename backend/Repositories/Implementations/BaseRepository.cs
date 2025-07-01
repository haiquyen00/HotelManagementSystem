using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Business.Data;
using Business.Model;
using Repositories.Interfaces;

namespace Repositories.Implementations
{
    public class BaseRepository<T> : IBaseRepository<T> where T : BaseEntity
    {
        protected readonly HotelManagementDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public BaseRepository(HotelManagementDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public virtual async Task<T?> GetByIdAsync(Guid id)
        {
            return await _dbSet.FindAsync(id);
        }

        public virtual async Task<T?> GetByConditionAsync(Expression<Func<T, bool>> condition)
        {
            return await _dbSet.FirstOrDefaultAsync(condition);
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> GetAllByConditionAsync(Expression<Func<T, bool>> condition)
        {
            return await _dbSet.Where(condition).ToListAsync();
        }

        public virtual async Task<T> CreateAsync(T entity)
        {
            entity.Id = Guid.NewGuid();
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public virtual async Task<T> UpdateAsync(T entity)
        {
            entity.UpdatedAt = DateTime.UtcNow;
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public virtual async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null)
                return false;

            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public virtual async Task<bool> ExistsAsync(Expression<Func<T, bool>> condition)
        {
            return await _dbSet.AnyAsync(condition);
        }

        public virtual async Task<int> CountAsync(Expression<Func<T, bool>>? condition = null)
        {
            return condition == null 
                ? await _dbSet.CountAsync() 
                : await _dbSet.CountAsync(condition);
        }
    }
}
