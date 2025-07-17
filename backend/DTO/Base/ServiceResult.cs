namespace DTO.Base
{
    public class ServiceResult<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<ErrorDetail> Errors { get; set; } = new();

        public static ServiceResult<T> SuccessResult(T data, string message = "Thành công")
        {
            return new ServiceResult<T>
            {
                Success = true,
                Message = message,
                Data = data
            };
        }

        public static ServiceResult<T> ErrorResult(string message, List<ErrorDetail>? errors = null)
        {
            return new ServiceResult<T>
            {
                Success = false,
                Message = message,
                Errors = errors ?? new List<ErrorDetail>()
            };
        }

        public static ServiceResult<T> ErrorResultWithCode(string errorCode, string? field = null, object? value = null)
        {
            return new ServiceResult<T>
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

    public class ServiceResult : ServiceResult<object>
    {
        public static new ServiceResult SuccessResult(string message = "Thành công")
        {
            return new ServiceResult
            {
                Success = true,
                Message = message
            };
        }

        public static new ServiceResult ErrorResult(string message, List<ErrorDetail>? errors = null)
        {
            return new ServiceResult
            {
                Success = false,
                Message = message,
                Errors = errors ?? new List<ErrorDetail>()
            };
        }
    }
}
