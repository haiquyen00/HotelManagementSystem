using Business.Model;
using DTO.Base;
using DTO.Hotel;
using Microsoft.Extensions.Logging;
using Repositories.Interfaces;
using Service.Interfaces;

namespace Service.Implementations
{
    public class AmenityService : IAmenityService
    {
        private readonly IAmenityRepository _amenityRepository;
        private readonly ILogger<AmenityService> _logger;

        public AmenityService(IAmenityRepository amenityRepository, ILogger<AmenityService> logger)
        {
            _amenityRepository = amenityRepository;
            _logger = logger;
        }

        public async Task<ServiceResult<IEnumerable<AmenityDto>>> GetAllAsync()
        {
            try
            {
                var amenities = await _amenityRepository.GetOrderedBySort();
                var amenityDtos = amenities.Select(MapToDto);
                
                return ServiceResult<IEnumerable<AmenityDto>>.SuccessResult(
                    amenityDtos, 
                    "Lấy danh sách tiện ích thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách tiện ích");
                return ServiceResult<IEnumerable<AmenityDto>>.ErrorResult("Lỗi hệ thống khi lấy danh sách tiện ích");
            }
        }

        public async Task<ServiceResult<AmenityDto>> GetByIdAsync(Guid id)
        {
            try
            {
                var amenity = await _amenityRepository.GetByIdAsync(id);
                
                if (amenity == null)
                {
                    return ServiceResult<AmenityDto>.ErrorResult("Không tìm thấy tiện ích");
                }

                return ServiceResult<AmenityDto>.SuccessResult(
                    MapToDto(amenity), 
                    "Lấy thông tin tiện ích thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy tiện ích với ID {Id}", id);
                return ServiceResult<AmenityDto>.ErrorResult("Lỗi hệ thống khi lấy thông tin tiện ích");
            }
        }

        public async Task<ServiceResult<IEnumerable<AmenityDto>>> GetByCategoryAsync(string category)
        {
            try
            {
                var amenities = await _amenityRepository.GetByCategory(category);
                var amenityDtos = amenities.Select(MapToDto);
                
                return ServiceResult<IEnumerable<AmenityDto>>.SuccessResult(
                    amenityDtos, 
                    $"Lấy danh sách tiện ích theo danh mục '{category}' thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy tiện ích theo danh mục {Category}", category);
                return ServiceResult<IEnumerable<AmenityDto>>.ErrorResult("Lỗi hệ thống khi lấy danh sách tiện ích");
            }
        }

        public async Task<ServiceResult<IEnumerable<AmenityDto>>> GetActiveAmenitiesAsync()
        {
            try
            {
                var amenities = await _amenityRepository.GetActiveAmenities();
                var amenityDtos = amenities.Select(MapToDto);
                
                return ServiceResult<IEnumerable<AmenityDto>>.SuccessResult(
                    amenityDtos, 
                    "Lấy danh sách tiện ích đang hoạt động thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy tiện ích đang hoạt động");
                return ServiceResult<IEnumerable<AmenityDto>>.ErrorResult("Lỗi hệ thống khi lấy danh sách tiện ích");
            }
        }

        public async Task<ServiceResult<AmenityListResponse>> GetPagedAsync(AmenitySearchRequest request)
        {
            try
            {
                var (amenities, totalCount) = await _amenityRepository.GetPagedAsync(
                    request.Page,
                    request.PageSize,
                    request.SearchTerm,
                    request.Category,
                    request.IsActive,
                    request.OrderBy,
                    request.Descending);

                var amenityDtos = amenities.Select(MapToDto).ToList();
                
                // Group by category for better organization
                var groupedByCategory = amenityDtos.GroupBy(a => a.Category)
                    .ToDictionary(g => g.Key, g => g.ToList());

                var response = new AmenityListResponse
                {
                    Amenities = amenityDtos,
                    GroupedByCategory = groupedByCategory
                };

                return ServiceResult<AmenityListResponse>.SuccessResult(
                    response, 
                    "Lấy danh sách tiện ích có phân trang thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách tiện ích có phân trang");
                return ServiceResult<AmenityListResponse>.ErrorResult("Lỗi hệ thống khi lấy danh sách tiện ích");
            }
        }

        public async Task<ServiceResult<IEnumerable<AmenityDto>>> SearchAsync(string searchTerm)
        {
            try
            {
                var amenities = await _amenityRepository.SearchAsync(searchTerm);
                var amenityDtos = amenities.Select(MapToDto);
                
                return ServiceResult<IEnumerable<AmenityDto>>.SuccessResult(
                    amenityDtos, 
                    $"Tìm kiếm tiện ích với từ khóa '{searchTerm}' thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tìm kiếm tiện ích với từ khóa {SearchTerm}", searchTerm);
                return ServiceResult<IEnumerable<AmenityDto>>.ErrorResult("Lỗi hệ thống khi tìm kiếm tiện ích");
            }
        }

        public async Task<ServiceResult<AmenityDto>> CreateAsync(CreateAmenityRequest request)
        {
            try
            {
                // Check if name already exists
                if (await _amenityRepository.NameExistsAsync(request.Name))
                {
                    return ServiceResult<AmenityDto>.ErrorResult("Tên tiện ích đã tồn tại");
                }

                // Check if English name already exists (if provided)
                if (!string.IsNullOrWhiteSpace(request.NameEn) && 
                    await _amenityRepository.NameEnExistsAsync(request.NameEn))
                {
                    return ServiceResult<AmenityDto>.ErrorResult("Tên tiếng Anh của tiện ích đã tồn tại");
                }

                // Auto-assign sort order if not provided
                if (request.SortOrder == 0)
                {
                    request.SortOrder = await _amenityRepository.GetMaxSortOrderAsync() + 1;
                }

                var amenity = new Amenity
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name,
                    NameEn = request.NameEn,
                    Description = request.Description,
                    Icon = request.Icon,
                    Category = request.Category,
                    SortOrder = request.SortOrder,
                    IsActive = request.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var createdAmenity = await _amenityRepository.CreateAsync(amenity);
                
                return ServiceResult<AmenityDto>.SuccessResult(
                    MapToDto(createdAmenity), 
                    "Tạo tiện ích mới thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo tiện ích mới");
                return ServiceResult<AmenityDto>.ErrorResult("Lỗi hệ thống khi tạo tiện ích");
            }
        }

        public async Task<ServiceResult<AmenityDto>> UpdateAsync(Guid id, UpdateAmenityRequest request)
        {
            try
            {
                var amenity = await _amenityRepository.GetByIdAsync(id);
                
                if (amenity == null)
                {
                    return ServiceResult<AmenityDto>.ErrorResult("Không tìm thấy tiện ích");
                }

                // Check if name already exists (excluding current amenity)
                if (await _amenityRepository.NameExistsAsync(request.Name, id))
                {
                    return ServiceResult<AmenityDto>.ErrorResult("Tên tiện ích đã tồn tại");
                }

                // Check if English name already exists (if provided and excluding current amenity)
                if (!string.IsNullOrWhiteSpace(request.NameEn) && 
                    await _amenityRepository.NameEnExistsAsync(request.NameEn, id))
                {
                    return ServiceResult<AmenityDto>.ErrorResult("Tên tiếng Anh của tiện ích đã tồn tại");
                }

                // Update amenity properties
                amenity.Name = request.Name;
                amenity.NameEn = request.NameEn;
                amenity.Description = request.Description;
                amenity.Icon = request.Icon;
                amenity.Category = request.Category;
                amenity.IsActive = request.IsActive;
                amenity.SortOrder = request.SortOrder;
                amenity.UpdatedAt = DateTime.UtcNow;

                var updatedAmenity = await _amenityRepository.UpdateAsync(amenity);
                
                return ServiceResult<AmenityDto>.SuccessResult(
                    MapToDto(updatedAmenity), 
                    "Cập nhật tiện ích thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật tiện ích với ID {Id}", id);
                return ServiceResult<AmenityDto>.ErrorResult("Lỗi hệ thống khi cập nhật tiện ích");
            }
        }

        public async Task<ServiceResult<bool>> DeleteAsync(Guid id)
        {
            try
            {
                var amenity = await _amenityRepository.GetByIdAsync(id);
                
                if (amenity == null)
                {
                    return ServiceResult<bool>.ErrorResult("Không tìm thấy tiện ích");
                }

                await _amenityRepository.DeleteAsync(id);
                
                return ServiceResult<bool>.SuccessResult(true, "Xóa tiện ích thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa tiện ích với ID {Id}", id);
                return ServiceResult<bool>.ErrorResult("Lỗi hệ thống khi xóa tiện ích");
            }
        }

        public async Task<ServiceResult<bool>> ToggleStatusAsync(Guid id)
        {
            try
            {
                var amenity = await _amenityRepository.GetByIdAsync(id);
                
                if (amenity == null)
                {
                    return ServiceResult<bool>.ErrorResult("Không tìm thấy tiện ích");
                }

                amenity.IsActive = !amenity.IsActive;
                amenity.UpdatedAt = DateTime.UtcNow;
                
                await _amenityRepository.UpdateAsync(amenity);
                
                var statusText = amenity.IsActive ? "kích hoạt" : "vô hiệu hóa";
                return ServiceResult<bool>.SuccessResult(true, $"Đã {statusText} tiện ích thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi thay đổi trạng thái tiện ích với ID {Id}", id);
                return ServiceResult<bool>.ErrorResult("Lỗi hệ thống khi thay đổi trạng thái tiện ích");
            }
        }

        public async Task<ServiceResult<bool>> UpdateSortOrderAsync(List<AmenitySortOrderRequest> sortOrders)
        {
            try
            {
                foreach (var sortOrder in sortOrders)
                {
                    var amenity = await _amenityRepository.GetByIdAsync(sortOrder.Id);
                    if (amenity != null)
                    {
                        amenity.SortOrder = sortOrder.SortOrder;
                        amenity.UpdatedAt = DateTime.UtcNow;
                        await _amenityRepository.UpdateAsync(amenity);
                    }
                }
                
                return ServiceResult<bool>.SuccessResult(true, "Cập nhật thứ tự sắp xếp thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật thứ tự sắp xếp tiện ích");
                return ServiceResult<bool>.ErrorResult("Lỗi hệ thống khi cập nhật thứ tự sắp xếp");
            }
        }

        public async Task<ServiceResult<IEnumerable<string>>> GetCategoriesAsync()
        {
            try
            {
                var amenities = await _amenityRepository.GetAllAsync();
                var categories = amenities.Select(a => a.Category).Distinct().OrderBy(c => c);
                
                return ServiceResult<IEnumerable<string>>.SuccessResult(
                    categories, 
                    "Lấy danh sách danh mục tiện ích thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách danh mục tiện ích");
                return ServiceResult<IEnumerable<string>>.ErrorResult("Lỗi hệ thống khi lấy danh sách danh mục");
            }
        }

        public async Task<ServiceResult<bool>> BulkDeleteAsync(List<Guid> ids)
        {
            try
            {
                foreach (var id in ids)
                {
                    var amenity = await _amenityRepository.GetByIdAsync(id);
                    if (amenity != null)
                    {
                        await _amenityRepository.DeleteAsync(id);
                    }
                }
                
                return ServiceResult<bool>.SuccessResult(true, $"Xóa {ids.Count} tiện ích thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa nhiều tiện ích");
                return ServiceResult<bool>.ErrorResult("Lỗi hệ thống khi xóa tiện ích");
            }
        }

        public async Task<ServiceResult<bool>> BulkToggleStatusAsync(List<Guid> ids, bool isActive)
        {
            try
            {
                foreach (var id in ids)
                {
                    var amenity = await _amenityRepository.GetByIdAsync(id);
                    if (amenity != null)
                    {
                        amenity.IsActive = isActive;
                        amenity.UpdatedAt = DateTime.UtcNow;
                        await _amenityRepository.UpdateAsync(amenity);
                    }
                }
                
                var statusText = isActive ? "kích hoạt" : "vô hiệu hóa";
                return ServiceResult<bool>.SuccessResult(true, $"Đã {statusText} {ids.Count} tiện ích thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi thay đổi trạng thái nhiều tiện ích");
                return ServiceResult<bool>.ErrorResult("Lỗi hệ thống khi thay đổi trạng thái tiện ích");
            }
        }

        private static AmenityDto MapToDto(Amenity amenity)
        {
            return new AmenityDto
            {
                Id = amenity.Id,
                Name = amenity.Name,
                NameEn = amenity.NameEn,
                Description = amenity.Description ?? string.Empty, // Đảm bảo không null
                Icon = amenity.Icon,
                Category = amenity.Category,
                IsActive = amenity.IsActive,
                SortOrder = amenity.SortOrder,
                CreatedAt = amenity.CreatedAt,
                UpdatedAt = amenity.UpdatedAt
            };
        }
    }
}
