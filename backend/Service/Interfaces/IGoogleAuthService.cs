using Google.Apis.Auth;
using DTO.Auth;
using Service.Interfaces;

namespace Service.Interfaces
{
    public interface IGoogleAuthService
    {
        Task<GoogleUserInfo?> VerifyGoogleTokenAsync(string googleToken);
        Task<AuthResponse> GoogleLoginAsync(string googleToken);
    }
}
