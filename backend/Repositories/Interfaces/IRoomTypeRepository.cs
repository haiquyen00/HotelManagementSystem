using Business.Model;

namespace Repositories.Interfaces
{
    public interface IRoomTypeRepository : IBaseRepository<RoomType>
    {
        // Basic queries với relationships
        Task<RoomType?> GetWithAmenitiesAsync(Guid id);
        Task<RoomType?> GetWithImagesAsync(Guid id);
        Task<RoomType?> GetWithFullDetailsAsync(Guid id);
        Task<IEnumerable<RoomType>> GetAllWithFullDetailsAsync();
        Task<IEnumerable<RoomType>> GetByHotelIdAsync(Guid hotelId);
        Task<IEnumerable<RoomType>> GetActiveByHotelIdAsync(Guid hotelId);

        // Validation methods
        Task<bool> NameExistsAsync(string name, Guid hotelId, Guid? excludeId = null);
        Task<bool> NameEnExistsAsync(string nameEn, Guid hotelId, Guid? excludeId = null);
        
        // Search và filtering
        Task<IEnumerable<RoomType>> SearchAsync(string searchTerm, Guid? hotelId = null);
        Task<(IEnumerable<RoomType> items, int totalCount)> GetPagedAsync(
            int page,
            int pageSize,
            Guid? hotelId = null,
            string? searchTerm = null,
            string? status = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            int? minOccupancy = null,
            int? maxOccupancy = null,
            string? bedType = null,
            bool? hasBalcony = null,
            bool? hasSeaView = null,
            List<Guid>? amenityIds = null,
            string orderBy = "name",
            bool descending = false);

        // Availability methods
        Task<IEnumerable<RoomType>> GetAvailableForDatesAsync(DateTime checkIn, DateTime checkOut, Guid? hotelId = null);
        Task<Dictionary<Guid, int>> GetAvailableRoomCountsAsync(List<Guid> roomTypeIds, DateTime checkIn, DateTime checkOut);

        // Statistics và analytics
        Task<Dictionary<string, int>> GetStatusCountsAsync(Guid? hotelId = null);
        Task<Dictionary<string, int>> GetBedTypeCountsAsync(Guid? hotelId = null);
        Task<decimal> GetAveragePriceAsync(Guid? hotelId = null);
        Task<(decimal min, decimal max)> GetPriceRangeAsync(Guid? hotelId = null);
        Task<IEnumerable<RoomType>> GetPopularTypesAsync(Guid? hotelId = null, int count = 10);

        // Amenity relationship methods
        Task<IEnumerable<Amenity>> GetAmenitiesByRoomTypeIdAsync(Guid roomTypeId);
        Task AddAmenityAsync(Guid roomTypeId, Guid amenityId);
        Task<bool> RemoveAmenityAsync(Guid roomTypeId, Guid amenityId);
        Task ClearAmenitiesAsync(Guid roomTypeId);
        Task UpdateAmenitiesAsync(Guid roomTypeId, List<Guid> amenityIds);

        // Image relationship methods
        Task<IEnumerable<RoomTypeImage>> GetImagesByRoomTypeIdAsync(Guid roomTypeId);
        Task<RoomTypeImage?> GetPrimaryImageAsync(Guid roomTypeId);
        Task AddImageAsync(RoomTypeImage image);
        Task RemoveImageAsync(Guid imageId);
        Task UpdateImageOrderAsync(List<(Guid imageId, int sortOrder)> imageOrders);

        // Bulk operations
        Task<int> BulkUpdatePricingAsync(List<Guid> roomTypeIds, decimal adjustment, string adjustmentType);
        Task<int> BulkUpdateStatusAsync(List<Guid> roomTypeIds, string status);
        Task<bool> CanDeleteAsync(Guid roomTypeId);
        Task<int> BulkDeleteAsync(List<Guid> roomTypeIds, bool force = false);

        // Duplication
        Task<RoomType> DuplicateRoomTypeAsync(Guid sourceId, string newName, decimal? newPrice = null, bool copyImages = true, bool copyAmenities = true);

        // Pricing calculations
        Task<decimal> CalculateCurrentPriceAsync(Guid roomTypeId, DateTime date);
        Task<Dictionary<Guid, decimal>> CalculateCurrentPricesAsync(List<Guid> roomTypeIds, DateTime date);

        // Sort order management
        Task<int> GetMaxSortOrderAsync(Guid hotelId);
        Task UpdateSortOrdersAsync(List<(Guid roomTypeId, int sortOrder)> orders);

        // Revenue analytics
        Task<Dictionary<Guid, decimal>> GetRevenueByRoomTypeAsync(Guid? hotelId, DateTime fromDate, DateTime toDate);
        Task<Dictionary<Guid, int>> GetBookingCountsByRoomTypeAsync(Guid? hotelId, DateTime fromDate, DateTime toDate);
        Task<Dictionary<Guid, decimal>> GetOccupancyRatesByRoomTypeAsync(Guid? hotelId, DateTime fromDate, DateTime toDate);
    }
}
