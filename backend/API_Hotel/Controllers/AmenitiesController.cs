using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;
using DTO.Hotel;
using DTO.Base;
using Swashbuckle.AspNetCore.Annotations;

namespace API_Hotel.Controllers
{
    /// <summary>
    /// Controller quản lý tiện ích khách sạn
    /// 
    /// Phân quyền:
    /// - Public endpoints: /active, /categories (không cần authentication)
    /// - StaffOrAbove: Xem danh sách, tìm kiếm, xem chi tiết (GET operations)
    /// - ManagerOrAbove: Tạo, sửa, xóa, thay đổi trạng thái (POST, PUT, DELETE, PATCH operations)
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication for all endpoints
    public class AmenitiesController : ControllerBase
    {
        private readonly IAmenityService _amenityService;
        private readonly ILogger<AmenitiesController> _logger;

        public AmenitiesController(IAmenityService amenityService, ILogger<AmenitiesController> logger)
        {
            _amenityService = amenityService;
            _logger = logger;
        }

        /// <summary>
        /// Lấy danh sách tất cả tiện ích
        /// </summary>
        /// <response code="200">Trả về danh sách tiện ích thành công</response>
        /// <response code="401">Chưa đăng nhập</response>
        /// <response code="403">Không có quyền truy cập (cần Staff trở lên)</response>
        [HttpGet]
        [Authorize(Policy = "StaffOrAbove")] // Staff có thể xem danh sách tiện ích
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<AmenityDto>>), 200)]
        [ProducesResponseType(typeof(ApiResponse), 401)]
        [ProducesResponseType(typeof(ApiResponse), 403)]
        public async Task<ActionResult<ApiResponse<IEnumerable<AmenityDto>>>> GetAll()
        {
            try
            {
                var result = await _amenityService.GetAllAsync();
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<IEnumerable<AmenityDto>>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return BadRequest(new ApiResponse<IEnumerable<AmenityDto>>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách tiện ích");
                return StatusCode(500, ApiResponse<IEnumerable<AmenityDto>>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }

        /// <summary>
        /// Lấy danh sách tiện ích có phân trang và tìm kiếm
        /// </summary>
        [HttpGet("paged")]
        [Authorize(Policy = "StaffOrAbove")] // Staff có thể xem với pagination
        public async Task<ActionResult<ApiResponse<AmenityListResponse>>> GetPaged([FromQuery] AmenitySearchRequest request)
        {
            try
            {
                var result = await _amenityService.GetPagedAsync(request);
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<AmenityListResponse>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return BadRequest(new ApiResponse<AmenityListResponse>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách tiện ích có phân trang");
                return StatusCode(500, ApiResponse<AmenityListResponse>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }

        /// <summary>
        /// Lấy tiện ích theo ID
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Policy = "StaffOrAbove")] // Staff có thể xem chi tiết
        public async Task<ActionResult<ApiResponse<AmenityDto>>> GetById(Guid id)
        {
            try
            {
                var result = await _amenityService.GetByIdAsync(id);
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<AmenityDto>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return NotFound(new ApiResponse<AmenityDto>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy tiện ích với ID {Id}", id);
                return StatusCode(500, ApiResponse<AmenityDto>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }

        /// <summary>
        /// Lấy tiện ích theo danh mục
        /// </summary>
        [HttpGet("category/{category}")]
        [Authorize(Policy = "StaffOrAbove")] // Staff có thể xem theo category
        public async Task<ActionResult<ApiResponse<IEnumerable<AmenityDto>>>> GetByCategory(string category)
        {
            try
            {
                var result = await _amenityService.GetByCategoryAsync(category);
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<IEnumerable<AmenityDto>>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return BadRequest(new ApiResponse<IEnumerable<AmenityDto>>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy tiện ích theo danh mục {Category}", category);
                return StatusCode(500, ApiResponse<IEnumerable<AmenityDto>>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }

        /// <summary>
        /// Lấy danh sách tiện ích đang hoạt động
        /// </summary>
        [HttpGet("active")]
        [AllowAnonymous] // Public endpoint - không cần authentication
        public async Task<ActionResult<ApiResponse<IEnumerable<AmenityDto>>>> GetActive()
        {
            try
            {
                var result = await _amenityService.GetActiveAmenitiesAsync();
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<IEnumerable<AmenityDto>>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return BadRequest(new ApiResponse<IEnumerable<AmenityDto>>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy tiện ích đang hoạt động");
                return StatusCode(500, ApiResponse<IEnumerable<AmenityDto>>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }

        /// <summary>
        /// Lấy danh sách danh mục tiện ích
        /// </summary>
        [HttpGet("categories")]
        [AllowAnonymous] // Public endpoint - cho customer xem categories
        public async Task<ActionResult<ApiResponse<IEnumerable<string>>>> GetCategories()
        {
            try
            {
                var result = await _amenityService.GetCategoriesAsync();
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<IEnumerable<string>>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return BadRequest(new ApiResponse<IEnumerable<string>>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách danh mục tiện ích");
                return StatusCode(500, ApiResponse<IEnumerable<string>>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }

        /// <summary>
        /// Tìm kiếm tiện ích
        /// </summary>
        [HttpGet("search")]
        [Authorize(Policy = "StaffOrAbove")] // Staff có thể search trong admin panel
        public async Task<ActionResult<ApiResponse<IEnumerable<AmenityDto>>>> Search([FromQuery] string searchTerm)
        {
            try
            {
                var result = await _amenityService.SearchAsync(searchTerm);
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<IEnumerable<AmenityDto>>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return BadRequest(new ApiResponse<IEnumerable<AmenityDto>>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tìm kiếm tiện ích với từ khóa {SearchTerm}", searchTerm);
                return StatusCode(500, ApiResponse<IEnumerable<AmenityDto>>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }

        /// <summary>
        /// Tạo tiện ích mới
        /// </summary>
        [HttpPost]
        [Authorize(Policy = "ManagerOrAbove")] // Chỉ Manager+ mới có thể tạo mới
        public async Task<ActionResult<ApiResponse<AmenityDto>>> Create([FromBody] CreateAmenityRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var validationErrors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .Select(x => new ErrorDetail
                        {
                            Code = ErrorCodes.VAL_INVALID_FORMAT,
                            Message = x.Value!.Errors.First().ErrorMessage,
                            Field = x.Key,
                            Value = x.Value.AttemptedValue
                        })
                        .ToList();

                    return BadRequest(ApiResponse<AmenityDto>.ValidationErrorResult(validationErrors));
                }

                var result = await _amenityService.CreateAsync(request);
                
                if (result.Success)
                {
                    return CreatedAtAction(
                        nameof(GetById), 
                        new { id = result.Data!.Id }, 
                        new ApiResponse<AmenityDto>
                        {
                            Success = true,
                            Message = result.Message,
                            Data = result.Data
                        });
                }

                return BadRequest(new ApiResponse<AmenityDto>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo tiện ích mới");
                return StatusCode(500, ApiResponse<AmenityDto>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }

        /// <summary>
        /// Cập nhật tiện ích
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Policy = "ManagerOrAbove")] // Chỉ Manager+ mới có thể cập nhật
        public async Task<ActionResult<ApiResponse<AmenityDto>>> Update(Guid id, [FromBody] UpdateAmenityRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var validationErrors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .Select(x => new ErrorDetail
                        {
                            Code = ErrorCodes.VAL_INVALID_FORMAT,
                            Message = x.Value!.Errors.First().ErrorMessage,
                            Field = x.Key,
                            Value = x.Value.AttemptedValue
                        })
                        .ToList();

                    return BadRequest(ApiResponse<AmenityDto>.ValidationErrorResult(validationErrors));
                }

                var result = await _amenityService.UpdateAsync(id, request);
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<AmenityDto>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return BadRequest(new ApiResponse<AmenityDto>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật tiện ích với ID {Id}", id);
                return StatusCode(500, ApiResponse<AmenityDto>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }

        /// <summary>
        /// Xóa tiện ích
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "ManagerOrAbove")] // Chỉ Manager+ mới có thể xóa
        public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
        {
            try
            {
                var result = await _amenityService.DeleteAsync(id);
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<bool>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return NotFound(new ApiResponse<bool>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa tiện ích với ID {Id}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }

        /// <summary>
        /// Thay đổi trạng thái tiện ích (kích hoạt/vô hiệu hóa)
        /// </summary>
        [HttpPatch("{id}/toggle-status")]
        [Authorize(Policy = "ManagerOrAbove")] // Chỉ Manager+ mới có thể thay đổi trạng thái
        public async Task<ActionResult<ApiResponse<bool>>> ToggleStatus(Guid id)
        {
            try
            {
                var result = await _amenityService.ToggleStatusAsync(id);
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<bool>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return NotFound(new ApiResponse<bool>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi thay đổi trạng thái tiện ích với ID {Id}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }

        /// <summary>
        /// Cập nhật thứ tự sắp xếp của các tiện ích
        /// </summary>
        [HttpPut("sort-order")]
        [Authorize(Policy = "ManagerOrAbove")] // Chỉ Manager+ mới có thể sắp xếp lại
        public async Task<ActionResult<ApiResponse<bool>>> UpdateSortOrder([FromBody] List<AmenitySortOrderRequest> sortOrders)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var validationErrors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .Select(x => new ErrorDetail
                        {
                            Code = ErrorCodes.VAL_INVALID_FORMAT,
                            Message = x.Value!.Errors.First().ErrorMessage,
                            Field = x.Key,
                            Value = x.Value.AttemptedValue
                        })
                        .ToList();

                    return BadRequest(ApiResponse<bool>.ValidationErrorResult(validationErrors));
                }

                var result = await _amenityService.UpdateSortOrderAsync(sortOrders);
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<bool>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return BadRequest(new ApiResponse<bool>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật thứ tự sắp xếp tiện ích");
                return StatusCode(500, ApiResponse<bool>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }

        /// <summary>
        /// Xóa nhiều tiện ích cùng lúc
        /// </summary>
        [HttpDelete("bulk")]
        [Authorize(Policy = "ManagerOrAbove")] // Chỉ Manager+ mới có thể xóa hàng loạt
        public async Task<ActionResult<ApiResponse<bool>>> BulkDelete([FromBody] List<Guid> ids)
        {
            try
            {
                if (ids == null || !ids.Any())
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Danh sách ID không được để trống"
                    });
                }

                var result = await _amenityService.BulkDeleteAsync(ids);
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<bool>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return BadRequest(new ApiResponse<bool>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa nhiều tiện ích");
                return StatusCode(500, ApiResponse<bool>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }

        /// <summary>
        /// Thay đổi trạng thái của nhiều tiện ích cùng lúc
        /// </summary>
        [HttpPatch("bulk/toggle-status")]
        [Authorize(Policy = "ManagerOrAbove")] // Chỉ Manager+ mới có thể thay đổi trạng thái hàng loạt
        public async Task<ActionResult<ApiResponse<bool>>> BulkToggleStatus([FromBody] BulkToggleStatusRequest request)
        {
            try
            {
                if (request.Ids == null || !request.Ids.Any())
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Danh sách ID không được để trống"
                    });
                }

                var result = await _amenityService.BulkToggleStatusAsync(request.Ids, request.IsActive);
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<bool>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return BadRequest(new ApiResponse<bool>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi thay đổi trạng thái nhiều tiện ích");
                return StatusCode(500, ApiResponse<bool>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }
    }

    /// <summary>
    /// Request model for bulk toggle status operation
    /// </summary>
    public class BulkToggleStatusRequest
    {
        public List<Guid> Ids { get; set; } = new();
        public bool IsActive { get; set; }
    }
}
