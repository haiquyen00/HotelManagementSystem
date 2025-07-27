using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DTO.Base;
using DTO.Common;
using DTO.Room;
using DTO.Enums;
using Service.Interfaces;

namespace API_Hotel.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RoomTypesController : ControllerBase
    {
        private readonly IRoomTypeService _roomTypeService;
        private readonly ILogger<RoomTypesController> _logger;

        public RoomTypesController(IRoomTypeService roomTypeService, ILogger<RoomTypesController> logger)
        {
            _roomTypeService = roomTypeService;
            _logger = logger;
        }

        /// <summary>
        /// Lấy danh sách tất cả loại phòng
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<IEnumerable<RoomTypeDto>>>> GetAllRoomTypes()
        {
            try
            {
                var result = await _roomTypeService.GetAllAsync();
                return result.Success
                    ? Ok(ApiResponse<IEnumerable<RoomTypeDto>>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<IEnumerable<RoomTypeDto>>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all room types");
                return StatusCode(500, ApiResponse<IEnumerable<RoomTypeDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách loại phòng"));
            }
        }

        /// <summary>
        /// Lấy loại phòng theo ID
        /// </summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<RoomTypeDto>>> GetRoomTypeById(Guid id)
        {
            try
            {
                var result = await _roomTypeService.GetByIdAsync(id);
                return result.Success
                    ? Ok(ApiResponse<RoomTypeDto>.SuccessResult(result.Data, result.Message))
                    : NotFound(ApiResponse<RoomTypeDto>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting room type by id {Id}", id);
                return StatusCode(500, ApiResponse<RoomTypeDto>.ErrorResult("Có lỗi xảy ra khi lấy thông tin loại phòng"));
            }
        }

        /// <summary>
        /// Tạo loại phòng mới
        /// </summary>
        [HttpPost]
        [Authorize(Policy = "StaffOrAbove")]
        public async Task<ActionResult<ApiResponse<RoomTypeDto>>> CreateRoomType([FromBody] CreateRoomTypeRequest request)
        {
            try
            {
                var result = await _roomTypeService.CreateAsync(request);
                return result.Success
                    ? CreatedAtAction(nameof(GetRoomTypeById), new { id = result.Data.Id }, 
                        ApiResponse<RoomTypeDto>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<RoomTypeDto>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room type");
                return StatusCode(500, ApiResponse<RoomTypeDto>.ErrorResult("Có lỗi xảy ra khi tạo loại phòng"));
            }
        }

        /// <summary>
        /// Cập nhật loại phòng
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Policy = "ManagerOrAbove")]
        public async Task<ActionResult<ApiResponse<RoomTypeDto>>> UpdateRoomType(Guid id, [FromBody] UpdateRoomTypeRequest request)
        {
            try
            {
                var result = await _roomTypeService.UpdateAsync(id, request);
                return result.Success
                    ? Ok(ApiResponse<RoomTypeDto>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<RoomTypeDto>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room type {Id}", id);
                return StatusCode(500, ApiResponse<RoomTypeDto>.ErrorResult("Có lỗi xảy ra khi cập nhật loại phòng"));
            }
        }

        /// <summary>
        /// Xóa loại phòng
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "ManagerOrAbove")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteRoomType(Guid id)
        {
            try
            {
                var result = await _roomTypeService.DeleteAsync(id);
                return result.Success
                    ? Ok(ApiResponse<bool>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<bool>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting room type {Id}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi xóa loại phòng"));
            }
        }

        // Room Management Endpoints for specific Room Type

        /// <summary>
        /// Tạo phòng mới cho loại phòng cụ thể
        /// </summary>
        [HttpPost("{roomTypeId}/rooms")]
        [Authorize(Policy = "StaffOrAbove")]
        public async Task<ActionResult<ApiResponse<RoomDto>>> CreateRoomForRoomType(
            Guid roomTypeId, 
            [FromBody] CreateRoomForRoomTypeRequest request)
        {
            try
            {
                var result = await _roomTypeService.CreateRoomForRoomTypeAsync(roomTypeId, request);
                return result.Success
                    ? CreatedAtAction(nameof(GetRoomsByRoomType), new { roomTypeId }, 
                        ApiResponse<RoomDto>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<RoomDto>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room for room type {RoomTypeId}", roomTypeId);
                return StatusCode(500, ApiResponse<RoomDto>.ErrorResult("Có lỗi xảy ra khi tạo phòng"));
            }
        }

        /// <summary>
        /// Tạo nhiều phòng cùng lúc cho loại phòng cụ thể
        /// </summary>
        [HttpPost("{roomTypeId}/rooms/bulk")]
        [Authorize(Policy = "StaffOrAbove")]
        public async Task<ActionResult<ApiResponse<List<RoomDto>>>> BulkCreateRoomsForRoomType(
            Guid roomTypeId, 
            [FromBody] BulkCreateRoomsForRoomTypeRequest request)
        {
            try
            {
                var result = await _roomTypeService.BulkCreateRoomsForRoomTypeAsync(roomTypeId, request);
                if (result.Success)
                {
                    var response = ApiResponse<List<RoomDto>>.SuccessResult(result.Data, result.Message);
                    response.Errors = result.Errors; // Gán errors riêng biệt
                    return Ok(response);
                }
                else
                {
                    return BadRequest(ApiResponse<List<RoomDto>>.ErrorResult(result.Message, result.Errors));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk creating rooms for room type {RoomTypeId}", roomTypeId);
                return StatusCode(500, ApiResponse<List<RoomDto>>.ErrorResult("Có lỗi xảy ra khi tạo phòng hàng loạt"));
            }
        }

        /// <summary>
        /// Lấy danh sách phòng theo loại phòng
        /// </summary>
        [HttpGet("{roomTypeId}/rooms")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<IEnumerable<RoomDto>>>> GetRoomsByRoomType(Guid roomTypeId)
        {
            try
            {
                var result = await _roomTypeService.GetRoomsByRoomTypeIdAsync(roomTypeId);
                return result.Success
                    ? Ok(ApiResponse<IEnumerable<RoomDto>>.SuccessResult(result.Data, result.Message))
                    : NotFound(ApiResponse<IEnumerable<RoomDto>>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting rooms by room type {RoomTypeId}", roomTypeId);
                return StatusCode(500, ApiResponse<IEnumerable<RoomDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách phòng"));
            }
        }

        #region Amenity Management

        /// <summary>
        /// Gán amenities cho room type
        /// </summary>
        [HttpPost("{roomTypeId}/amenities")]
        [Authorize(Policy = "ManagerOrAbove")]
        public async Task<ActionResult<ApiResponse<bool>>> AssignAmenitiesToRoomType(
            Guid roomTypeId, 
            [FromBody] AssignAmenitiesRequest request)
        {
            try
            {
                var result = await _roomTypeService.AssignAmenitiesAsync(roomTypeId, request);
                return result.Success
                    ? Ok(ApiResponse<bool>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<bool>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning amenities to room type {RoomTypeId}", roomTypeId);
                return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi gán tiện ích"));
            }
        }

        /// <summary>
        /// Xóa amenity khỏi room type
        /// </summary>
        [HttpDelete("{roomTypeId}/amenities/{amenityId}")]
        [Authorize(Policy = "ManagerOrAbove")]
        public async Task<ActionResult<ApiResponse<bool>>> RemoveAmenityFromRoomType(
            Guid roomTypeId, 
            Guid amenityId)
        {
            try
            {
                var result = await _roomTypeService.RemoveAmenityAsync(roomTypeId, amenityId);
                return result.Success
                    ? Ok(ApiResponse<bool>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<bool>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing amenity {AmenityId} from room type {RoomTypeId}", amenityId, roomTypeId);
                return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi xóa tiện ích"));
            }
        }

        #endregion

        #region Search & Filter

        /// <summary>
        /// Lấy danh sách room types với phân trang và lọc
        /// </summary>
        [HttpGet("paged")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<PagedResult<RoomTypeDto>>>> GetPagedRoomTypes([FromQuery] RoomTypeFilterRequest request)
        {
            try
            {
                var result = await _roomTypeService.GetPagedAsync(request);
                return result.Success
                    ? Ok(ApiResponse<PagedResult<RoomTypeDto>>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<PagedResult<RoomTypeDto>>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting paged room types");
                return StatusCode(500, ApiResponse<PagedResult<RoomTypeDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách loại phòng"));
            }
        }

        /// <summary>
        /// Tìm kiếm room types
        /// </summary>
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<IEnumerable<RoomTypeDto>>>> SearchRoomTypes(
            [FromQuery] string searchTerm, 
            [FromQuery] Guid? hotelId = null)
        {
            try
            {
                var result = await _roomTypeService.SearchAsync(searchTerm, hotelId);
                return result.Success
                    ? Ok(ApiResponse<IEnumerable<RoomTypeDto>>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<IEnumerable<RoomTypeDto>>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching room types with term {SearchTerm}", searchTerm);
                return StatusCode(500, ApiResponse<IEnumerable<RoomTypeDto>>.ErrorResult("Có lỗi xảy ra khi tìm kiếm loại phòng"));
            }
        }

        /// <summary>
        /// Lấy room types theo hotel ID
        /// </summary>
        [HttpGet("hotel/{hotelId}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<IEnumerable<RoomTypeDto>>>> GetRoomTypesByHotel(Guid hotelId)
        {
            try
            {
                var result = await _roomTypeService.GetByHotelIdAsync(hotelId);
                return result.Success
                    ? Ok(ApiResponse<IEnumerable<RoomTypeDto>>.SuccessResult(result.Data, result.Message))
                    : NotFound(ApiResponse<IEnumerable<RoomTypeDto>>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting room types by hotel {HotelId}", hotelId);
                return StatusCode(500, ApiResponse<IEnumerable<RoomTypeDto>>.ErrorResult("Có lỗi xảy ra khi lấy loại phòng theo khách sạn"));
            }
        }

        #endregion

        #region Bulk Operations

        /// <summary>
        /// Xóa nhiều room types cùng lúc
        /// </summary>
        [HttpDelete("bulk")]
        [Authorize(Policy = "ManagerOrAbove")]
        public async Task<ActionResult<ApiResponse<bool>>> BulkDeleteRoomTypes([FromBody] BulkDeleteRoomTypesRequest request)
        {
            try
            {
                var result = await _roomTypeService.BulkDeleteAsync(request.RoomTypeIds);
                return result.Success
                    ? Ok(ApiResponse<bool>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<bool>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk deleting room types");
                return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi xóa hàng loạt loại phòng"));
            }
        }

        /// <summary>
        /// Cập nhật trạng thái nhiều room types cùng lúc
        /// </summary>
        [HttpPut("bulk/status")]
        [Authorize(Policy = "ManagerOrAbove")]
        public async Task<ActionResult<ApiResponse<bool>>> BulkUpdateRoomTypeStatus([FromBody] BulkUpdateRoomTypeStatusRequest request)
        {
            try
            {
                var result = await _roomTypeService.BulkUpdateStatusAsync(request.RoomTypeIds, request.Status);
                return result.Success
                    ? Ok(ApiResponse<bool>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<bool>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk updating room type status");
                return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi cập nhật trạng thái hàng loạt"));
            }
        }

        /// <summary>
        /// Cập nhật giá nhiều room types cùng lúc
        /// </summary>
        [HttpPut("bulk/pricing")]
        [Authorize(Policy = "ManagerOrAbove")]
        public async Task<ActionResult<ApiResponse<bool>>> BulkUpdateRoomTypePricing([FromBody] BulkUpdateRoomTypePriceRequest request)
        {
            try
            {
                var result = await _roomTypeService.BulkUpdatePricingAsync(request);
                return result.Success
                    ? Ok(ApiResponse<bool>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<bool>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk updating room type pricing");
                return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi cập nhật giá hàng loạt"));
            }
        }

        #endregion

        #region Image Management

        /// <summary>
        /// Thêm hình ảnh cho Room Type
        /// </summary>
        [HttpPost("{roomTypeId}/images")]
        [Authorize(Policy = "ManagerOrAbove")]
        public async Task<ActionResult<ApiResponse<bool>>> AddImageToRoomType(Guid roomTypeId, [FromBody] RoomTypeImageDto imageDto)
        {
            try
            {
                var result = await _roomTypeService.AddImageAsync(roomTypeId, imageDto);
                return result.Success
                    ? Ok(ApiResponse<bool>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<bool>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding image to room type {RoomTypeId}", roomTypeId);
                return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi thêm hình ảnh"));
            }
        }

        /// <summary>
        /// Xóa hình ảnh khỏi Room Type
        /// </summary>
        [HttpDelete("{roomTypeId}/images/{imageId}")]
        [Authorize(Policy = "ManagerOrAbove")]
        public async Task<ActionResult<ApiResponse<bool>>> RemoveImageFromRoomType(Guid roomTypeId, Guid imageId)
        {
            try
            {
                var result = await _roomTypeService.RemoveImageAsync(roomTypeId, imageId);
                return result.Success
                    ? Ok(ApiResponse<bool>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<bool>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing image {ImageId} from room type {RoomTypeId}", imageId, roomTypeId);
                return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi xóa hình ảnh"));
            }
        }

        /// <summary>
        /// Cập nhật thứ tự hình ảnh
        /// </summary>
        [HttpPut("{roomTypeId}/images/order")]
        [Authorize(Policy = "ManagerOrAbove")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateImageOrder(Guid roomTypeId, [FromBody] ReorderRoomTypeImagesRequest request)
        {
            try
            {
                var result = await _roomTypeService.UpdateImageOrderAsync(roomTypeId, request.ImageIds);
                return result.Success
                    ? Ok(ApiResponse<bool>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<bool>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating image order for room type {RoomTypeId}", roomTypeId);
                return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi cập nhật thứ tự hình ảnh"));
            }
        }

        /// <summary>
        /// Đặt hình ảnh chính
        /// </summary>
        [HttpPut("{roomTypeId}/images/{imageId}/primary")]
        [Authorize(Policy = "ManagerOrAbove")]
        public async Task<ActionResult<ApiResponse<bool>>> SetPrimaryImage(Guid roomTypeId, Guid imageId)
        {
            try
            {
                var result = await _roomTypeService.SetPrimaryImageAsync(roomTypeId, imageId);
                return result.Success
                    ? Ok(ApiResponse<bool>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<bool>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting primary image {ImageId} for room type {RoomTypeId}", imageId, roomTypeId);
                return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi đặt hình ảnh chính"));
            }
        }

        #endregion

        #region Advanced Features

        /// <summary>
        /// Lấy thông tin chi tiết room type với đầy đủ thông tin
        /// </summary>
        [HttpGet("{id}/details")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<RoomTypeDto>>> GetRoomTypeWithFullDetails(Guid id)
        {
            try
            {
                var result = await _roomTypeService.GetWithFullDetailsAsync(id);
                return result.Success
                    ? Ok(ApiResponse<RoomTypeDto>.SuccessResult(result.Data, result.Message))
                    : NotFound(ApiResponse<RoomTypeDto>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting room type details {Id}", id);
                return StatusCode(500, ApiResponse<RoomTypeDto>.ErrorResult("Có lỗi xảy ra khi lấy thông tin chi tiết loại phòng"));
            }
        }

        /// <summary>
        /// Cập nhật trạng thái room type
        /// </summary>
        [HttpPut("{id}/status")]
        [Authorize(Policy = "ManagerOrAbove")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateRoomTypeStatus(Guid id, [FromBody] UpdateRoomTypeStatusRequest request)
        {
            try
            {
                var result = await _roomTypeService.UpdateStatusAsync(id, request.Status);
                return result.Success
                    ? Ok(ApiResponse<bool>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<bool>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room type status {Id}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi cập nhật trạng thái loại phòng"));
            }
        }

        /// <summary>
        /// Duplicate room type
        /// </summary>
        [HttpPost("{id}/duplicate")]
        [Authorize(Policy = "ManagerOrAbove")]
        public async Task<ActionResult<ApiResponse<RoomTypeDto>>> DuplicateRoomType(Guid id, [FromBody] DuplicateRoomTypeRequest request)
        {
            try
            {
                var result = await _roomTypeService.DuplicateRoomTypeAsync(id, request);
                return result.Success
                    ? CreatedAtAction(nameof(GetRoomTypeById), new { id = result.Data.Id }, 
                        ApiResponse<RoomTypeDto>.SuccessResult(result.Data, result.Message))
                    : BadRequest(ApiResponse<RoomTypeDto>.ErrorResult(result.Message, result.Errors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error duplicating room type {Id}", id);
                return StatusCode(500, ApiResponse<RoomTypeDto>.ErrorResult("Có lỗi xảy ra khi sao chép loại phòng"));
            }
        }

        #endregion
    }
}
