using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Business.Model.Enums;

namespace Business.Model
{
    [Table("chat_conversations")]
    public class ChatConversation : BaseEntity
    {
        public Guid? CustomerId { get; set; }
        
        [StringLength(100)]
        public string? GuestName { get; set; } // For non-registered guests
        
        [StringLength(255)]
        [EmailAddress]
        public string? GuestEmail { get; set; }
        
        public Guid? StaffId { get; set; } // Assigned staff
        
        public ChatStatus Status { get; set; } = ChatStatus.Open;
        
        [StringLength(20)]
        public string Priority { get; set; } = "normal"; // low, normal, high, urgent
        
        [StringLength(200)]
        public string? Subject { get; set; }
        
        [StringLength(20)]
        public string Channel { get; set; } = "website"; // website, mobile, email, phone
        
        public DateTime? LastMessageAt { get; set; }
        
        [StringLength(50)]
        public string? RoomNumber { get; set; } // If customer is currently staying
        
        // Navigation properties
        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }
        
        [ForeignKey("StaffId")]
        public virtual User? AssignedStaff { get; set; }
        
        public virtual ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
    }

    [Table("chat_messages")]
    public class ChatMessage : BaseEntity
    {
        [Required]
        public Guid ConversationId { get; set; }
        
        public SenderType SenderType { get; set; } = SenderType.Customer;
        
        public Guid? SenderId { get; set; } // customer_id or user_id
        
        [StringLength(100)]
        public string? SenderName { get; set; }
        
        public MessageType MessageType { get; set; } = MessageType.Text;
        
        [Column(TypeName = "nvarchar(max)")]
        public string Content { get; set; } = string.Empty;
        
        [Column(TypeName = "nvarchar(max)")]
        public string? Attachments { get; set; } // JSON: Array of file URLs
        
        public bool IsRead { get; set; } = false;
        
        public DateTime? ReadAt { get; set; }
        
        // Navigation properties
        [ForeignKey("ConversationId")]
        public virtual ChatConversation Conversation { get; set; } = null!;
    }
}
