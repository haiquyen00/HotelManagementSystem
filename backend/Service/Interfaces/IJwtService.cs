using Business.Model;

namespace Service.Interfaces
{
    public interface IJwtService
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken();
        DateTime GetTokenExpiration(string token);
        bool ValidateToken(string token);
        string? GetUserIdFromToken(string token);
    }
}
