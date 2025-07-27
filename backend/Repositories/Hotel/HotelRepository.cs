using Microsoft.EntityFrameworkCore;
using Business.Data;
using Business.Model;
using Repositories.Implementations;

namespace Repositories.Hotel
{
    public class HotelRepository : BaseRepository<Business.Model.Hotel>, IHotelRepository
    {
        public HotelRepository(HotelManagementDbContext context) : base(context)
        {
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _dbSet.AnyAsync(h => h.Id == id);
        }

        public async Task<Business.Model.Hotel?> GetByNameAsync(string name)
        {
            return await _dbSet
                .FirstOrDefaultAsync(h => h.Name.ToLower() == name.ToLower());
        }

        public async Task<IEnumerable<Business.Model.Hotel>> GetByOwnerIdAsync(Guid ownerId)
        {
            // Note: Hotel entity doesn't have OwnerId property
            // This method is a placeholder for future multi-owner functionality
            // For now, return all active hotels
            return await _dbSet
                .Where(h => h.IsActive)
                .ToListAsync();
        }

        public async Task<bool> NameExistsAsync(string name, Guid? excludeId = null)
        {
            var query = _dbSet.Where(h => h.Name.ToLower() == name.ToLower());
            
            if (excludeId.HasValue)
            {
                query = query.Where(h => h.Id != excludeId.Value);
            }
            
            return await query.AnyAsync();
        }
    }
}
