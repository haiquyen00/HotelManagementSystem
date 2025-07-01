using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Business.Model
{
    [Table("feature_flags")]
    public class FeatureFlag : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty; // "online_booking", "chat_support"
        
        [Required]
        [StringLength(200)]
        public string DisplayName { get; set; } = string.Empty;
        
        [Column(TypeName = "nvarchar(max)")]
        public string Description { get; set; } = string.Empty;
        
        public bool IsEnabled { get; set; } = false;
        
        [Column(TypeName = "nvarchar(max)")]
        public string? ConfigData { get; set; } // JSON: Additional configuration
        
        [Column(TypeName = "nvarchar(max)")]
        public string? TargetUsers { get; set; } // JSON: Specific user groups
        
        [Range(0, 100)]
        public int RolloutPercentage { get; set; } = 100; // 0-100%
        
        [Required]
        public Guid CreatedBy { get; set; }
        
        // Navigation properties
        [ForeignKey("CreatedBy")]
        public virtual User Creator { get; set; } = null!;
    }

    [Table("system_settings")]
    public class SystemSetting : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty; // "general", "booking", "payment"
        
        [Required]
        [StringLength(100)]
        public string Key { get; set; } = string.Empty;
        
        [Column(TypeName = "nvarchar(max)")]
        public string Value { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string DataType { get; set; } = "string"; // string, number, boolean, json
        
        [Column(TypeName = "nvarchar(max)")]
        public string? Description { get; set; }
        
        public bool IsEditable { get; set; } = true;
        
        [Required]
        public Guid UpdatedBy { get; set; }
        
        // Navigation properties
        [ForeignKey("UpdatedBy")]
        public virtual User UpdatedByUser { get; set; } = null!;
    }

    [Table("analytics_events")]
    public class AnalyticsEvent : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string EventType { get; set; } = string.Empty; // "page_view", "booking_started", "booking_completed"
        
        public Guid? UserId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string SessionId { get; set; } = string.Empty;
        
        [Column(TypeName = "nvarchar(max)")]
        public string Properties { get; set; } = "{}"; // JSON: Event-specific data
        
        [StringLength(500)]
        public string? UserAgent { get; set; }
        
        [StringLength(45)]
        public string? IpAddress { get; set; }
        
        [StringLength(100)]
        public string? Source { get; set; } // website, mobile_app, api
        
        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
    }
}
