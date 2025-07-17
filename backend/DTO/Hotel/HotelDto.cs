using System.ComponentModel.DataAnnotations;
using DTO.Base;

namespace DTO.Hotel
{
    public class HotelDto : BaseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public int StarRating { get; set; }
        public TimeSpan CheckInTime { get; set; }
        public TimeSpan CheckOutTime { get; set; }
        public string Timezone { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class CreateHotelRequest
    {
        [Required(ErrorMessage = "Hotel name is required")]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Address is required")]
        [StringLength(500)]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "City is required")]
        [StringLength(100)]
        public string City { get; set; } = string.Empty;

        [Required(ErrorMessage = "Country is required")]
        [StringLength(100)]
        public string Country { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Phone { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(255)]
        public string? Email { get; set; }

        [StringLength(255)]
        public string? Website { get; set; }

        [Range(1, 5, ErrorMessage = "Star rating must be between 1 and 5")]
        public int StarRating { get; set; }

        public TimeSpan CheckInTime { get; set; }
        public TimeSpan CheckOutTime { get; set; }

        [Required(ErrorMessage = "Timezone is required")]
        [StringLength(50)]
        public string Timezone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Currency is required")]
        [StringLength(3)]
        public string Currency { get; set; } = string.Empty;
    }

    public class UpdateHotelRequest
    {
        [Required(ErrorMessage = "Hotel name is required")]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Address is required")]
        [StringLength(500)]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "City is required")]
        [StringLength(100)]
        public string City { get; set; } = string.Empty;

        [Required(ErrorMessage = "Country is required")]
        [StringLength(100)]
        public string Country { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Phone { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(255)]
        public string? Email { get; set; }

        [StringLength(255)]
        public string? Website { get; set; }

        [Range(1, 5, ErrorMessage = "Star rating must be between 1 and 5")]
        public int StarRating { get; set; }

        public TimeSpan CheckInTime { get; set; }
        public TimeSpan CheckOutTime { get; set; }

        [Required(ErrorMessage = "Timezone is required")]
        [StringLength(50)]
        public string Timezone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Currency is required")]
        [StringLength(3)]
        public string Currency { get; set; } = string.Empty;

        public bool IsActive { get; set; }
    }

    public class AmenityDto : BaseDto
    {
        public string Name { get; set; } = string.Empty;
        public string? NameEn { get; set; }
        public string? Description { get; set; }
        public string Icon { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
    }

    public class CreateAmenityRequest
    {
        [Required(ErrorMessage = "Amenity name is required")]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(100)]
        public string? NameEn { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Icon is required")]
        [StringLength(50)]
        public string Icon { get; set; } = string.Empty;

        [Required(ErrorMessage = "Category is required")]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public int SortOrder { get; set; }
    }

    public class UpdateAmenityRequest
    {
        [Required(ErrorMessage = "Amenity name is required")]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(100)]
        public string? NameEn { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Icon is required")]
        [StringLength(50)]
        public string Icon { get; set; } = string.Empty;

        [Required(ErrorMessage = "Category is required")]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;

        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
    }

    public class AmenityListResponse
    {
        public List<AmenityDto> Amenities { get; set; } = new();
        public Dictionary<string, List<AmenityDto>> GroupedByCategory { get; set; } = new();
    }

    public class AmenitySearchRequest : PaginationRequest
    {
        public string? SearchTerm { get; set; }
        public string? Category { get; set; }
        public bool? IsActive { get; set; }
        public string OrderBy { get; set; } = "name";
        public bool Descending { get; set; } = false;
    }

    public class AmenitySortOrderRequest
    {
        [Required]
        public Guid Id { get; set; }
        
        [Required]
        public int SortOrder { get; set; }
    }

    public class AmenityPagedResponse : PaginationResponse<AmenityDto>
    {
        public Dictionary<string, int> CategoryCounts { get; set; } = new();
        public List<string> AvailableCategories { get; set; } = new();
    }
}
