using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Business.Model.Enums;

namespace Business.Model
{
    [Table("room_types")]
    public class RoomType : BaseEntity
    {
        [Required]
        public Guid HotelId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty; // "Phòng Deluxe"
        
        [StringLength(200)]
        public string? NameEn { get; set; } // "Deluxe Room"
        
        [Column(TypeName = "nvarchar(max)")]
        public string Description { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal BasePrice { get; set; } = 0; // Giá gốc
        
        public int MaxOccupancy { get; set; } = 2; // Sức chứa tối đa
        
        public int AreaSqm { get; set; } = 0; // Diện tích m²
        
        public BedType BedType { get; set; } = BedType.Queen;
        
        public int BedCount { get; set; } = 1;
        
        public int BathroomCount { get; set; } = 1;
        
        public bool HasBalcony { get; set; } = false;
        
        public bool HasSeaView { get; set; } = false;
        
        public RoomTypeStatus Status { get; set; } = RoomTypeStatus.Active;
        
        public int SortOrder { get; set; } = 0;
        
        // Navigation properties
        [ForeignKey("HotelId")]
        public virtual Hotel Hotel { get; set; } = null!;
        
        public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
        public virtual ICollection<RoomTypeAmenity> RoomTypeAmenities { get; set; } = new List<RoomTypeAmenity>();
        public virtual ICollection<RoomTypeImage> RoomTypeImages { get; set; } = new List<RoomTypeImage>();
        public virtual ICollection<BookingRoom> BookingRooms { get; set; } = new List<BookingRoom>();
        public virtual ICollection<PricingRule> PricingRules { get; set; } = new List<PricingRule>();
        public virtual ICollection<DailyPrice> DailyPrices { get; set; } = new List<DailyPrice>();
    }

    [Table("room_type_amenities")]
    public class RoomTypeAmenity
    {
        [Required]
        public Guid RoomTypeId { get; set; }
        
        [Required]
        public Guid AmenityId { get; set; }
        
        // Navigation properties
        [ForeignKey("RoomTypeId")]
        public virtual RoomType RoomType { get; set; } = null!;
        
        [ForeignKey("AmenityId")]
        public virtual Amenity Amenity { get; set; } = null!;
    }

    [Table("room_type_images")]
    public class RoomTypeImage : BaseEntity
    {
        [Required]
        public Guid RoomTypeId { get; set; }
        
        [Required]
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? Caption { get; set; }
        
        public bool IsPrimary { get; set; } = false;
        
        public int SortOrder { get; set; } = 0;
        
        // Navigation properties
        [ForeignKey("RoomTypeId")]
        public virtual RoomType RoomType { get; set; } = null!;
    }

    [Table("rooms")]
    public class Room : BaseEntity
    {
        [Required]
        public Guid RoomTypeId { get; set; }
        
        [Required]
        [StringLength(20)]
        public string RoomNumber { get; set; } = string.Empty; // "101", "A205"
        
        public int Floor { get; set; } = 1;
        
        public RoomStatus Status { get; set; } = RoomStatus.Available;
        
        public DateTime? LastCleanedAt { get; set; }
        
        [Column(TypeName = "nvarchar(max)")]
        public string? MaintenanceNotes { get; set; }
        
        // Navigation properties
        [ForeignKey("RoomTypeId")]
        public virtual RoomType RoomType { get; set; } = null!;
        
        public virtual ICollection<BookingRoom> BookingRooms { get; set; } = new List<BookingRoom>();
    }
}
