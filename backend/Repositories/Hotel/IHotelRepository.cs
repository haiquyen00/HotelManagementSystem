using Business.Model;
using Repositories.Interfaces;

namespace Repositories.Hotel
{
    public interface IHotelRepository : IBaseRepository<Business.Model.Hotel>
    {
        Task<bool> ExistsAsync(Guid id);
        Task<Business.Model.Hotel?> GetByNameAsync(string name);
        Task<IEnumerable<Business.Model.Hotel>> GetByOwnerIdAsync(Guid ownerId);
        Task<bool> NameExistsAsync(string name, Guid? excludeId = null);
    }
}
