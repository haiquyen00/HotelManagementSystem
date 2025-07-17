using Business.Data;
using Business.Model;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implementations
{
    public class AmenityRepository : BaseRepository<Amenity>, IAmenityRepository
    {
        public AmenityRepository(HotelManagementDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Amenity>> GetByCategory(string category)
        {
            return await _context.Amenities
                .Where(a => a.Category.ToLower() == category.ToLower())
                .OrderBy(a => a.SortOrder)
                .ThenBy(a => a.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Amenity>> GetActiveAmenities()
        {
            return await _context.Amenities
                .Where(a => a.IsActive)
                .OrderBy(a => a.SortOrder)
                .ThenBy(a => a.Name)
                .ToListAsync();
        }

        public async Task<bool> NameExistsAsync(string name, Guid? excludeId = null)
        {
            var query = _context.Amenities.Where(a => a.Name.ToLower() == name.ToLower());
            
            if (excludeId.HasValue)
            {
                query = query.Where(a => a.Id != excludeId.Value);
            }
            
            return await query.AnyAsync();
        }

        public async Task<bool> NameEnExistsAsync(string nameEn, Guid? excludeId = null)
        {
            if (string.IsNullOrWhiteSpace(nameEn))
                return false;

            var query = _context.Amenities.Where(a => a.NameEn != null && a.NameEn.ToLower() == nameEn.ToLower());
            
            if (excludeId.HasValue)
            {
                query = query.Where(a => a.Id != excludeId.Value);
            }
            
            return await query.AnyAsync();
        }

        public async Task<Amenity?> GetByNameAsync(string name)
        {
            return await _context.Amenities
                .FirstOrDefaultAsync(a => a.Name.ToLower() == name.ToLower());
        }

        public async Task<IEnumerable<Amenity>> GetOrderedBySort()
        {
            return await _context.Amenities
                .OrderBy(a => a.SortOrder)
                .ThenBy(a => a.Name)
                .ToListAsync();
        }

        public async Task<int> GetMaxSortOrderAsync()
        {
            if (!await _context.Amenities.AnyAsync())
                return 0;

            return await _context.Amenities.MaxAsync(a => a.SortOrder);
        }

        public async Task<IEnumerable<Amenity>> SearchAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return await GetAllAsync();

            var lowerSearchTerm = searchTerm.ToLower();
            
            return await _context.Amenities
                .Where(a => a.Name.ToLower().Contains(lowerSearchTerm) ||
                           (a.NameEn != null && a.NameEn.ToLower().Contains(lowerSearchTerm)) ||
                           (a.Description != null && a.Description.ToLower().Contains(lowerSearchTerm)) ||
                           a.Category.ToLower().Contains(lowerSearchTerm))
                .OrderBy(a => a.SortOrder)
                .ThenBy(a => a.Name)
                .ToListAsync();
        }

        public async Task<(IEnumerable<Amenity> items, int totalCount)> GetPagedAsync(
            int page, 
            int pageSize, 
            string? searchTerm = null, 
            string? category = null, 
            bool? isActive = null,
            string orderBy = "name",
            bool descending = false)
        {
            var query = _context.Amenities.AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var lowerSearchTerm = searchTerm.ToLower();
                query = query.Where(a => a.Name.ToLower().Contains(lowerSearchTerm) ||
                                       (a.NameEn != null && a.NameEn.ToLower().Contains(lowerSearchTerm)) ||
                                       (a.Description != null && a.Description.ToLower().Contains(lowerSearchTerm)) ||
                                       a.Category.ToLower().Contains(lowerSearchTerm));
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(a => a.Category.ToLower() == category.ToLower());
            }

            if (isActive.HasValue)
            {
                query = query.Where(a => a.IsActive == isActive.Value);
            }

            // Get total count before pagination
            var totalCount = await query.CountAsync();

            // Apply sorting
            query = orderBy.ToLower() switch
            {
                "name" => descending ? query.OrderByDescending(a => a.Name) : query.OrderBy(a => a.Name),
                "nameen" => descending ? query.OrderByDescending(a => a.NameEn) : query.OrderBy(a => a.NameEn),
                "category" => descending ? query.OrderByDescending(a => a.Category) : query.OrderBy(a => a.Category),
                "sortorder" => descending ? query.OrderByDescending(a => a.SortOrder) : query.OrderBy(a => a.SortOrder),
                "createdat" => descending ? query.OrderByDescending(a => a.CreatedAt) : query.OrderBy(a => a.CreatedAt),
                "updatedat" => descending ? query.OrderByDescending(a => a.UpdatedAt) : query.OrderBy(a => a.UpdatedAt),
                _ => descending ? query.OrderByDescending(a => a.Name) : query.OrderBy(a => a.Name)
            };

            // Apply pagination
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }
    }
}
