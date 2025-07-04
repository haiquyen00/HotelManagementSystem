using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using DTO.Auth;
using Service.Interfaces;
using Business.Model;

namespace Service.Implementations
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;
        private readonly string _googleClientId;

        public GoogleAuthService(
            IConfiguration configuration,
            IUserService userService,
            IJwtService jwtService)
        {
            _configuration = configuration;
            _userService = userService;
            _jwtService = jwtService;
            _googleClientId = _configuration["GoogleAuth:ClientId"] ?? throw new InvalidOperationException("Google ClientId not configured");
        }

        public async Task<GoogleUserInfo?> VerifyGoogleTokenAsync(string googleToken)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(googleToken, new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] { _googleClientId }
                });

                return new GoogleUserInfo
                {
                    Id = payload.Subject,
                    Email = payload.Email,
                    Name = payload.Name,
                    Picture = payload.Picture,
                    EmailVerified = payload.EmailVerified
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Google token validation failed: {ex.Message}");
                return null;
            }
        }

        public async Task<AuthResponse> GoogleLoginAsync(string googleToken)
        {
            try
            {
                // Verify Google token
                var googleUser = await VerifyGoogleTokenAsync(googleToken);
                if (googleUser == null)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid Google token"
                    };
                }

                // Check if user exists
                var existingUser = await _userService.GetByEmailAsync(googleUser.Email);
                
                User user;
                if (existingUser == null)
                {
                    // Create new user from Google info
                    user = new User
                    {
                        FullName = googleUser.Name,
                        Email = googleUser.Email.ToLower(),
                        PasswordHash = "", // No password for Google users
                        AvatarUrl = googleUser.Picture,
                        IsActive = true,
                        EmailVerifiedAt = googleUser.EmailVerified ? DateTime.UtcNow : null,
                        RoleId = Guid.Empty // Will be set to default role
                    };

                    user = await _userService.CreateAsync(user);
                    
                    // Reload user with Role navigation property
                    user = await _userService.GetByIdAsync(user.Id);
                    if (user == null)
                    {
                        return new AuthResponse
                        {
                            Success = false,
                            Message = "Failed to load user after creation"
                        };
                    }
                }
                else
                {
                    user = existingUser;
                    
                    // Update avatar if changed
                    if (!string.IsNullOrEmpty(googleUser.Picture) && user.AvatarUrl != googleUser.Picture)
                    {
                        user.AvatarUrl = googleUser.Picture;
                        await _userService.UpdateAsync(user);
                    }
                }

                // Generate JWT tokens
                var accessToken = _jwtService.GenerateAccessToken(user);
                var refreshToken = _jwtService.GenerateRefreshToken();

                return new AuthResponse
                {
                    Success = true,
                    Message = "Google login successful",
                    Data = new AuthDataResponse
                    {
                        AccessToken = accessToken,
                        RefreshToken = refreshToken,
                        TokenType = "Bearer",
                        ExpiresAt = _jwtService.GetTokenExpiration(accessToken),
                        User = new BasicUserInfo
                        {
                            Id = user.Id,
                            FullName = user.FullName,
                            Email = user.Email,
                            Role = user.Role?.Name ?? "customer",
                            AvatarUrl = user.AvatarUrl
                        }
                    }
                };
            }
            catch (Exception ex)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Google login failed: " + ex.Message
                };
            }
        }
    }
}
