using DTO.Auth;

namespace Service.Interfaces
{
    public interface IPasswordService
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string hashedPassword);
        string GenerateRandomPassword(int length = 8);
    }
}
