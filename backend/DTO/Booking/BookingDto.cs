using System.ComponentModel.DataAnnotations;
using DTO.Base;
using DTO.Room;
using DTO.User;

namespace DTO.Booking
{
    public class CustomerDto : BaseDto
    {
        public Guid? UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Nationality { get; set; }
        public string? IdNumber { get; set; }
        public string? Address { get; set; }
        public string? Preferences { get; set; }
        public string LoyaltyTier { get; set; } = string.Empty;
        public int TotalBookings { get; set; }
        public decimal TotalSpent { get; set; }

        // Navigation properties
        public UserDto? User { get; set; }
        public string FullName => $"{FirstName} {LastName}";
    }

    public class BookingDto : BaseDto
    {
        public string BookingCode { get; set; } = string.Empty;
        public Guid? UserId { get; set; }
        public Guid? CustomerId { get; set; }
        public string GuestName { get; set; } = string.Empty;
        public string GuestEmail { get; set; } = string.Empty;
        public string GuestPhone { get; set; } = string.Empty;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int Nights { get; set; }
        public int AdultCount { get; set; }
        public int ChildrenCount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal FinalAmount { get; set; }
        public string BookingStatus { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string BookingSource { get; set; } = string.Empty;
        public string? SpecialRequests { get; set; }
        public Guid? CouponId { get; set; }

        // Navigation properties
        public UserDto? User { get; set; }
        public CustomerDto? Customer { get; set; }
        public List<BookingRoomDto> BookingRooms { get; set; } = new();
        public List<PaymentDto> Payments { get; set; } = new();
    }

    public class BookingRoomDto : BaseDto
    {
        public Guid BookingId { get; set; }
        public Guid RoomTypeId { get; set; }
        public Guid? RoomId { get; set; }
        public int Quantity { get; set; }
        public decimal RatePerNight { get; set; }
        public decimal TotalAmount { get; set; }
        public string? GuestNames { get; set; }

        // Navigation properties
        public RoomTypeDto? RoomType { get; set; }
        public RoomDto? Room { get; set; }
    }

    public class PaymentDto : BaseDto
    {
        public Guid BookingId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? TransactionId { get; set; }
        public string? PaymentGateway { get; set; }
        public DateTime? PaidAt { get; set; }
        public string? Notes { get; set; }

        // Navigation properties
        public BookingDto? Booking { get; set; }
    }

    public class CreateBookingRequest
    {
        [Required(ErrorMessage = "Guest name is required")]
        [StringLength(100)]
        public string GuestName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Guest email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(255)]
        public string GuestEmail { get; set; } = string.Empty;

        [Required(ErrorMessage = "Guest phone is required")]
        [StringLength(20)]
        public string GuestPhone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Check-in date is required")]
        public DateTime CheckInDate { get; set; }

        [Required(ErrorMessage = "Check-out date is required")]
        public DateTime CheckOutDate { get; set; }

        [Required(ErrorMessage = "Adult count is required")]
        [Range(1, 20, ErrorMessage = "Adult count must be between 1 and 20")]
        public int AdultCount { get; set; }

        [Range(0, 10, ErrorMessage = "Children count must be between 0 and 10")]
        public int ChildrenCount { get; set; }

        public string? SpecialRequests { get; set; }
        public string BookingSource { get; set; } = "website";

        // Customer info (optional - for registered users)
        public Guid? CustomerId { get; set; }

        // Rooms
        [Required(ErrorMessage = "At least one room is required")]
        public List<CreateBookingRoomRequest> Rooms { get; set; } = new();

        // Coupon
        public string? CouponCode { get; set; }
    }

    public class CreateBookingRoomRequest
    {
        [Required(ErrorMessage = "Room type ID is required")]
        public Guid RoomTypeId { get; set; }

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, 10, ErrorMessage = "Quantity must be between 1 and 10")]
        public int Quantity { get; set; }

        public string? GuestNames { get; set; }
    }

    public class UpdateBookingRequest
    {
        [Required(ErrorMessage = "Guest name is required")]
        [StringLength(100)]
        public string GuestName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Guest email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(255)]
        public string GuestEmail { get; set; } = string.Empty;

        [Required(ErrorMessage = "Guest phone is required")]
        [StringLength(20)]
        public string GuestPhone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Check-in date is required")]
        public DateTime CheckInDate { get; set; }

        [Required(ErrorMessage = "Check-out date is required")]
        public DateTime CheckOutDate { get; set; }

        [Required(ErrorMessage = "Adult count is required")]
        [Range(1, 20, ErrorMessage = "Adult count must be between 1 and 20")]
        public int AdultCount { get; set; }

        [Range(0, 10, ErrorMessage = "Children count must be between 0 and 10")]
        public int ChildrenCount { get; set; }

        public string? SpecialRequests { get; set; }
        public string BookingStatus { get; set; } = string.Empty;
    }

    public class CreateCustomerRequest
    {
        [Required(ErrorMessage = "First name is required")]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Phone { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(100)]
        public string? Nationality { get; set; }

        [StringLength(50)]
        public string? IdNumber { get; set; }

        public string? Address { get; set; }
        public string? Preferences { get; set; }
        public Guid? UserId { get; set; }
    }

    public class UpdateCustomerRequest
    {
        [Required(ErrorMessage = "First name is required")]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Phone { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(100)]
        public string? Nationality { get; set; }

        [StringLength(50)]
        public string? IdNumber { get; set; }

        public string? Address { get; set; }
        public string? Preferences { get; set; }
    }

    public class BookingListRequest : PaginationRequest
    {
        public string? Status { get; set; }
        public string? PaymentStatus { get; set; }
        public DateTime? CheckInFrom { get; set; }
        public DateTime? CheckInTo { get; set; }
        public DateTime? CheckOutFrom { get; set; }
        public DateTime? CheckOutTo { get; set; }
        public decimal? MinAmount { get; set; }
        public decimal? MaxAmount { get; set; }
        public string? BookingSource { get; set; }
        public Guid? CustomerId { get; set; }
    }

    public class RoomAvailabilityRequest
    {
        [Required(ErrorMessage = "Check-in date is required")]
        public DateTime CheckInDate { get; set; }

        [Required(ErrorMessage = "Check-out date is required")]
        public DateTime CheckOutDate { get; set; }

        [Range(1, 20, ErrorMessage = "Adult count must be between 1 and 20")]
        public int AdultCount { get; set; } = 1;

        [Range(0, 10, ErrorMessage = "Children count must be between 0 and 10")]
        public int ChildrenCount { get; set; } = 0;
    }

    public class RoomAvailabilityResponse
    {
        public List<AvailableRoomTypeDto> AvailableRoomTypes { get; set; } = new();
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int Nights { get; set; }
    }

    public class AvailableRoomTypeDto
    {
        public RoomTypeDto RoomType { get; set; } = null!;
        public int AvailableQuantity { get; set; }
        public decimal CurrentPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public bool IsAvailable => AvailableQuantity > 0;
    }

    public class BookingStatsDto
    {
        public int TotalBookings { get; set; }
        public int TodayCheckIns { get; set; }
        public int TodayCheckOuts { get; set; }
        public int CurrentGuests { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal AverageBookingValue { get; set; }
        public double OccupancyRate { get; set; }
        public Dictionary<string, int> BookingsByStatus { get; set; } = new();
        public Dictionary<string, int> BookingsBySource { get; set; } = new();
    }
}
