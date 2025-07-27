using System.ComponentModel.DataAnnotations;
using DTO.Base;
using DTO.Hotel;

namespace DTO.Room
{
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
}
