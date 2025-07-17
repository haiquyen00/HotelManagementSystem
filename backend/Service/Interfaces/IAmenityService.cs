using Business.Model;
using DTO.Base;
using DTO.Hotel;

namespace Service.Interfaces
{
    public interface IAmenityService
    {
        Task<ServiceResult<IEnumerable<AmenityDto>>> GetAllAsync();
        Task<ServiceResult<AmenityDto>> GetByIdAsync(Guid id);
        Task<ServiceResult<IEnumerable<AmenityDto>>> GetByCategoryAsync(string category);
        Task<ServiceResult<IEnumerable<AmenityDto>>> GetActiveAmenitiesAsync();
        Task<ServiceResult<AmenityListResponse>> GetPagedAsync(AmenitySearchRequest request);
        Task<ServiceResult<IEnumerable<AmenityDto>>> SearchAsync(string searchTerm);
        Task<ServiceResult<AmenityDto>> CreateAsync(CreateAmenityRequest request);
        Task<ServiceResult<AmenityDto>> UpdateAsync(Guid id, UpdateAmenityRequest request);
        Task<ServiceResult<bool>> DeleteAsync(Guid id);
        Task<ServiceResult<bool>> ToggleStatusAsync(Guid id);
        Task<ServiceResult<bool>> UpdateSortOrderAsync(List<AmenitySortOrderRequest> sortOrders);
        Task<ServiceResult<IEnumerable<string>>> GetCategoriesAsync();
        Task<ServiceResult<bool>> BulkDeleteAsync(List<Guid> ids);
        Task<ServiceResult<bool>> BulkToggleStatusAsync(List<Guid> ids, bool isActive);
    }
}
