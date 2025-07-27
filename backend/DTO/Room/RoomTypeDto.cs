using System.ComponentModel.DataAnnotations;
using DTO.Base;
using DTO.Hotel;

namespace DTO.Room
{
    /// <summary>
    /// Room Type DTO cho API responses
    /// </summary>
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

        // Calculated fields cho dashboard
        public int TotalRooms { get; set; }
        public int AvailableRooms { get; set; }
        public decimal OccupancyRate { get; set; }
        public decimal AveragePrice { get; set; }
        
        // Display properties
        public string DisplayName => !string.IsNullOrEmpty(NameEn) ? $"{Name} ({NameEn})" : Name;
        public string BedConfiguration => $"{BedCount} {BedType}";
        public string AreaDisplay => $"{AreaSqm}m²";
        public string PriceDisplay => $"{BasePrice:C0} VND";
    }

    /// <summary>
    /// Room Type Image DTO
    /// </summary>
    public class RoomTypeImageDto : BaseDto
    {
        public Guid RoomTypeId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
        public bool IsPrimary { get; set; }
        public int SortOrder { get; set; }
        
        // File info cho upload
        public string? FileName { get; set; }
        public long? FileSize { get; set; }
        public string? ContentType { get; set; }
    }

    /// <summary>
    /// Room Type Summary cho listing
    /// </summary>
    public class RoomTypeSummaryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public int MaxOccupancy { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? PrimaryImageUrl { get; set; }
        public int TotalRooms { get; set; }
        public int AvailableRooms { get; set; }
        public decimal OccupancyRate { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    /// <summary>
    /// Room Type Statistics
    /// </summary>
    public class RoomTypeStatsDto
    {
        public int TotalRoomTypes { get; set; }
        public int ActiveRoomTypes { get; set; }
        public int InactiveRoomTypes { get; set; }
        public int MaintenanceRoomTypes { get; set; }
        public int TotalRooms { get; set; }
        public decimal AveragePrice { get; set; }
        public decimal HighestPrice { get; set; }
        public decimal LowestPrice { get; set; }
        public decimal AverageOccupancy { get; set; }
        public Dictionary<string, int> StatusCounts { get; set; } = new();
        public Dictionary<string, int> BedTypeCounts { get; set; } = new();
        public List<RoomTypeRevenueSummary> TopRevenueTypes { get; set; } = new();
    }

    /// <summary>
    /// Room Type Revenue Summary
    /// </summary>
    public class RoomTypeRevenueSummary
    {
        public Guid RoomTypeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int TotalBookings { get; set; }
        public decimal AverageRate { get; set; }
        public decimal OccupancyRate { get; set; }
    }

    /// <summary>
    /// Room Type Availability Response
    /// </summary>
    public class RoomTypeAvailabilityDto
    {
        public Guid RoomTypeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? NameEn { get; set; }
        public decimal BasePrice { get; set; }
        public decimal CurrentPrice { get; set; } // Giá đã áp dụng pricing rules
        public int MaxOccupancy { get; set; }
        public int TotalRooms { get; set; }
        public int AvailableRooms { get; set; }
        public bool IsAvailable { get; set; }
        public string? PrimaryImageUrl { get; set; }
        public List<string> UnavailableReasons { get; set; } = new();
        public List<AmenityDto> Amenities { get; set; } = new();
        
        // Pricing breakdown
        public decimal BaseRate { get; set; }
        public decimal TaxRate { get; set; }
        public decimal TotalRate { get; set; }
        public List<PricingRuleDto> AppliedRules { get; set; } = new();
    }

    /// <summary>
    /// Pricing Rule DTO
    /// </summary>
    public class PricingRuleDto
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // percentage, fixed
        public decimal Value { get; set; }
        public decimal AdjustmentAmount { get; set; }
    }
}
