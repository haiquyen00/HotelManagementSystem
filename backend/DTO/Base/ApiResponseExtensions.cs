using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace DTO.Base
{
    public static class ApiResponseExtensions
    {
        public static ApiResponse<T> ValidationErrorResult<T>(ModelStateDictionary modelState)
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

            return ApiResponse<T>.ValidationErrorResult(errors);
        }
    }
}
