using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Business.Model
{
    [Table("hotels")]
    public class Hotel : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [Column(TypeName = "nvarchar(max)")]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Address { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string City { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Country { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string? Phone { get; set; }
        
        [StringLength(255)]
        [EmailAddress]
        public string? Email { get; set; }
        
        [StringLength(255)]
        public string? Website { get; set; }
        
        [Range(1, 5)]
        public int StarRating { get; set; } = 3;
        
        public TimeSpan CheckInTime { get; set; } = new TimeSpan(14, 0, 0); // 14:00
        
        public TimeSpan CheckOutTime { get; set; } = new TimeSpan(12, 0, 0); // 12:00
        
        [StringLength(50)]
        public string Timezone { get; set; } = "Asia/Ho_Chi_Minh";
        
        [StringLength(3)]
        public string Currency { get; set; } = "VND";
        
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public virtual ICollection<RoomType> RoomTypes { get; set; } = new List<RoomType>();
    }

    [Table("amenities")]
    public class Amenity : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? NameEn { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [StringLength(50)]
        public string Icon { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty; // technology, comfort, entertainment, bathroom
        
        public bool IsActive { get; set; } = true;
        
        public int SortOrder { get; set; } = 0;
        
        // Navigation properties
        public virtual ICollection<RoomTypeAmenity> RoomTypeAmenities { get; set; } = new List<RoomTypeAmenity>();
    }
}
