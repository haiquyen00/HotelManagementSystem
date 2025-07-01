using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Business.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<HotelManagementDbContext>
    {
        public HotelManagementDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<HotelManagementDbContext>();
            
            // Use the connection string from API_Hotel project
            var connectionString = "server=LAPTOP-NEMDVCRB\\MSSQLHQ;database=Manager_Hotel_Database;uid=haiquyen00;pwd=123456;TrustServerCertificate=True;";
            
            optionsBuilder.UseSqlServer(connectionString, b => b.MigrationsAssembly("Business"));
            
            return new HotelManagementDbContext(optionsBuilder.Options);
        }
    }
}
