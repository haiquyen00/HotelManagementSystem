using Business.Model;
using Repositories.Interfaces;

namespace Repositories.Interfaces
{
    public interface IRoleRepository : IBaseRepository<Role>
    {
        Task<Role?> GetByNameAsync(string name);
        Task<Role?> GetDefaultRoleAsync();
    }
}
