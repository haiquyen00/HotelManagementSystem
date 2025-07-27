using System.ComponentModel.DataAnnotations;

namespace DTO.Room
{
    public class CreateRoomTypeFromTemplateRequest
    {
        [Required(ErrorMessage = "Tên loại phòng là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên loại phòng không được vượt quá 100 ký tự")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mô tả là bắt buộc")]
        [StringLength(1000, ErrorMessage = "Mô tả không được vượt quá 1000 ký tự")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "ID khách sạn là bắt buộc")]
        public Guid HotelId { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Giá phòng phải lớn hơn hoặc bằng 0")]
        public decimal? BasePrice { get; set; }

        [Range(1, 20, ErrorMessage = "Số lượng khách tối đa phải từ 1 đến 20")]
        public int? MaxOccupancy { get; set; }

        [Range(1, 1000, ErrorMessage = "Diện tích phải từ 1 đến 1000 m²")]
        public decimal? AreaSqm { get; set; }

        public string? BedType { get; set; }

        [Range(1, 10, ErrorMessage = "Số giường phải từ 1 đến 10")]
        public int? BedCount { get; set; }

        public bool IncludeAmenities { get; set; } = true;
        public bool IncludeImages { get; set; } = true;

        public List<Guid>? CustomAmenityIds { get; set; }
    }
}
