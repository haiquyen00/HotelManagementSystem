using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Mail;
using Service.Interfaces;
using DTO.System;

namespace Service.Implementations
{
    public class GmailEmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<GmailEmailService> _logger;

        public GmailEmailService(IOptions<EmailSettings> emailSettings, ILogger<GmailEmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        public async Task SendEmailVerificationAsync(string email, string token)
        {
            var subject = "Verify Your Email - Hotel Management System";
            var verificationLink = $"http://localhost:3000/auth/verify-email?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(token)}";
            
            var body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #10B981; color: white; padding: 20px; text-align: center; }}
                        .content {{ padding: 20px; background-color: #f9f9f9; }}
                        .button {{ display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                        .footer {{ padding: 20px; text-align: center; color: #666; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h2>Hotel Management System</h2>
                        </div>
                        <div class='content'>
                            <h3>Verify Your Email Address</h3>
                            <p>Thank you for registering! Please click the button below to verify your email address:</p>
                            <a href='{verificationLink}' class='button'>Verify Email</a>
                            <p>Or copy and paste this link into your browser:</p>
                            <p><a href='{verificationLink}'>{verificationLink}</a></p>
                            <p><strong>This link will expire in 24 hours.</strong></p>
                            <p>If you didn't create an account, please ignore this email.</p>
                        </div>
                        <div class='footer'>
                            <p>© 2025 Hotel Management System. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendPasswordResetEmailAsync(string email, string token)
        {
            var subject = "Reset Your Password - Hotel Management System";
            var resetLink = $"http://localhost:3000/auth/reset-password?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(token)}";
            
            var body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #4F46E5; color: white; padding: 20px; text-align: center; }}
                        .content {{ padding: 20px; background-color: #f9f9f9; }}
                        .button {{ display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                        .footer {{ padding: 20px; text-align: center; color: #666; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h2>Hotel Management System</h2>
                        </div>
                        <div class='content'>
                            <h3>Reset Your Password</h3>
                            <p>You have requested to reset your password. Click the button below to reset it:</p>
                            <a href='{resetLink}' class='button'>Reset Password</a>
                            <p>Or copy and paste this link into your browser:</p>
                            <p><a href='{resetLink}'>{resetLink}</a></p>
                            <p><strong>This link will expire in 1 hour.</strong></p>
                            <p>If you didn't request this password reset, please ignore this email.</p>
                        </div>
                        <div class='footer'>
                            <p>© 2025 Hotel Management System. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendWelcomeEmailAsync(string email, string fullName)
        {
            var subject = "Welcome to Hotel Management System";
            
            var body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #059669; color: white; padding: 20px; text-align: center; }}
                        .content {{ padding: 20px; background-color: #f9f9f9; }}
                        .footer {{ padding: 20px; text-align: center; color: #666; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h2>Hotel Management System</h2>
                        </div>
                        <div class='content'>
                            <h3>Welcome {fullName}!</h3>
                            <p>Thank you for joining our Hotel Management System. Your account has been successfully created.</p>
                            <p>You can now start using our platform to manage your hotel bookings and services.</p>
                        </div>
                        <div class='footer'>
                            <p>© 2025 Hotel Management System. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>";

            await SendEmailAsync(email, subject, body);
        }

        private async Task SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                using var client = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.SmtpPort)
                {
                    Credentials = new NetworkCredential(_emailSettings.Username, _emailSettings.Password),
                    EnableSsl = _emailSettings.EnableSsl
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(to);

                await client.SendMailAsync(mailMessage);
                
                _logger.LogInformation("📧 Email sent successfully to {To}", to);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Failed to send email to {To}", to);
                throw;
            }
        }
    }
}
