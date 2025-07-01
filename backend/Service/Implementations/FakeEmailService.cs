using Service.Interfaces;

namespace Service.Implementations
{
    public class FakeEmailService : IEmailService
    {
        public async Task SendEmailVerificationAsync(string email, string token)
        {
            // Simulate email sending delay
            await Task.Delay(100);
            
            Console.WriteLine($"📧 [FAKE EMAIL] Email Verification sent to: {email}");
            Console.WriteLine($"🔗 Verification Link: http://localhost:3000/auth/verify-email?email={Uri.EscapeDataString(email)}&token={token}");
            Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        }

        public async Task SendPasswordResetEmailAsync(string email, string token)
        {
            // Simulate email sending delay
            await Task.Delay(100);
            
            Console.WriteLine($"📧 [FAKE EMAIL] Password Reset sent to: {email}");
            Console.WriteLine($"🔗 Reset Link: http://localhost:3000/auth/reset-password?email={Uri.EscapeDataString(email)}&token={token}");
            Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        }

        public async Task SendWelcomeEmailAsync(string email, string fullName)
        {
            // Simulate email sending delay
            await Task.Delay(100);
            
            Console.WriteLine($"📧 [FAKE EMAIL] Welcome email sent to: {email}");
            Console.WriteLine($"👋 Welcome {fullName} to our Hotel Management System!");
            Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        }
    }
}
