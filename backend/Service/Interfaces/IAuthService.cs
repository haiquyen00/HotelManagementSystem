using DTO.Auth;

namespace Service.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> RefreshTokenAsync(string refreshToken);
        Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
        Task<bool> ForgotPasswordAsync(ForgotPasswordRequest request);
        Task<bool> ResetPasswordAsync(ResetPasswordRequest request);
        Task<UserProfileDto?> GetProfileAsync(Guid userId);
        Task<bool> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
        Task<bool> VerifyEmailAsync(Guid userId, string token);
        Task<bool> ResendVerificationEmailAsync(string email);
        Task<bool> LogoutAsync(Guid userId);
    }
}
