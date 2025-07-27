using Business.Model;
using DTO.Base;

namespace Repositories.Interfaces
{
    public interface IRoomRepository : IBaseRepository<Room>
    {
        Task<IEnumerable<Room>> GetByRoomTypeIdAsync(Guid roomTypeId);
        Task<Room?> GetByRoomNumberAsync(string roomNumber);
        Task<bool> RoomNumberExistsAsync(string roomNumber, Guid? excludeId = null);
        Task<(IEnumerable<Room> rooms, int totalCount)> GetPagedAsync(
            int page, 
            int pageSize, 
            Guid? roomTypeId = null,
            string? search = null,
            string? status = null,
            int? floor = null,
            string? sortBy = "roomNumber",
            bool sortDescending = false);
        Task<IEnumerable<Room>> GetAvailableRoomsAsync(Guid roomTypeId, DateTime checkIn, DateTime checkOut);
        Task<bool> UpdateStatusAsync(Guid roomId, string status);
        Task<bool> IsRoomAvailableAsync(Guid roomId, DateTime checkIn, DateTime checkOut);
    }
}
