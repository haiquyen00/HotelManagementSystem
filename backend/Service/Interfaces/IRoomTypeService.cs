using DTO.Base;
using DTO.Room;
using DTO.Enums;
using Business.Model.Enums;
using Business.Model;

namespace Service.Interfaces
{
    public interface IRoomTypeService
    {
        // Basic CRUD Operations
        Task<ServiceResult<RoomTypeDto>> GetByIdAsync(Guid id);
        Task<ServiceResult<IEnumerable<RoomTypeDto>>> GetAllAsync();
        Task<ServiceResult<PagedResult<RoomTypeDto>>> GetPagedAsync(RoomTypeFilterRequest request);
        Task<ServiceResult<RoomTypeDto>> CreateAsync(CreateRoomTypeRequest request);
        Task<ServiceResult<RoomTypeDto>> UpdateAsync(Guid id, UpdateRoomTypeRequest request);
        Task<ServiceResult<bool>> DeleteAsync(Guid id);

        // Advanced Queries
        Task<ServiceResult<IEnumerable<RoomTypeDto>>> GetByHotelIdAsync(Guid hotelId);
        Task<ServiceResult<RoomTypeDto>> GetWithFullDetailsAsync(Guid id);
        Task<ServiceResult<IEnumerable<RoomTypeDto>>> GetWithAmenitiesAsync(Guid hotelId);
        Task<ServiceResult<IEnumerable<RoomTypeDto>>> SearchAsync(string searchTerm, Guid? hotelId = null);

        // Availability & Booking Methods (placeholders for future integration)
        Task<ServiceResult<IEnumerable<RoomTypeAvailabilityDto>>> GetAvailableForDatesAsync(
            Guid hotelId, DateTime checkIn, DateTime checkOut, int guests);
        Task<ServiceResult<bool>> IsAvailableForDatesAsync(
            Guid roomTypeId, DateTime checkIn, DateTime checkOut, int roomsNeeded = 1);

        // Amenity Management
        Task<ServiceResult<bool>> AssignAmenitiesAsync(Guid roomTypeId, AssignAmenitiesRequest request);
        Task<ServiceResult<bool>> RemoveAmenityAsync(Guid roomTypeId, Guid amenityId);
        Task<ServiceResult<IEnumerable<RoomTypeDto>>> GetByAmenityAsync(Guid amenityId);

        // Image Management
        Task<ServiceResult<bool>> AddImageAsync(Guid roomTypeId, RoomTypeImageDto image);
        Task<ServiceResult<bool>> RemoveImageAsync(Guid roomTypeId, Guid imageId);
        Task<ServiceResult<bool>> UpdateImageOrderAsync(Guid roomTypeId, List<Guid> imageIds);
        Task<ServiceResult<bool>> SetPrimaryImageAsync(Guid roomTypeId, Guid imageId);

        // Pricing & Business Logic
        Task<ServiceResult<decimal>> CalculatePriceAsync(Guid roomTypeId, DateTime checkIn, DateTime checkOut, int guests);
        Task<ServiceResult<bool>> UpdatePricingAsync(Guid roomTypeId, decimal newBasePrice);
        Task<ServiceResult<bool>> BulkUpdatePricingAsync(BulkUpdateRoomTypePriceRequest request);

        // Status Management
        Task<ServiceResult<bool>> UpdateStatusAsync(Guid roomTypeId, DTO.Enums.RoomTypeStatus status);
        Task<ServiceResult<IEnumerable<RoomTypeDto>>> GetByStatusAsync(DTO.Enums.RoomTypeStatus status, Guid? hotelId = null);

        // Bulk Operations
        Task<ServiceResult<bool>> BulkDeleteAsync(List<Guid> ids);
        Task<ServiceResult<bool>> BulkUpdateStatusAsync(List<Guid> ids, DTO.Enums.RoomTypeStatus status);
        Task<ServiceResult<int>> BulkCreateAsync(List<CreateRoomTypeRequest> requests);

        // Duplication & Templates
        Task<ServiceResult<RoomTypeDto>> DuplicateRoomTypeAsync(Guid roomTypeId, DuplicateRoomTypeRequest request);
        Task<ServiceResult<RoomTypeDto>> CreateFromTemplateAsync(Guid templateId, CreateRoomTypeFromTemplateRequest request);

        // Analytics & Statistics
        Task<ServiceResult<RoomTypeStatsDto>> GetStatisticsAsync(Guid roomTypeId);
        Task<ServiceResult<IEnumerable<RoomTypeSummaryDto>>> GetPopularTypesAsync(Guid hotelId, int topCount = 5);
        Task<ServiceResult<decimal>> GetAverageRatingAsync(Guid roomTypeId);
        Task<ServiceResult<decimal>> GetTotalRevenueAsync(Guid roomTypeId, DateTime? fromDate = null, DateTime? toDate = null);

        // Validation & Business Rules
        Task<ServiceResult<bool>> ValidateCapacityAsync(Guid roomTypeId, int requestedGuests);
        Task<ServiceResult<bool>> ValidateAmenityCompatibilityAsync(Guid roomTypeId, List<Guid> amenityIds);
        Task<ServiceResult<bool>> CanDeleteAsync(Guid roomTypeId);

        // Export & Reporting
        Task<ServiceResult<byte[]>> ExportToExcelAsync(RoomTypeFilterRequest filter);
        Task<ServiceResult<byte[]>> ExportToPdfAsync(Guid roomTypeId);
        Task<ServiceResult<string>> GenerateReportAsync(Guid hotelId, DateTime fromDate, DateTime toDate);

        // Room Management for RoomTypes
        Task<ServiceResult<RoomDto>> CreateRoomForRoomTypeAsync(Guid roomTypeId, CreateRoomForRoomTypeRequest request);
        Task<ServiceResult<List<RoomDto>>> BulkCreateRoomsForRoomTypeAsync(Guid roomTypeId, BulkCreateRoomsForRoomTypeRequest request);
        Task<ServiceResult<IEnumerable<RoomDto>>> GetRoomsByRoomTypeIdAsync(Guid roomTypeId);
    }
}
