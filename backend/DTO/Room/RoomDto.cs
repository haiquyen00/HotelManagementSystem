using System.ComponentModel.DataAnnotations;
using DTO.Base;
using DTO.Hotel;

namespace DTO.Room
{
    public class RoomTypeDto : BaseDto
    {
        public Guid HotelId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? NameEn { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public int MaxOccupancy { get; set; }
        public int AreaSqm { get; set; }
        public string BedType { get; set; } = string.Empty;
        public int BedCount { get; set; }
        public int BathroomCount { get; set; }
        public bool HasBalcony { get; set; }
        public bool HasSeaView { get; set; }
        public string Status { get; set; } = string.Empty;
        public int SortOrder { get; set; }

        // Navigation properties
        public List<AmenityDto> Amenities { get; set; } = new();
        public List<RoomTypeImageDto> Images { get; set; } = new();
        public List<RoomDto> Rooms { get; set; } = new();

        // Calculated fields
        public int TotalRooms { get; set; }
        public int AvailableRooms { get; set; }
        public decimal OccupancyRate { get; set; }
        public decimal AveragePrice { get; set; }
    }

    public class RoomTypeImageDto : BaseDto
    {
        public Guid RoomTypeId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
        public bool IsPrimary { get; set; }
        public int SortOrder { get; set; }
    }

    public class RoomDto : BaseDto
    {
        public Guid RoomTypeId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public int Floor { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? LastCleanedAt { get; set; }
        public string? MaintenanceNotes { get; set; }

        // Navigation properties
        public RoomTypeDto? RoomType { get; set; }
    }

    public class CreateRoomTypeRequest
    {
        [Required(ErrorMessage = "Hotel ID is required")]
        public Guid HotelId { get; set; }

        [Required(ErrorMessage = "Room type name is required")]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(200)]
        public string? NameEn { get; set; }

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Base price is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Base price must be greater than 0")]
        public decimal BasePrice { get; set; }

        [Required(ErrorMessage = "Max occupancy is required")]
        [Range(1, 20, ErrorMessage = "Max occupancy must be between 1 and 20")]
        public int MaxOccupancy { get; set; }

        [Required(ErrorMessage = "Area is required")]
        [Range(1, 1000, ErrorMessage = "Area must be between 1 and 1000 sqm")]
        public int AreaSqm { get; set; }

        [Required(ErrorMessage = "Bed type is required")]
        public string BedType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Bed count is required")]
        [Range(1, 10, ErrorMessage = "Bed count must be between 1 and 10")]
        public int BedCount { get; set; }

        [Required(ErrorMessage = "Bathroom count is required")]
        [Range(1, 5, ErrorMessage = "Bathroom count must be between 1 and 5")]
        public int BathroomCount { get; set; }

        public bool HasBalcony { get; set; }
        public bool HasSeaView { get; set; }
        public int SortOrder { get; set; }

        // Amenities and Images
        public List<Guid> AmenityIds { get; set; } = new();
        public List<CreateRoomTypeImageRequest> Images { get; set; } = new();
    }

    public class UpdateRoomTypeRequest
    {
        [Required(ErrorMessage = "Room type name is required")]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(200)]
        public string? NameEn { get; set; }

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Base price is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Base price must be greater than 0")]
        public decimal BasePrice { get; set; }

        [Required(ErrorMessage = "Max occupancy is required")]
        [Range(1, 20, ErrorMessage = "Max occupancy must be between 1 and 20")]
        public int MaxOccupancy { get; set; }

        [Required(ErrorMessage = "Area is required")]
        [Range(1, 1000, ErrorMessage = "Area must be between 1 and 1000 sqm")]
        public int AreaSqm { get; set; }

        [Required(ErrorMessage = "Bed type is required")]
        public string BedType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Bed count is required")]
        [Range(1, 10, ErrorMessage = "Bed count must be between 1 and 10")]
        public int BedCount { get; set; }

        [Required(ErrorMessage = "Bathroom count is required")]
        [Range(1, 5, ErrorMessage = "Bathroom count must be between 1 and 5")]
        public int BathroomCount { get; set; }

        public bool HasBalcony { get; set; }
        public bool HasSeaView { get; set; }
        public string Status { get; set; } = string.Empty;
        public int SortOrder { get; set; }

        // Amenities and Images
        public List<Guid> AmenityIds { get; set; } = new();
        public List<CreateRoomTypeImageRequest> Images { get; set; } = new();
    }

    public class CreateRoomTypeImageRequest
    {
        [Required(ErrorMessage = "Image URL is required")]
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Caption { get; set; }

        public bool IsPrimary { get; set; }
        public int SortOrder { get; set; }
    }

    public class CreateRoomRequest
    {
        [Required(ErrorMessage = "Room type ID is required")]
        public Guid RoomTypeId { get; set; }

        [Required(ErrorMessage = "Room number is required")]
        [StringLength(20)]
        public string RoomNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Floor is required")]
        [Range(0, 100, ErrorMessage = "Floor must be between 0 and 100")]
        public int Floor { get; set; }

        public string? MaintenanceNotes { get; set; }
    }

    public class UpdateRoomRequest
    {
        [Required(ErrorMessage = "Room number is required")]
        [StringLength(20)]
        public string RoomNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Floor is required")]
        [Range(0, 100, ErrorMessage = "Floor must be between 0 and 100")]
        public int Floor { get; set; }

        public string Status { get; set; } = string.Empty;
        public string? MaintenanceNotes { get; set; }
    }

    public class RoomTypeListRequest : PaginationRequest
    {
        public string? Status { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? MinOccupancy { get; set; }
        public int? MaxOccupancy { get; set; }
        public bool? HasBalcony { get; set; }
        public bool? HasSeaView { get; set; }
        public List<Guid>? AmenityIds { get; set; }
    }

    public class RoomTypeStatsDto
    {
        public int TotalRoomTypes { get; set; }
        public int ActiveRoomTypes { get; set; }
        public int TotalRooms { get; set; }
        public decimal AveragePrice { get; set; }
        public decimal HighestPrice { get; set; }
        public decimal LowestPrice { get; set; }
        public Dictionary<string, int> StatusCounts { get; set; } = new();
    }

    public class DuplicateRoomTypeRequest
    {
        [Required(ErrorMessage = "Source room type ID is required")]
        public Guid SourceRoomTypeId { get; set; }

        [Required(ErrorMessage = "New room type name is required")]
        [StringLength(200)]
        public string NewName { get; set; } = string.Empty;

        public bool CopyImages { get; set; } = true;
        public bool CopyAmenities { get; set; } = true;
        public decimal? NewBasePrice { get; set; }
    }
}
