using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Service.Interfaces;
using Business.Data;
using DTO.Auth;
using DTO.Base;

namespace API_Hotel.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;
        private readonly HotelManagementDbContext _context;

        public AuthController(IAuthService authService, ILogger<AuthController> logger, HotelManagementDbContext context)
        {
            _authService = authService;
            _logger = logger;
            _context = context;
        }

        /// <summary>
        /// Login with email and password
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthDataResponse>>> Login([FromBody] LoginRequest request)
        {
            try
            {
                // Check model validation
                if (!ModelState.IsValid)
                {
                    var validationErrors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .Select(x => new ErrorDetail
                        {
                            Code = ErrorCodes.VAL_INVALID_FORMAT,
                            Message = x.Value!.Errors.First().ErrorMessage,
                            Field = x.Key,
                            Value = x.Value.AttemptedValue
                        })
                        .ToList();

                    return BadRequest(ApiResponse<AuthDataResponse>.ValidationErrorResult(validationErrors));
                }

                var result = await _authService.LoginAsync(request);
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<AuthDataResponse>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return BadRequest(new ApiResponse<AuthDataResponse>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during login for email: {Email}", request.Email);
                return StatusCode(500, ApiResponse<AuthDataResponse>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
            }
        }

        /// <summary>
        /// Register new user account
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<AuthDataResponse>>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var result = await _authService.RegisterAsync(request);
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<AuthDataResponse>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return BadRequest(new ApiResponse<AuthDataResponse>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, new ApiResponse<AuthDataResponse>
                {
                    Success = false,
                    Message = "An error occurred during registration"
                });
            }
        }

        /// <summary>
        /// Refresh access token using refresh token
        /// </summary>
        [HttpPost("refresh")]
        public async Task<ActionResult<ApiResponse<AuthDataResponse>>> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var result = await _authService.RefreshTokenAsync(request.RefreshToken);
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<AuthDataResponse>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return BadRequest(new ApiResponse<AuthDataResponse>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return StatusCode(500, new ApiResponse<AuthDataResponse>
                {
                    Success = false,
                    Message = "An error occurred during token refresh"
                });
            }
        }

        /// <summary>
        /// Get current user profile
        /// </summary>
        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<UserProfileDto>>> GetProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                var profile = await _authService.GetProfileAsync(userId);

                if (profile == null)
                {
                    return NotFound(new ApiResponse<UserProfileDto>
                    {
                        Success = false,
                        Message = "User profile not found"
                    });
                }

                return Ok(new ApiResponse<UserProfileDto>
                {
                    Success = true,
                    Message = "Profile retrieved successfully",
                    Data = profile
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user profile");
                return StatusCode(500, new ApiResponse<UserProfileDto>
                {
                    Success = false,
                    Message = "An error occurred while getting profile"
                });
            }
        }

        /// <summary>
        /// Update current user profile
        /// </summary>
        [HttpPut("profile")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _authService.UpdateProfileAsync(userId, request);

                if (result)
                {
                    return Ok(new ApiResponse<bool>
                    {
                        Success = true,
                        Message = "Profile updated successfully",
                        Data = true
                    });
                }

                return BadRequest(new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Failed to update profile"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user profile");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while updating profile"
                });
            }
        }

        /// <summary>
        /// Change user password
        /// </summary>
        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _authService.ChangePasswordAsync(userId, request);

                if (result)
                {
                    return Ok(new ApiResponse<bool>
                    {
                        Success = true,
                        Message = "Password changed successfully",
                        Data = true
                    });
                }

                return BadRequest(new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Failed to change password. Please check your current password."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while changing password"
                });
            }
        }

        /// <summary>
        /// Request password reset
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<ActionResult<ApiResponse<bool>>> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                var result = await _authService.ForgotPasswordAsync(request);

                // Always return success for security reasons
                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Message = "If the email exists, a password reset link has been sent.",
                    Data = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during forgot password");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while processing the request"
                });
            }
        }

        /// <summary>
        /// Reset password with token
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<ActionResult<ApiResponse<bool>>> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                var result = await _authService.ResetPasswordAsync(request);

                if (result)
                {
                    return Ok(new ApiResponse<bool>
                    {
                        Success = true,
                        Message = "Password reset successfully",
                        Data = true
                    });
                }

                return BadRequest(new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Invalid or expired reset token"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while resetting password"
                });
            }
        }

        /// <summary>
        /// Logout current user
        /// </summary>
        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> Logout()
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _authService.LogoutAsync(userId);

                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Logged out successfully",
                    Data = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred during logout"
                });
            }
        }

        /// <summary>
        /// Verify email with token
        /// </summary>
        [HttpPost("verify-email")]
        public async Task<ActionResult<ApiResponse<bool>>> VerifyEmail([FromBody] VerifyEmailRequest request)
        {
            try
            {
                // Get user by email first
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (user == null)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                var result = await _authService.VerifyEmailAsync(user.Id, request.Token);

                if (result)
                {
                    return Ok(new ApiResponse<bool>
                    {
                        Success = true,
                        Message = "Email verified successfully",
                        Data = true
                    });
                }

                return BadRequest(new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Invalid verification token"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during email verification");
                return StatusCode(500, new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while verifying email"
                });
            }
        }

        /// <summary>
        /// Login with Google OAuth token
        /// </summary>
        [HttpPost("google")]
        public async Task<ActionResult<ApiResponse<AuthDataResponse>>> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                var googleAuthService = HttpContext.RequestServices.GetRequiredService<IGoogleAuthService>();
                var result = await googleAuthService.GoogleLoginAsync(request.GoogleToken);
                
                if (result.Success)
                {
                    return Ok(new ApiResponse<AuthDataResponse>
                    {
                        Success = true,
                        Message = result.Message,
                        Data = result.Data
                    });
                }

                return BadRequest(new ApiResponse<AuthDataResponse>
                {
                    Success = false,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during Google login");
                return StatusCode(500, new ApiResponse<AuthDataResponse>
                {
                    Success = false,
                    Message = "An error occurred during Google login"
                });
            }
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
        }
    }
}
