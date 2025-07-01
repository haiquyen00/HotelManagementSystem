namespace Service.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailVerificationAsync(string email, string token);
        Task SendPasswordResetEmailAsync(string email, string token);
        Task SendWelcomeEmailAsync(string email, string fullName);
    }
}
