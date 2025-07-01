using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Business.Model.Enums;

namespace Business.Model
{
    [Table("customers")]
    public class Customer : BaseEntity
    {
        public Guid? UserId { get; set; } // Liên kết với account
        
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(255)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string? Phone { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
        
        [StringLength(100)]
        public string? Nationality { get; set; }
        
        [StringLength(50)]
        public string? IdNumber { get; set; } // CCCD/Passport
        
        [Column(TypeName = "nvarchar(max)")]
        public string? Address { get; set; }
        
        [Column(TypeName = "nvarchar(max)")]
        public string? Preferences { get; set; } // JSON: Room preferences, dietary restrictions
        
        public LoyaltyTier LoyaltyTier { get; set; } = LoyaltyTier.Bronze;
        
        public int TotalBookings { get; set; } = 0;
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal TotalSpent { get; set; } = 0;
        
        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
        
        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public virtual ICollection<ChatConversation> ChatConversations { get; set; } = new List<ChatConversation>();
    }

    [Table("bookings")]
    public class Booking : BaseEntity
    {
        [Required]
        [StringLength(20)]
        public string BookingCode { get; set; } = string.Empty; // "BK20241225001"
        
        public Guid? UserId { get; set; } // null for guest bookings
        
        [Required]
        [StringLength(100)]
        public string GuestName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(255)]
        [EmailAddress]
        public string GuestEmail { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string GuestPhone { get; set; } = string.Empty;
        
        public DateTime CheckInDate { get; set; }
        
        public DateTime CheckOutDate { get; set; }
        
        public int Nights { get; set; } // Computed
        
        public int AdultCount { get; set; } = 1;
        
        public int ChildrenCount { get; set; } = 0;
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal TotalAmount { get; set; } = 0;
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal DiscountAmount { get; set; } = 0;
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal TaxAmount { get; set; } = 0;
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal FinalAmount { get; set; } = 0;
        
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
        
        public BookingStatus BookingStatus { get; set; } = BookingStatus.Pending;
        
        [Column(TypeName = "nvarchar(max)")]
        public string? SpecialRequests { get; set; }
        
        public Guid? CouponId { get; set; }
        
        public BookingSource BookingSource { get; set; } = BookingSource.Website;
        
        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
        
        [ForeignKey("CouponId")]
        public virtual Coupon? Coupon { get; set; }
        
        public virtual ICollection<BookingRoom> BookingRooms { get; set; } = new List<BookingRoom>();
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public virtual ICollection<BookingHistory> BookingHistories { get; set; } = new List<BookingHistory>();
        public virtual ICollection<CouponUsage> CouponUsages { get; set; } = new List<CouponUsage>();
    }

    [Table("booking_rooms")]
    public class BookingRoom : BaseEntity
    {
        [Required]
        public Guid BookingId { get; set; }
        
        [Required]
        public Guid RoomTypeId { get; set; }
        
        public Guid? RoomId { get; set; } // Assigned later
        
        public int Quantity { get; set; } = 1;
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal RatePerNight { get; set; } = 0;
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal TotalAmount { get; set; } = 0;
        
        [Column(TypeName = "nvarchar(max)")]
        public string? GuestNames { get; set; } // JSON: Array of guest names for this room
        
        // Navigation properties
        [ForeignKey("BookingId")]
        public virtual Booking Booking { get; set; } = null!;
        
        [ForeignKey("RoomTypeId")]
        public virtual RoomType RoomType { get; set; } = null!;
        
        [ForeignKey("RoomId")]
        public virtual Room? Room { get; set; }
    }

    [Table("booking_history")]
    public class BookingHistory : BaseEntity
    {
        [Required]
        public Guid BookingId { get; set; }
        
        [Required]
        public Guid ChangedBy { get; set; }
        
        [Required]
        [StringLength(50)]
        public string ChangeType { get; set; } = string.Empty; // created, modified, cancelled, checked_in, checked_out
        
        [Column(TypeName = "nvarchar(max)")]
        public string? OldValues { get; set; } // JSON
        
        [Column(TypeName = "nvarchar(max)")]
        public string? NewValues { get; set; } // JSON
        
        [Column(TypeName = "nvarchar(max)")]
        public string? Notes { get; set; }
        
        // Navigation properties
        [ForeignKey("BookingId")]
        public virtual Booking Booking { get; set; } = null!;
        
        [ForeignKey("ChangedBy")]
        public virtual User ChangedByUser { get; set; } = null!;
    }
}
