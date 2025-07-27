namespace DTO.Common
{
    /// <summary>
    /// Kết quả của bulk operation
    /// </summary>
    public class BulkOperationResult
    {
        public int TotalItems { get; set; }
        public int SuccessCount { get; set; }
        public int FailedCount { get; set; }
        public List<BulkOperationError> Errors { get; set; } = new();
        
        public bool IsCompleteSuccess => FailedCount == 0;
        public bool IsPartialSuccess => SuccessCount > 0 && FailedCount > 0;
        public bool IsCompleteFailure => SuccessCount == 0;
    }

    /// <summary>
    /// Lỗi trong bulk operation
    /// </summary>
    public class BulkOperationError
    {
        public Guid ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;
        public string ErrorCode { get; set; } = string.Empty;
    }
}
