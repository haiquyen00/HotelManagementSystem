using System.ComponentModel.DataAnnotations;
using DTO.Base;

namespace DTO.System
{
    public class CouponDto : BaseDto
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string DiscountType { get; set; } = string.Empty;
        public decimal DiscountValue { get; set; }
        public decimal? MaxDiscountAmount { get; set; }
        public decimal? MinimumOrderAmount { get; set; }
        public int? UsageLimit { get; set; }
        public int UsageCount { get; set; }
        public int? UserUsageLimit { get; set; }
        public string? ApplicableRoomTypes { get; set; }
        public string CustomerType { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public Guid CreatedBy { get; set; }

        // Calculated fields
        public bool IsValid { get; set; }
        public bool IsExpired { get; set; }
        public bool IsUsageLimitReached { get; set; }
        public int RemainingUsage { get; set; }
    }

    public class CreateCouponRequest
    {
        [Required(ErrorMessage = "Coupon code is required")]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty;

        [Required(ErrorMessage = "Coupon name is required")]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Discount type is required")]
        public string DiscountType { get; set; } = string.Empty; // Percentage, FixedAmount

        [Required(ErrorMessage = "Discount value is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Discount value must be greater than 0")]
        public decimal DiscountValue { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Max discount amount must be greater than 0")]
        public decimal? MaxDiscountAmount { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Minimum order amount must be greater than 0")]
        public decimal? MinimumOrderAmount { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Usage limit must be greater than 0")]
        public int? UsageLimit { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "User usage limit must be greater than 0")]
        public int? UserUsageLimit { get; set; }

        public string? ApplicableRoomTypes { get; set; }

        [Required(ErrorMessage = "Customer type is required")]
        public string CustomerType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Start date is required")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required")]
        public DateTime EndDate { get; set; }
    }

    public class ValidateCouponRequest
    {
        [Required(ErrorMessage = "Coupon code is required")]
        public string Code { get; set; } = string.Empty;

        [Required(ErrorMessage = "Total amount is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Total amount must be greater than 0")]
        public decimal TotalAmount { get; set; }

        public Guid? UserId { get; set; }
        public List<Guid>? RoomTypeIds { get; set; }
    }

    public class CouponValidationResult
    {
        public bool IsValid { get; set; }
        public string Message { get; set; } = string.Empty;
        public decimal DiscountAmount { get; set; }
        public CouponDto? Coupon { get; set; }
    }

    public class FeatureFlagDto : BaseDto
    {
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
        public string? ConfigData { get; set; }
        public string? TargetUsers { get; set; }
        public int RolloutPercentage { get; set; }
        public Guid CreatedBy { get; set; }
    }

    public class SystemSettingDto : BaseDto
    {
        public string Category { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsPublic { get; set; }
        public Guid? UpdatedBy { get; set; }
    }

    public class UpdateSystemSettingRequest
    {
        [Required(ErrorMessage = "Value is required")]
        public string Value { get; set; } = string.Empty;

        public string? Description { get; set; }
    }

    public class ChatConversationDto : BaseDto
    {
        public Guid? CustomerId { get; set; }
        public string? GuestName { get; set; }
        public string? GuestEmail { get; set; }
        public Guid? StaffId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string? Subject { get; set; }
        public string Channel { get; set; } = string.Empty;
        public DateTime? LastMessageAt { get; set; }
        public string? RoomNumber { get; set; }

        // Navigation properties
        public List<ChatMessageDto> Messages { get; set; } = new();
        public int UnreadCount { get; set; }
    }

    public class ChatMessageDto : BaseDto
    {
        public Guid ConversationId { get; set; }
        public Guid? SenderId { get; set; }
        public string SenderType { get; set; } = string.Empty;
        public string MessageType { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? AttachmentUrl { get; set; }
        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }
    }

    public class CreateChatMessageRequest
    {
        [Required(ErrorMessage = "Conversation ID is required")]
        public Guid ConversationId { get; set; }

        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; } = string.Empty;

        public string MessageType { get; set; } = "text";
        public string? AttachmentUrl { get; set; }
    }

    public class AnalyticsEventDto : BaseDto
    {
        public string EventType { get; set; } = string.Empty;
        public Guid? UserId { get; set; }
        public string SessionId { get; set; } = string.Empty;
        public string Properties { get; set; } = string.Empty;
        public string? UserAgent { get; set; }
        public string? IpAddress { get; set; }
        public string? Source { get; set; }
    }

    public class CreateAnalyticsEventRequest
    {
        [Required(ErrorMessage = "Event type is required")]
        [StringLength(100)]
        public string EventType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Session ID is required")]
        [StringLength(100)]
        public string SessionId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Properties is required")]
        public string Properties { get; set; } = string.Empty;

        public string? Source { get; set; }
    }

    public class DashboardStatsDto
    {
        public int TotalBookings { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalRooms { get; set; }
        public int AvailableRooms { get; set; }
        public decimal TotalRevenue { get; set; }
        public double OccupancyRate { get; set; }
        public decimal AverageRoomRate { get; set; }

        // Charts data
        public List<ChartDataPoint> RevenueChart { get; set; } = new();
        public List<ChartDataPoint> BookingsChart { get; set; } = new();
        public List<ChartDataPoint> OccupancyChart { get; set; } = new();

        // Recent activities
        public List<RecentActivityDto> RecentActivities { get; set; } = new();
    }

    public class ChartDataPoint
    {
        public string Label { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public DateTime Date { get; set; }
    }

    public class RecentActivityDto
    {
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string? UserName { get; set; }
        public string? BookingCode { get; set; }
    }

    public class ReportRequest
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string ReportType { get; set; } = string.Empty; // revenue, occupancy, bookings
        public string GroupBy { get; set; } = "day"; // day, week, month
        public List<Guid>? RoomTypeIds { get; set; }
    }

    public class ReportData
    {
        public string ReportType { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<ReportDataPoint> Data { get; set; } = new();
        public decimal TotalValue { get; set; }
        public decimal AverageValue { get; set; }
    }

    public class ReportDataPoint
    {
        public string Label { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public DateTime Date { get; set; }
        public int Count { get; set; }
    }
}
