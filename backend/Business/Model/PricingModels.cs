using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Business.Model.Enums;

namespace Business.Model
{
    [Table("pricing_rules")]
    public class PricingRule : BaseEntity
    {
        [Required]
        public Guid RoomTypeId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty; // "Giá cuối tuần", "Giá mùa cao điểm"
        
        [Required]
        [StringLength(50)]
        public string RuleType { get; set; } = string.Empty; // base, weekend, holiday, seasonal, special
        
        public DateTime StartDate { get; set; }
        
        public DateTime EndDate { get; set; }
        
        [Column(TypeName = "nvarchar(max)")]
        public string? DaysOfWeek { get; set; } // JSON: [1,2,3,4,5] cho weekdays
        
        [Required]
        [StringLength(20)]
        public string PriceModifierType { get; set; } = string.Empty; // fixed, percentage, multiplier
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal PriceModifierValue { get; set; } = 0;
        
        public int? MinStayNights { get; set; }
        
        public int? MaxStayNights { get; set; }
        
        public int? AdvanceBookingDays { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public int Priority { get; set; } = 0; // Độ ưu tiên khi có nhiều rule
        
        // Navigation properties
        [ForeignKey("RoomTypeId")]
        public virtual RoomType RoomType { get; set; } = null!;
    }

    [Table("daily_prices")]
    public class DailyPrice : BaseEntity
    {
        [Required]
        public Guid RoomTypeId { get; set; }
        
        [Required]
        public DateTime Date { get; set; }
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal BasePrice { get; set; } = 0;
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal FinalPrice { get; set; } = 0; // Sau khi áp dụng rules
        
        [Column(TypeName = "nvarchar(max)")]
        public string? AppliedRules { get; set; } // JSON: Array of rule IDs
        
        public int AvailableRooms { get; set; } = 0;
        
        // Navigation properties
        [ForeignKey("RoomTypeId")]
        public virtual RoomType RoomType { get; set; } = null!;
    }

    [Table("coupons")]
    public class Coupon : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty; // "SUMMER2024"
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty; // "Khuyến mãi mùa hè"
        
        [Column(TypeName = "nvarchar(max)")]
        public string Description { get; set; } = string.Empty;
        
        public DiscountType DiscountType { get; set; } = DiscountType.Percentage;
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal DiscountValue { get; set; } = 0;
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal? MaxDiscountAmount { get; set; } // Cho loại %
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal? MinimumOrderAmount { get; set; }
        
        public int? UsageLimit { get; set; } // Giới hạn số lần dùng
        
        public int UsageCount { get; set; } = 0;
        
        public int? UserUsageLimit { get; set; } // Giới hạn per user
        
        [Column(TypeName = "nvarchar(max)")]
        public string? ApplicableRoomTypes { get; set; } // JSON: Array of room_type_ids
        
        public CustomerType CustomerType { get; set; } = CustomerType.All;
        
        public DateTime StartDate { get; set; }
        
        public DateTime EndDate { get; set; }
        
        public CouponStatus Status { get; set; } = CouponStatus.Active;
        
        [Required]
        public Guid CreatedBy { get; set; }
        
        // Navigation properties
        [ForeignKey("CreatedBy")]
        public virtual User Creator { get; set; } = null!;
        
        public virtual ICollection<CouponUsage> CouponUsages { get; set; } = new List<CouponUsage>();
        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }

    [Table("coupon_usage")]
    public class CouponUsage : BaseEntity
    {
        [Required]
        public Guid CouponId { get; set; }
        
        [Required]
        public Guid UserId { get; set; }
        
        [Required]
        public Guid BookingId { get; set; }
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal DiscountAmount { get; set; } = 0;
        
        public DateTime UsedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        [ForeignKey("CouponId")]
        public virtual Coupon Coupon { get; set; } = null!;
        
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
        
        [ForeignKey("BookingId")]
        public virtual Booking Booking { get; set; } = null!;
    }
}
