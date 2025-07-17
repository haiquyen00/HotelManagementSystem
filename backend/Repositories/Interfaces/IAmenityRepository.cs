using Business.Model;

namespace Repositories.Interfaces
{
    public interface IAmenityRepository : IBaseRepository<Amenity>
    {
        Task<IEnumerable<Amenity>> GetByCategory(string category);
        Task<IEnumerable<Amenity>> GetActiveAmenities();
        Task<bool> NameExistsAsync(string name, Guid? excludeId = null);
        Task<bool> NameEnExistsAsync(string nameEn, Guid? excludeId = null);
        Task<Amenity?> GetByNameAsync(string name);
        Task<IEnumerable<Amenity>> GetOrderedBySort();
        Task<int> GetMaxSortOrderAsync();
        Task<IEnumerable<Amenity>> SearchAsync(string searchTerm);
        Task<(IEnumerable<Amenity> items, int totalCount)> GetPagedAsync(
            int page, 
            int pageSize, 
            string? searchTerm = null, 
            string? category = null, 
            bool? isActive = null,
            string orderBy = "name",
            bool descending = false);
    }
}
