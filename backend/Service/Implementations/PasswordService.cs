using System.Security.Cryptography;
using Service.Interfaces;

namespace Service.Implementations
{
    public class PasswordService : IPasswordService
    {
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {
            try
            {
                // Try BCrypt first (new format)
                return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
            }
            catch (BCrypt.Net.SaltParseException)
            {
                // Fallback: Check if it's plain text (for old data)
                if (password == hashedPassword)
                {
                    return true;
                }
                
                // Fallback: Check if it's simple hash (MD5, SHA256, etc.)
                // Add other legacy hash checks here if needed
                
                return false;
            }
            catch (Exception)
            {
                // For any other BCrypt exceptions
                return false;
            }
        }

        public string GenerateRandomPassword(int length = 8)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[length];
            rng.GetBytes(bytes);
            
            return new string(bytes.Select(b => chars[b % chars.Length]).ToArray());
        }
    }
}
