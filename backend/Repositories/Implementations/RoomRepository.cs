using Business;
using Business.Data;
using Business.Model;
using Business.Model.Enums;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implementations
{
    public class RoomRepository : BaseRepository<Room>, IRoomRepository
    {
        public RoomRepository(HotelManagementDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Room>> GetByRoomTypeIdAsync(Guid roomTypeId)
        {
            return await _context.Rooms
                .Include(r => r.RoomType)
                .Where(r => r.RoomTypeId == roomTypeId)
                .OrderBy(r => r.RoomNumber)
                .ToListAsync();
        }

        public async Task<Room?> GetByRoomNumberAsync(string roomNumber)
        {
            return await _context.Rooms
                .Include(r => r.RoomType)
                .FirstOrDefaultAsync(r => r.RoomNumber == roomNumber);
        }

        public async Task<bool> RoomNumberExistsAsync(string roomNumber, Guid? excludeId = null)
        {
            var query = _context.Rooms.Where(r => r.RoomNumber == roomNumber);
            
            if (excludeId.HasValue)
            {
                query = query.Where(r => r.Id != excludeId.Value);
            }
            
            return await query.AnyAsync();
        }

        public async Task<(IEnumerable<Room> rooms, int totalCount)> GetPagedAsync(
            int page, 
            int pageSize, 
            Guid? roomTypeId = null, 
            string? search = null, 
            string? status = null, 
            int? floor = null, 
            string? sortBy = "roomNumber", 
            bool sortDescending = false)
        {
            var query = _context.Rooms.Include(r => r.RoomType).AsQueryable();

            // Apply filters
            if (roomTypeId.HasValue)
            {
                query = query.Where(r => r.RoomTypeId == roomTypeId.Value);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(r => r.RoomNumber.Contains(search) || 
                                        r.RoomType.Name.Contains(search));
            }

            if (!string.IsNullOrEmpty(status) && Enum.TryParse<RoomStatus>(status, true, out var roomStatus))
            {
                query = query.Where(r => r.Status == roomStatus);
            }

            if (floor.HasValue)
            {
                query = query.Where(r => r.Floor == floor.Value);
            }

            // Apply sorting
            query = sortBy?.ToLower() switch
            {
                "floor" => sortDescending ? query.OrderByDescending(r => r.Floor) : query.OrderBy(r => r.Floor),
                "status" => sortDescending ? query.OrderByDescending(r => r.Status) : query.OrderBy(r => r.Status),
                "roomtype" => sortDescending ? query.OrderByDescending(r => r.RoomType.Name) : query.OrderBy(r => r.RoomType.Name),
                _ => sortDescending ? query.OrderByDescending(r => r.RoomNumber) : query.OrderBy(r => r.RoomNumber)
            };

            var totalCount = await query.CountAsync();
            var rooms = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (rooms, totalCount);
        }

        public async Task<IEnumerable<Room>> GetAvailableRoomsAsync(Guid roomTypeId, DateTime checkIn, DateTime checkOut)
        {
            // TODO: Implement với Booking logic khi có Booking entity
            return await _context.Rooms
                .Include(r => r.RoomType)
                .Where(r => r.RoomTypeId == roomTypeId && r.Status == RoomStatus.Available)
                .ToListAsync();
        }

        public async Task<bool> UpdateStatusAsync(Guid roomId, string status)
        {
            if (!Enum.TryParse<RoomStatus>(status, true, out var roomStatus))
            {
                return false;
            }

            var room = await GetByIdAsync(roomId);
            if (room == null)
            {
                return false;
            }

            room.Status = roomStatus;
            room.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsRoomAvailableAsync(Guid roomId, DateTime checkIn, DateTime checkOut)
        {
            var room = await GetByIdAsync(roomId);
            if (room == null || room.Status != RoomStatus.Available)
            {
                return false;
            }

            // TODO: Kiểm tra với Booking data khi có Booking entity
            // Check if room has any bookings in the given date range
            
            return true; // Tạm thời return true
        }
    }
}
