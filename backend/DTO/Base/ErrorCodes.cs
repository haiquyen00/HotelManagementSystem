namespace DTO.Base
{
    public static class ErrorCodes
    {
        // Authentication Errors (AUTH_xxx)
        public const string AUTH_INVALID_CREDENTIALS = "AUTH_001";
        public const string AUTH_EMAIL_NOT_FOUND = "AUTH_002";
        public const string AUTH_ACCOUNT_LOCKED = "AUTH_003";
        public const string AUTH_ACCOUNT_INACTIVE = "AUTH_004";
        public const string AUTH_EMAIL_NOT_VERIFIED = "AUTH_005";
        public const string AUTH_PASSWORD_EXPIRED = "AUTH_006";
        public const string AUTH_INVALID_TOKEN = "AUTH_007";
        public const string AUTH_TOKEN_EXPIRED = "AUTH_008";
        public const string AUTH_REFRESH_TOKEN_INVALID = "AUTH_009";
        public const string AUTH_REFRESH_TOKEN_EXPIRED = "AUTH_010";
        
        // Registration Errors (REG_xxx)
        public const string REG_EMAIL_EXISTS = "REG_001";
        public const string REG_PHONE_EXISTS = "REG_002";
        public const string REG_WEAK_PASSWORD = "REG_003";
        public const string REG_INVALID_EMAIL_DOMAIN = "REG_004";
        public const string REG_REGISTRATION_DISABLED = "REG_005";
        
        // Validation Errors (VAL_xxx)
        public const string VAL_REQUIRED_FIELD = "VAL_001";
        public const string VAL_INVALID_FORMAT = "VAL_002";
        public const string VAL_LENGTH_EXCEEDED = "VAL_003";
        public const string VAL_PASSWORD_MISMATCH = "VAL_004";
        public const string VAL_INVALID_PHONE = "VAL_005";
        
        // Password Errors (PWD_xxx)
        public const string PWD_CURRENT_INCORRECT = "PWD_001";
        public const string PWD_SAME_AS_CURRENT = "PWD_002";
        public const string PWD_RECENTLY_USED = "PWD_003";
        public const string PWD_RESET_TOKEN_INVALID = "PWD_004";
        public const string PWD_RESET_TOKEN_EXPIRED = "PWD_005";
        
        // User Profile Errors (USR_xxx)
        public const string USR_NOT_FOUND = "USR_001";
        public const string USR_PROFILE_UPDATE_FAILED = "USR_002";
        public const string USR_AVATAR_UPLOAD_FAILED = "USR_003";
        
        // Server Errors (SRV_xxx)
        public const string SRV_DATABASE_ERROR = "SRV_001";
        public const string SRV_EMAIL_SERVICE_ERROR = "SRV_002";
        public const string SRV_INTERNAL_ERROR = "SRV_003";
        public const string SRV_SERVICE_UNAVAILABLE = "SRV_004";
        
        // Room Type Errors (RMT_xxx)
        public const string RMT_NOT_FOUND = "RMT_001";
        public const string RMT_NAME_EXISTS = "RMT_002";
        public const string RMT_CANNOT_DELETE_HAS_ROOMS = "RMT_003";
        public const string RMT_CANNOT_DELETE_HAS_BOOKINGS = "RMT_004";
        public const string RMT_INVALID_PRICE_RANGE = "RMT_005";
        public const string RMT_INVALID_OCCUPANCY = "RMT_006";
        public const string RMT_HOTEL_NOT_FOUND = "RMT_007";
        public const string RMT_IMAGE_UPLOAD_FAILED = "RMT_008";
        public const string RMT_STATUS_TRANSITION_INVALID = "RMT_009";
        public const string RMT_DUPLICATE_FAILED = "RMT_010";
        
        // Room Errors (ROM_xxx)
        public const string ROM_NOT_FOUND = "ROM_001";
        public const string ROM_NUMBER_EXISTS = "ROM_002";
        public const string ROM_CANNOT_DELETE_HAS_BOOKINGS = "ROM_003";
        public const string ROM_STATUS_TRANSITION_INVALID = "ROM_004";
        public const string ROM_ROOM_TYPE_NOT_FOUND = "ROM_005";
    }

    public static class ErrorMessages
    {
        public static readonly Dictionary<string, string> Messages = new()
        {
            // Authentication Messages
            [ErrorCodes.AUTH_INVALID_CREDENTIALS] = "Email hoặc mật khẩu không chính xác",
            [ErrorCodes.AUTH_EMAIL_NOT_FOUND] = "Email này chưa được đăng ký",
            [ErrorCodes.AUTH_ACCOUNT_LOCKED] = "Tài khoản đã bị khóa do đăng nhập sai quá nhiều lần",
            [ErrorCodes.AUTH_ACCOUNT_INACTIVE] = "Tài khoản chưa được kích hoạt",
            [ErrorCodes.AUTH_EMAIL_NOT_VERIFIED] = "Vui lòng xác thực email trước khi đăng nhập",
            [ErrorCodes.AUTH_PASSWORD_EXPIRED] = "Mật khẩu đã hết hạn, vui lòng đổi mật khẩu mới",
            [ErrorCodes.AUTH_INVALID_TOKEN] = "Token không hợp lệ",
            [ErrorCodes.AUTH_TOKEN_EXPIRED] = "Token đã hết hạn",
            [ErrorCodes.AUTH_REFRESH_TOKEN_INVALID] = "Refresh token không hợp lệ",
            [ErrorCodes.AUTH_REFRESH_TOKEN_EXPIRED] = "Refresh token đã hết hạn",
            
            // Registration Messages
            [ErrorCodes.REG_EMAIL_EXISTS] = "Email này đã được sử dụng",
            [ErrorCodes.REG_PHONE_EXISTS] = "Số điện thoại này đã được sử dụng",
            [ErrorCodes.REG_WEAK_PASSWORD] = "Mật khẩu quá yếu, vui lòng chọn mật khẩu mạnh hơn",
            [ErrorCodes.REG_INVALID_EMAIL_DOMAIN] = "Domain email không được phép",
            [ErrorCodes.REG_REGISTRATION_DISABLED] = "Đăng ký tài khoản tạm thời bị vô hiệu hóa",
            
            // Validation Messages
            [ErrorCodes.VAL_REQUIRED_FIELD] = "Trường này là bắt buộc",
            [ErrorCodes.VAL_INVALID_FORMAT] = "Định dạng không hợp lệ",
            [ErrorCodes.VAL_LENGTH_EXCEEDED] = "Độ dài vượt quá giới hạn cho phép",
            [ErrorCodes.VAL_PASSWORD_MISMATCH] = "Mật khẩu xác nhận không khớp",
            [ErrorCodes.VAL_INVALID_PHONE] = "Số điện thoại không hợp lệ",
            
            // Password Messages
            [ErrorCodes.PWD_CURRENT_INCORRECT] = "Mật khẩu hiện tại không chính xác",
            [ErrorCodes.PWD_SAME_AS_CURRENT] = "Mật khẩu mới không được trùng với mật khẩu hiện tại",
            [ErrorCodes.PWD_RECENTLY_USED] = "Mật khẩu này đã được sử dụng gần đây",
            [ErrorCodes.PWD_RESET_TOKEN_INVALID] = "Mã reset mật khẩu không hợp lệ",
            [ErrorCodes.PWD_RESET_TOKEN_EXPIRED] = "Mã reset mật khẩu đã hết hạn",
            
            // User Profile Messages
            [ErrorCodes.USR_NOT_FOUND] = "Người dùng không tồn tại",
            [ErrorCodes.USR_PROFILE_UPDATE_FAILED] = "Cập nhật thông tin thất bại",
            [ErrorCodes.USR_AVATAR_UPLOAD_FAILED] = "Upload ảnh đại diện thất bại",
            
            // Server Messages
            [ErrorCodes.SRV_DATABASE_ERROR] = "Lỗi cơ sở dữ liệu",
            [ErrorCodes.SRV_EMAIL_SERVICE_ERROR] = "Lỗi dịch vụ gửi email",
            [ErrorCodes.SRV_INTERNAL_ERROR] = "Lỗi hệ thống nội bộ",
            [ErrorCodes.SRV_SERVICE_UNAVAILABLE] = "Dịch vụ tạm thời không khả dụng",
            
            // Room Type Messages
            [ErrorCodes.RMT_NOT_FOUND] = "Loại phòng không tồn tại",
            [ErrorCodes.RMT_NAME_EXISTS] = "Tên loại phòng đã tồn tại",
            [ErrorCodes.RMT_CANNOT_DELETE_HAS_ROOMS] = "Không thể xóa loại phòng đang có phòng",
            [ErrorCodes.RMT_CANNOT_DELETE_HAS_BOOKINGS] = "Không thể xóa loại phòng đang có booking",
            [ErrorCodes.RMT_INVALID_PRICE_RANGE] = "Giá phòng không hợp lệ",
            [ErrorCodes.RMT_INVALID_OCCUPANCY] = "Số lượng người ở không hợp lệ",
            [ErrorCodes.RMT_HOTEL_NOT_FOUND] = "Khách sạn không tồn tại",
            [ErrorCodes.RMT_IMAGE_UPLOAD_FAILED] = "Upload hình ảnh thất bại",
            [ErrorCodes.RMT_STATUS_TRANSITION_INVALID] = "Không thể chuyển trạng thái loại phòng",
            [ErrorCodes.RMT_DUPLICATE_FAILED] = "Sao chép loại phòng thất bại",
            
            // Room Messages
            [ErrorCodes.ROM_NOT_FOUND] = "Phòng không tồn tại",
            [ErrorCodes.ROM_NUMBER_EXISTS] = "Số phòng đã tồn tại",
            [ErrorCodes.ROM_CANNOT_DELETE_HAS_BOOKINGS] = "Không thể xóa phòng đang có booking",
            [ErrorCodes.ROM_STATUS_TRANSITION_INVALID] = "Không thể chuyển trạng thái phòng",
            [ErrorCodes.ROM_ROOM_TYPE_NOT_FOUND] = "Loại phòng không tồn tại"
        };

        public static string GetMessage(string errorCode)
        {
            return Messages.TryGetValue(errorCode, out var message) ? message : "Đã xảy ra lỗi không xác định";
        }
    }
}
