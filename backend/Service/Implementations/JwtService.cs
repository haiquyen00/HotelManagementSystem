using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Business.Model;
using Service.Interfaces;
using Newtonsoft.Json;

namespace Service.Implementations
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;
        private readonly string _secretKey;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly int _accessTokenExpirationMinutes;
        private readonly int _refreshTokenExpirationDays;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
            _secretKey = configuration["JWT:SecretKey"] ?? throw new ArgumentNullException("JWT:SecretKey");
            _issuer = configuration["JWT:Issuer"] ?? throw new ArgumentNullException("JWT:Issuer");
            _audience = configuration["JWT:Audience"] ?? throw new ArgumentNullException("JWT:Audience");
            _accessTokenExpirationMinutes = int.Parse(configuration["JWT:AccessTokenExpirationMinutes"] ?? "60");
            _refreshTokenExpirationDays = int.Parse(configuration["JWT:RefreshTokenExpirationDays"] ?? "7");
        }

        public string GenerateAccessToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);

            // Parse permissions from Role
            var permissions = new List<string>();
            if (!string.IsNullOrEmpty(user.Role?.Permissions))
            {
                try
                {
                    var permissionDict = JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(user.Role.Permissions);
                    if (permissionDict != null)
                    {
                        foreach (var modulePermissions in permissionDict.Values)
                        {
                            permissions.AddRange(modulePermissions);
                        }
                    }
                }
                catch
                {
                    // If JSON parsing fails, ignore permissions
                }
            }

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Name, user.FullName),
                new(ClaimTypes.Role, user.Role?.Name ?? "customer"),
                new("role_display_name", user.Role?.DisplayName ?? "Customer"),
                new("is_active", user.IsActive.ToString()),
                new("email_verified", user.EmailVerifiedAt.HasValue.ToString())
            };

            // Add permissions as claims
            foreach (var permission in permissions)
            {
                claims.Add(new Claim("permission", permission));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_accessTokenExpirationMinutes),
                Issuer = _issuer,
                Audience = _audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public DateTime GetTokenExpiration(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jsonToken = tokenHandler.ReadJwtToken(token);
            return jsonToken.ValidTo;
        }

        public bool ValidateToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_secretKey);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _issuer,
                    ValidateAudience = true,
                    ValidAudience = _audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public string? GetUserIdFromToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jsonToken = tokenHandler.ReadJwtToken(token);
                return jsonToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            }
            catch
            {
                return null;
            }
        }
    }
}
