using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace DTO.Base
{
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
                Data = data,
                Errors = new List<ErrorDetail>()
            };
        }

        public static ApiResponse<T> ErrorResult(string message, List<ErrorDetail>? errors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Data = default,
                Errors = errors ?? new List<ErrorDetail>()
            };
        }

        public static ApiResponse<T> ValidationErrorResult(ModelStateDictionary modelState)
        {
            var errors = new List<ErrorDetail>();
            
            foreach (var key in modelState.Keys)
            {
                var modelStateEntry = modelState[key];
                if (modelStateEntry != null && modelStateEntry.Errors.Count > 0)
                {
                    foreach (var error in modelStateEntry.Errors)
                    {
                        errors.Add(new ErrorDetail
                        {
                            Code = "VAL_001",
                            Message = error.ErrorMessage,
                            Field = key,
                            Value = modelStateEntry.AttemptedValue
                        });
                    }
                }
            }

            return new ApiResponse<T>
            {
                Success = false,
                Message = "Dữ liệu đầu vào không hợp lệ",
                Data = default,
                Errors = errors
            };
        }
    }

    public class ErrorDetail
    {
        public string Code { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Field { get; set; }
        public string? Value { get; set; }
    }
}
