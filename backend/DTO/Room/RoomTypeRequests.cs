using System.ComponentModel.DataAnnotations;
using DTO.Base;
using DTO.Enums;
using Microsoft.AspNetCore.Http;

namespace DTO.Room
{
    /// <summary>
    /// Request để tạo mới Room Type (Single Hotel System)
    /// </summary>
    public class CreateRoomTypeRequest
    {
        // Loại bỏ HotelId vì hệ thống chỉ quản lý 1 khách sạn
        // HotelId sẽ được tự động set trong Service layer

        [Required(ErrorMessage = "Tên loại phòng là bắt buộc")]
        [StringLength(200, ErrorMessage = "Tên loại phòng không được vượt quá 200 ký tự")]
        public string Name { get; set; } = string.Empty;

        [StringLength(200, ErrorMessage = "Tên tiếng Anh không được vượt quá 200 ký tự")]
        public string? NameEn { get; set; }

        [Required(ErrorMessage = "Mô tả là bắt buộc")]
        [StringLength(2000, ErrorMessage = "Mô tả không được vượt quá 2000 ký tự")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Giá cơ bản là bắt buộc")]
        [Range(0, 100_000_000, ErrorMessage = "Giá cơ bản phải từ 0 đến 100,000,000 VND")]
        public decimal BasePrice { get; set; }

        [Required(ErrorMessage = "Sức chứa tối đa là bắt buộc")]
        [Range(1, 20, ErrorMessage = "Sức chứa tối đa phải từ 1 đến 20 người")]
        public int MaxOccupancy { get; set; }

        [Required(ErrorMessage = "Diện tích là bắt buộc")]
        [Range(1, 1000, ErrorMessage = "Diện tích phải từ 1 đến 1000 m²")]
        public int AreaSqm { get; set; }

        [Required(ErrorMessage = "Loại giường là bắt buộc")]
        public string BedType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số lượng giường là bắt buộc")]
        [Range(1, 10, ErrorMessage = "Số lượng giường phải từ 1 đến 10")]
        public int BedCount { get; set; }

        [Required(ErrorMessage = "Số phòng tắm là bắt buộc")]
        [Range(1, 5, ErrorMessage = "Số phòng tắm phải từ 1 đến 5")]
        public int BathroomCount { get; set; }

        public bool HasBalcony { get; set; } = false;
        public bool HasSeaView { get; set; } = false;
        
        [Range(0, 999, ErrorMessage = "Thứ tự sắp xếp phải từ 0 đến 999")]
        public int SortOrder { get; set; } = 0;

        // Amenities và Images
        public List<Guid> AmenityIds { get; set; } = new();
        public List<CreateRoomTypeImageRequest> Images { get; set; } = new();
    }

    /// <summary>
    /// Request để cập nhật Room Type
    /// </summary>
    public class UpdateRoomTypeRequest
    {
        [Required(ErrorMessage = "Tên loại phòng là bắt buộc")]
        [StringLength(200, ErrorMessage = "Tên loại phòng không được vượt quá 200 ký tự")]
        public string Name { get; set; } = string.Empty;

        [StringLength(200, ErrorMessage = "Tên tiếng Anh không được vượt quá 200 ký tự")]
        public string? NameEn { get; set; }

        [Required(ErrorMessage = "Mô tả là bắt buộc")]
        [StringLength(2000, ErrorMessage = "Mô tả không được vượt quá 2000 ký tự")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Giá cơ bản là bắt buộc")]
        [Range(0, 100_000_000, ErrorMessage = "Giá cơ bản phải từ 0 đến 100,000,000 VND")]
        public decimal BasePrice { get; set; }

        [Required(ErrorMessage = "Sức chứa tối đa là bắt buộc")]
        [Range(1, 20, ErrorMessage = "Sức chứa tối đa phải từ 1 đến 20 người")]
        public int MaxOccupancy { get; set; }

        [Required(ErrorMessage = "Diện tích là bắt buộc")]
        [Range(1, 1000, ErrorMessage = "Diện tích phải từ 1 đến 1000 m²")]
        public int AreaSqm { get; set; }

        [Required(ErrorMessage = "Loại giường là bắt buộc")]
        public string BedType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số lượng giường là bắt buộc")]
        [Range(1, 10, ErrorMessage = "Số lượng giường phải từ 1 đến 10")]
        public int BedCount { get; set; }

        [Required(ErrorMessage = "Số phòng tắm là bắt buộc")]
        [Range(1, 5, ErrorMessage = "Số phòng tắm phải từ 1 đến 5")]
        public int BathroomCount { get; set; }

        public bool HasBalcony { get; set; }
        public bool HasSeaView { get; set; }
        
        [Required(ErrorMessage = "Trạng thái là bắt buộc")]
        public RoomTypeStatus Status { get; set; }
        
        [Range(0, 999, ErrorMessage = "Thứ tự sắp xếp phải từ 0 đến 999")]
        public int SortOrder { get; set; }

        // Amenities và Images
        public List<Guid> AmenityIds { get; set; } = new();
        public List<CreateRoomTypeImageRequest> Images { get; set; } = new();
    }

    /// <summary>
    /// Request để tạo Room Type Image
    /// </summary>
    public class CreateRoomTypeImageRequest
    {
        [Required(ErrorMessage = "URL hình ảnh là bắt buộc")]
        [StringLength(500, ErrorMessage = "URL hình ảnh không được vượt quá 500 ký tự")]
        [Url(ErrorMessage = "URL hình ảnh không hợp lệ")]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(200, ErrorMessage = "Chú thích không được vượt quá 200 ký tự")]
        public string? Caption { get; set; }

        public bool IsPrimary { get; set; } = false;
        
        [Range(0, 999, ErrorMessage = "Thứ tự sắp xếp phải từ 0 đến 999")]
        public int SortOrder { get; set; } = 0;
    }

    /// <summary>
    /// Request để filter danh sách Room Types
    /// </summary>
    public class RoomTypeFilterRequest : PaginationRequest
    {
        public Guid? HotelId { get; set; }
        public string? Status { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? MinOccupancy { get; set; }
        public int? MaxOccupancy { get; set; }
        public string? BedType { get; set; }
        public bool? HasBalcony { get; set; }
        public bool? HasSeaView { get; set; }
        public List<Guid>? AmenityIds { get; set; }
        
        // Availability filtering
        public DateTime? AvailableFrom { get; set; }
        public DateTime? AvailableTo { get; set; }
    }

    /// <summary>
    /// Request để update status của Room Type
    /// </summary>
    public class UpdateRoomTypeStatusRequest
    {
        [Required(ErrorMessage = "Trạng thái là bắt buộc")]
        public RoomTypeStatus Status { get; set; }

        [StringLength(500, ErrorMessage = "Lý do không được vượt quá 500 ký tự")]
        public string? Reason { get; set; }
    }

    /// <summary>
    /// Request để duplicate Room Type
    /// </summary>
    public class DuplicateRoomTypeRequest
    {
        [Required(ErrorMessage = "Source Room Type ID là bắt buộc")]
        public Guid SourceRoomTypeId { get; set; }

        [Required(ErrorMessage = "Tên loại phòng mới là bắt buộc")]
        [StringLength(200, ErrorMessage = "Tên loại phòng mới không được vượt quá 200 ký tự")]
        public string NewName { get; set; } = string.Empty;

        public bool CopyImages { get; set; } = true;
        public bool CopyAmenities { get; set; } = true;
        
        [Range(0, 100_000_000, ErrorMessage = "Giá mới phải từ 0 đến 100,000,000 VND")]
        public decimal? NewBasePrice { get; set; }
    }

    /// <summary>
    /// Request để bulk update giá Room Types
    /// </summary>
    public class BulkUpdateRoomTypePriceRequest
    {
        [Required(ErrorMessage = "Danh sách Room Type IDs là bắt buộc")]
        public List<Guid> RoomTypeIds { get; set; } = new();

        [Required(ErrorMessage = "Mức điều chỉnh giá là bắt buộc")]
        public decimal PriceAdjustment { get; set; }

        [Required(ErrorMessage = "Loại điều chỉnh là bắt buộc")]
        [RegularExpression("^(percentage|fixed)$", ErrorMessage = "Loại điều chỉnh phải là 'percentage' hoặc 'fixed'")]
        public string AdjustmentType { get; set; } = "percentage"; // percentage, fixed
    }

    /// <summary>
    /// Request để bulk delete Room Types
    /// </summary>
    public class BulkDeleteRoomTypesRequest
    {
        [Required(ErrorMessage = "Danh sách Room Type IDs là bắt buộc")]
        public List<Guid> RoomTypeIds { get; set; } = new();

        public bool ForceDelete { get; set; } = false;
    }

    /// <summary>
    /// Request để check availability của Room Types
    /// </summary>
    public class RoomTypeAvailabilityRequest
    {
        [Required(ErrorMessage = "Ngày check-in là bắt buộc")]
        public DateTime CheckInDate { get; set; }

        [Required(ErrorMessage = "Ngày check-out là bắt buộc")]
        public DateTime CheckOutDate { get; set; }

        [Range(1, 20, ErrorMessage = "Số người lớn phải từ 1 đến 20")]
        public int AdultCount { get; set; } = 1;

        [Range(0, 10, ErrorMessage = "Số trẻ em phải từ 0 đến 10")]
        public int ChildrenCount { get; set; } = 0;

        public List<Guid>? RoomTypeIds { get; set; } // Nếu muốn check specific room types
    }

    /// <summary>
    /// Request để reorder Room Types
    /// </summary>
    public class ReorderRoomTypesRequest
    {
        [Required(ErrorMessage = "Danh sách Room Type orders là bắt buộc")]
        public List<RoomTypeOrderItem> Orders { get; set; } = new();
    }

    public class RoomTypeOrderItem
    {
        [Required(ErrorMessage = "Room Type ID là bắt buộc")]
        public Guid RoomTypeId { get; set; }

        [Range(0, 999, ErrorMessage = "Thứ tự sắp xếp phải từ 0 đến 999")]
        public int SortOrder { get; set; }
    }

    /// <summary>
    /// Request để tạo Room thuộc về một RoomType cụ thể
    /// </summary>
    public class CreateRoomForRoomTypeRequest
    {
        [Required(ErrorMessage = "Số phòng là bắt buộc")]
        [StringLength(20, ErrorMessage = "Số phòng không được vượt quá 20 ký tự")]
        [RegularExpression(@"^[A-Za-z0-9\-]+$", ErrorMessage = "Số phòng chỉ được chứa chữ cái, số và dấu gạch ngang")]
        public string RoomNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tầng là bắt buộc")]
        [Range(0, 100, ErrorMessage = "Tầng phải từ 0 đến 100")]
        public int Floor { get; set; }

        [StringLength(500, ErrorMessage = "Ghi chú bảo trì không được vượt quá 500 ký tự")]
        public string? MaintenanceNotes { get; set; }
    }

    /// <summary>
    /// Request để tạo nhiều Room cùng lúc cho một RoomType
    /// </summary>
    public class BulkCreateRoomsForRoomTypeRequest
    {
        [Required(ErrorMessage = "Danh sách phòng là bắt buộc")]
        [MinLength(1, ErrorMessage = "Phải có ít nhất 1 phòng")]
        public List<CreateRoomForRoomTypeRequest> Rooms { get; set; } = new();

        /// <summary>
        /// Tiếp tục tạo phòng nếu có lỗi với một số phòng
        /// </summary>
        public bool ContinueOnError { get; set; } = false;

        /// <summary>
        /// Tự động tạo số phòng theo pattern (ví dụ: từ 101 đến 110)
        /// </summary>
        public AutoGenerateRoomsRequest? AutoGenerate { get; set; }
    }

    /// <summary>
    /// Request để tự động tạo room numbers theo pattern
    /// </summary>
    public class AutoGenerateRoomsRequest
    {
        [Required(ErrorMessage = "Prefix số phòng là bắt buộc")]
        [StringLength(10, ErrorMessage = "Prefix không được vượt quá 10 ký tự")]
        public string RoomNumberPrefix { get; set; } = string.Empty; // "1", "A2", "B"

        [Required(ErrorMessage = "Số bắt đầu là bắt buộc")]
        [Range(1, 999, ErrorMessage = "Số bắt đầu phải từ 1 đến 999")]
        public int StartNumber { get; set; }

        [Required(ErrorMessage = "Số kết thúc là bắt buộc")]
        [Range(1, 999, ErrorMessage = "Số kết thúc phải từ 1 đến 999")]
        public int EndNumber { get; set; }

        [Required(ErrorMessage = "Tầng là bắt buộc")]
        [Range(0, 100, ErrorMessage = "Tầng phải từ 0 đến 100")]
        public int Floor { get; set; }

        [StringLength(500, ErrorMessage = "Ghi chú bảo trì không được vượt quá 500 ký tự")]
        public string? MaintenanceNotes { get; set; }
    }

    /// <summary>
    /// Request để gán tiện ích cho Room Type
    /// </summary>
    public class AssignAmenitiesRequest
    {
        [Required(ErrorMessage = "Danh sách ID tiện ích là bắt buộc")]
        public List<Guid> AmenityIds { get; set; } = new List<Guid>();

        /// <summary>
        /// True: Thay thế hoàn toàn danh sách tiện ích hiện tại
        /// False: Thêm vào danh sách tiện ích hiện tại (mặc định)
        /// </summary>
        public bool ReplaceExisting { get; set; } = false;
    }

    /// <summary>
    /// Request để upload hình ảnh cho Room Type
    /// </summary>
    public class UploadRoomTypeImageRequest
    {
        [Required(ErrorMessage = "File hình ảnh là bắt buộc")]
        public IFormFile ImageFile { get; set; } = null!;

        [StringLength(200, ErrorMessage = "Chú thích không được vượt quá 200 ký tự")]
        public string? Caption { get; set; }

        public bool IsPrimary { get; set; } = false;
        
        [Range(0, 999, ErrorMessage = "Thứ tự sắp xếp phải từ 0 đến 999")]
        public int SortOrder { get; set; } = 0;
    }

    /// <summary>
    /// Request để update hình ảnh Room Type
    /// </summary>
    public class UpdateRoomTypeImageRequest
    {
        [StringLength(200, ErrorMessage = "Chú thích không được vượt quá 200 ký tự")]
        public string? Caption { get; set; }

        public bool IsPrimary { get; set; } = false;
        
        [Range(0, 999, ErrorMessage = "Thứ tự sắp xếp phải từ 0 đến 999")]
        public int SortOrder { get; set; } = 0;
    }

    /// <summary>
    /// Request để reorder hình ảnh Room Type
    /// </summary>
    public class ReorderRoomTypeImagesRequest
    {
        [Required(ErrorMessage = "Danh sách image orders là bắt buộc")]
        public List<ImageOrderItem> ImageOrders { get; set; } = new();

        // Compatibility property cho Controller
        public List<Guid> ImageIds => ImageOrders.Select(x => x.ImageId).ToList();
    }

    public class ImageOrderItem
    {
        [Required(ErrorMessage = "Image ID là bắt buộc")]
        public Guid ImageId { get; set; }

        [Range(0, 999, ErrorMessage = "Thứ tự sắp xếp phải từ 0 đến 999")]
        public int SortOrder { get; set; }
    }

    /// <summary>
    /// Request để bulk update status Room Types
    /// </summary>
    public class BulkUpdateRoomTypeStatusRequest
    {
        [Required(ErrorMessage = "Danh sách Room Type IDs là bắt buộc")]
        public List<Guid> RoomTypeIds { get; set; } = new();

        [Required(ErrorMessage = "Trạng thái là bắt buộc")]
        public RoomTypeStatus Status { get; set; }

        [StringLength(500, ErrorMessage = "Lý do không được vượt quá 500 ký tự")]
        public string? Reason { get; set; }
    }
}
