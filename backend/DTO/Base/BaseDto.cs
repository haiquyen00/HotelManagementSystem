using System.ComponentModel.DataAnnotations;

namespace DTO.Base
{
    public abstract class BaseDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class PaginationRequest
    {
        [Range(1, int.MaxValue, ErrorMessage = "Page number must be greater than 0")]
        public int Page { get; set; } = 1;

        [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100")]
        public int PageSize { get; set; } = 10;

        public string? Search { get; set; }
        public string? SortBy { get; set; }
        public string? SortDirection { get; set; } = "asc"; // asc, desc
    }

    public class PaginationResponse<T>
    {
        public List<T> Data { get; set; } = new();
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalItems { get; set; }
        public bool HasPrevious => CurrentPage > 1;
        public bool HasNext => CurrentPage < TotalPages;
    }

    public class ErrorDetail
    {
        public string Code { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Field { get; set; }
        public object? Value { get; set; }
    }

    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<ErrorDetail> Errors { get; set; } = new();

        public static ApiResponse<T> SuccessResult(T data, string message = "Success")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data
            };
        }

        public static ApiResponse<T> ErrorResult(string message, List<ErrorDetail>? errors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = errors ?? new List<ErrorDetail>()
            };
        }

        public static ApiResponse<T> ErrorResultWithCode(string errorCode, string? field = null, object? value = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = ErrorMessages.GetMessage(errorCode),
                Errors = new List<ErrorDetail>
                {
                    new ErrorDetail
                    {
                        Code = errorCode,
                        Message = ErrorMessages.GetMessage(errorCode),
                        Field = field,
                        Value = value
                    }
                }
            };
        }

        public static ApiResponse<T> ValidationErrorResult(List<ErrorDetail> validationErrors)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = "Dữ liệu đầu vào không hợp lệ",
                Errors = validationErrors
            };
        }
    }

    public class ApiResponse : ApiResponse<object>
    {
        public static ApiResponse SuccessResult(string message = "Success")
        {
            return new ApiResponse
            {
                Success = true,
                Message = message
            };
        }

        public static new ApiResponse ErrorResult(string message, List<ErrorDetail>? errors = null)
        {
            return new ApiResponse
            {
                Success = false,
                Message = message,
                Errors = errors ?? new List<ErrorDetail>()
            };
        }

        public static new ApiResponse ErrorResultWithCode(string errorCode, string? field = null, object? value = null)
        {
            return new ApiResponse
            {
                Success = false,
                Message = ErrorMessages.GetMessage(errorCode),
                Errors = new List<ErrorDetail>
                {
                    new ErrorDetail
                    {
                        Code = errorCode,
                        Message = ErrorMessages.GetMessage(errorCode),
                        Field = field,
                        Value = value
                    }
                }
            };
        }
    }
}
