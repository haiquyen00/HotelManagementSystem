using Microsoft.EntityFrameworkCore;
using Business.Data;
using Business.Model;
using Repositories.Interfaces;
using Repositories.Implementations;

namespace Repositories.Implementations
{
    public class RoleRepository : BaseRepository<Role>, IRoleRepository
    {
        public RoleRepository(HotelManagementDbContext context) : base(context)
        {
        }

        public async Task<Role?> GetByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(r => r.Name.ToLower() == name.ToLower());
        }

        public async Task<Role?> GetDefaultRoleAsync()
        {
            // Return customer role as default
            return await GetByNameAsync("customer");
        }
    }
}
