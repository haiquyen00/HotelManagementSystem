using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Business.Model.Enums;

namespace Business.Model
{
    [Table("payments")]
    public class Payment : BaseEntity
    {
        [Required]
        public Guid BookingId { get; set; }
        
        public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cash;
        
        [StringLength(100)]
        public string? PaymentGateway { get; set; } // VNPay, Momo, Stripe
        
        [StringLength(255)]
        public string? TransactionId { get; set; } // ID from gateway
        
        [Column(TypeName = "decimal(12,2)")]
        public decimal Amount { get; set; } = 0;
        
        [StringLength(3)]
        public string Currency { get; set; } = "VND";
        
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        
        [Column(TypeName = "nvarchar(max)")]
        public string? GatewayResponse { get; set; } // JSON
        
        public DateTime? ProcessedAt { get; set; }
        
        [Column(TypeName = "nvarchar(max)")]
        public string? Notes { get; set; }
        
        // Navigation properties
        [ForeignKey("BookingId")]
        public virtual Booking Booking { get; set; } = null!;
    }
}
