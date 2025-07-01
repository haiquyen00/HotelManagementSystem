using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Business.Model.Enums;

namespace Business.Model
{
    [Table("roles")]
    public class Role : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty; // admin, manager, staff, customer
        
        [Required]
        [StringLength(100)]
        public string DisplayName { get; set; } = string.Empty; // "Quản trị viên", "Quản lý"
        
        [Column(TypeName = "nvarchar(max)")]
        public string Permissions { get; set; } = "{}"; // JSON string
        
        // Navigation properties
        public virtual ICollection<User> Users { get; set; } = new List<User>();
    }

    [Table("users")]
    public class User : BaseEntity
    {
        [Required]
        [StringLength(255)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string? Phone { get; set; }
        
        [StringLength(500)]
        public string? AvatarUrl { get; set; }
        
        [Required]
        public Guid RoleId { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime? EmailVerifiedAt { get; set; }
        
        public DateTime? LastLoginAt { get; set; }
        
        // Email verification
        [StringLength(500)]
        public string? EmailVerificationToken { get; set; }
        
        public DateTime? EmailVerificationTokenExpiry { get; set; }
        
        // Password reset
        [StringLength(500)]
        public string? PasswordResetToken { get; set; }
        
        public DateTime? PasswordResetTokenExpiry { get; set; }
        
        // Navigation properties
        [ForeignKey("RoleId")]
        public virtual Role Role { get; set; } = null!;
        
        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public virtual ICollection<ChatConversation> AssignedConversations { get; set; } = new List<ChatConversation>();
        public virtual ICollection<CouponUsage> CouponUsages { get; set; } = new List<CouponUsage>();
        public virtual ICollection<Coupon> CreatedCoupons { get; set; } = new List<Coupon>();
    }
}
