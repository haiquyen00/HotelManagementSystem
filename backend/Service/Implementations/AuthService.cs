using Microsoft.EntityFrameworkCore;
using Business.Data;
using Business.Model;
using Business.Model.Enums;
using DTO.Auth;
using DTO.Base;
using Service.Interfaces;
using Newtonsoft.Json;

namespace Service.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;
        private readonly IPasswordService _passwordService;
        private readonly IEmailService _emailService;
        private readonly HotelManagementDbContext _context;

        public AuthService(
            IUserService userService,
            IJwtService jwtService,
            IPasswordService passwordService,
            IEmailService emailService,
            HotelManagementDbContext context)
        {
            _userService = userService;
            _jwtService = jwtService;
            _passwordService = passwordService;
            _emailService = emailService;
            _context = context;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userService.GetByEmailAsync(request.Email);
            if (user == null)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = ErrorMessages.GetMessage(ErrorCodes.AUTH_INVALID_CREDENTIALS)
                };
            }

            if (!user.IsActive)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = ErrorMessages.GetMessage(ErrorCodes.AUTH_ACCOUNT_INACTIVE)
                };
            }

            // Check if email is verified (optional - depends on your requirements)
            if (user.EmailVerifiedAt == null)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = ErrorMessages.GetMessage(ErrorCodes.AUTH_EMAIL_NOT_VERIFIED)
                };
            }

            if (!_passwordService.VerifyPassword(request.Password, user.PasswordHash))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = ErrorMessages.GetMessage(ErrorCodes.AUTH_INVALID_CREDENTIALS)
                };
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _userService.UpdateAsync(user);

            // Generate tokens
            var accessToken = _jwtService.GenerateAccessToken(user);
            var refreshToken = _jwtService.GenerateRefreshToken();

            return new AuthResponse
            {
                Success = true,
                Message = "Login successful",
                Data = new AuthDataResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    TokenType = "Bearer",
                    ExpiresAt = _jwtService.GetTokenExpiration(accessToken),
                    User = MapToBasicUserInfo(user)
                }
            };
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            // Check if email already exists
            if (await _userService.EmailExistsAsync(request.Email))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = ErrorMessages.GetMessage(ErrorCodes.REG_EMAIL_EXISTS)
                };
            }

            // Check if phone already exists (if provided)
            if (!string.IsNullOrEmpty(request.Phone) && await _userService.PhoneExistsAsync(request.Phone))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = ErrorMessages.GetMessage(ErrorCodes.REG_PHONE_EXISTS)
                };
            }

            // Create new user
            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email.ToLower(),
                Phone = request.Phone,
                PasswordHash = request.Password, // Will be hashed in UserService
                RoleId = request.RoleId ?? Guid.Empty,
                IsActive = true
            };

            try
            {
                user = await _userService.CreateAsync(user);

                // Generate email verification token
                var verificationToken = Guid.NewGuid().ToString();
                
                // Save verification token to user (expires in 24 hours)
                user.EmailVerificationToken = verificationToken;
                user.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24);
                await _userService.UpdateAsync(user);
                
                // Send verification email
                try
                {
                    await _emailService.SendEmailVerificationAsync(user.Email, verificationToken);
                }
                catch (Exception emailEx)
                {
                    // Log email error but don't fail registration
                    Console.WriteLine($"Failed to send verification email: {emailEx.Message}");
                }

                // Auto-login after registration - generate tokens
                var accessToken = _jwtService.GenerateAccessToken(user);
                var refreshToken = _jwtService.GenerateRefreshToken();

                return new AuthResponse
                {
                    Success = true,
                    Message = "Registration successful! Welcome to our hotel management system.",
                    Data = new AuthDataResponse
                    {
                        AccessToken = accessToken,
                        RefreshToken = refreshToken,
                        TokenType = "Bearer",
                        ExpiresAt = _jwtService.GetTokenExpiration(accessToken),
                        User = MapToBasicUserInfo(user)
                    }
                };
            }
            catch (Exception ex)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Registration failed: " + ex.Message
                };
            }
        }

        public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
        {
            // TODO: Validate refresh token from database/cache
            // For now, return error
            return new AuthResponse
            {
                Success = false,
                Message = "Invalid refresh token"
            };
        }

        public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
        {
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return false;

            if (!_passwordService.VerifyPassword(request.CurrentPassword, user.PasswordHash))
                return false;

            user.PasswordHash = _passwordService.HashPassword(request.NewPassword);
            await _userService.UpdateAsync(user);

            return true;
        }

        public async Task<bool> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            var user = await _userService.GetByEmailAsync(request.Email);
            if (user == null)
                return true; // Don't reveal if email exists for security

            try
            {
                // Generate reset token
                var resetToken = Guid.NewGuid().ToString();
                
                // Save reset token to user (expires in 1 hour)
                user.PasswordResetToken = resetToken;
                user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);
                await _userService.UpdateAsync(user);
                
                // Send password reset email
                await _emailService.SendPasswordResetEmailAsync(user.Email, resetToken);
                
                return true;
            }
            catch (Exception ex)
            {
                // Log error but don't reveal to user
                Console.WriteLine($"Failed to send password reset email: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordRequest request)
        {
            var user = await _userService.GetByEmailAsync(request.Email);
            if (user == null)
                return false;

            // Validate reset token
            if (string.IsNullOrEmpty(user.PasswordResetToken) || 
                user.PasswordResetToken != request.Token)
                return false;

            // Check if token is expired
            if (user.PasswordResetTokenExpiry == null || 
                user.PasswordResetTokenExpiry < DateTime.UtcNow)
                return false;

            // Reset password and clear token
            user.PasswordHash = _passwordService.HashPassword(request.NewPassword);
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiry = null;
            await _userService.UpdateAsync(user);

            return true;
        }

        public async Task<UserProfileDto?> GetProfileAsync(Guid userId)
        {
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return null;

            return MapToUserProfile(user);
        }

        public async Task<bool> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
        {
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return false;

            user.FullName = request.FullName;
            user.Phone = request.Phone;
            user.AvatarUrl = request.AvatarUrl;

            await _userService.UpdateAsync(user);
            return true;
        }

        public async Task<bool> VerifyEmailAsync(Guid userId, string token)
        {
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return false;

            // Check if email is already verified
            if (user.EmailVerifiedAt.HasValue)
                return true; // Already verified

            // Validate verification token
            if (string.IsNullOrEmpty(user.EmailVerificationToken) || 
                user.EmailVerificationToken != token)
                return false;

            // Check if token is expired
            if (user.EmailVerificationTokenExpiry == null || 
                user.EmailVerificationTokenExpiry < DateTime.UtcNow)
                return false;

            // Mark email as verified and clear token
            user.EmailVerifiedAt = DateTime.UtcNow;
            user.EmailVerificationToken = null;
            user.EmailVerificationTokenExpiry = null;
            await _userService.UpdateAsync(user);

            return true;
        }

        public async Task<bool> ResendVerificationEmailAsync(string email)
        {
            var user = await _userService.GetByEmailAsync(email);
            if (user == null || user.EmailVerifiedAt.HasValue)
                return false;

            var verificationToken = Guid.NewGuid().ToString();
            user.EmailVerificationToken = verificationToken;
            user.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24);
            await _userService.UpdateAsync(user);

            try
            {
                await _emailService.SendEmailVerificationAsync(user.Email, verificationToken);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> LogoutAsync(Guid userId)
        {
            // TODO: Invalidate tokens (store in blacklist or remove from cache)
            // For now, just return success
            return true;
        }

        private BasicUserInfo MapToBasicUserInfo(User user)
        {
            return new BasicUserInfo
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role?.Name ?? "customer",
                AvatarUrl = user.AvatarUrl
            };
        }

        private UserProfileDto MapToUserProfile(User user)
        {
            var permissions = new List<string>();
            var rolePermissions = new Dictionary<string, List<string>>();

            if (!string.IsNullOrEmpty(user.Role?.Permissions))
            {
                try
                {
                    rolePermissions = JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(user.Role.Permissions) 
                                      ?? new Dictionary<string, List<string>>();
                    
                    foreach (var modulePermissions in rolePermissions.Values)
                    {
                        permissions.AddRange(modulePermissions);
                    }
                }
                catch
                {
                    // If JSON parsing fails, use empty permissions
                }
            }

            return new UserProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                AvatarUrl = user.AvatarUrl,
                IsActive = user.IsActive,
                EmailVerifiedAt = user.EmailVerifiedAt,
                LastLoginAt = user.LastLoginAt,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                Role = new RoleDto
                {
                    Id = user.Role?.Id ?? Guid.Empty,
                    Name = user.Role?.Name ?? "customer",
                    DisplayName = user.Role?.DisplayName ?? "Customer",
                    Permissions = rolePermissions,
                    CreatedAt = user.Role?.CreatedAt ?? DateTime.UtcNow,
                    UpdatedAt = user.Role?.UpdatedAt ?? DateTime.UtcNow
                },
                Permissions = permissions
            };
        }
    }
}
