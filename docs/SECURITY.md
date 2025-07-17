# 🔐 Security Configuration

## JWT Security

### 1. Secret Key Requirements
- **Minimum 32 characters** cho HMAC SHA256
- Sử dụng strong random generator
- **KHÔNG BAO GIỜ** commit vào version control

### 2. Token Configuration
```json
{
  "JwtSettings": {
    "ExpiryMinutes": 60,        // Access token: 1 hour
    "RefreshTokenExpiryDays": 7, // Refresh token: 7 days
    "ClockSkew": 5              // 5 minutes tolerance
  }
}
```

### 3. Generate Secret Key
```bash
# PowerShell
[System.Web.Security.Membership]::GeneratePassword(64, 10)

# Online tools (chỉ dùng cho development)
# https://generate-random.org/api-key-generator
```

## Email Security

### 1. Gmail App Password Setup
1. Bật 2-Factor Authentication
2. Vào Google Account Settings
3. Security → App passwords
4. Tạo app password cho ứng dụng
5. Sử dụng app password thay vì password thường

### 2. SMTP Settings
```json
{
  "EmailSettings": {
    "EnableSsl": true,
    "Port": 587,              // TLS port
    "UseDefaultCredentials": false
  }
}
```

## Database Security

### 1. Connection String Security
```json
{
  "ConnectionStrings": {
    // Development
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HotelManagement;Trusted_Connection=true;TrustServerCertificate=true;",
    
    // Production
    "DefaultConnection": "Server=prod-server;Database=HotelManagement;User Id=app_user;Password=strong_password;Encrypt=true;"
  }
}
```

### 2. Database Best Practices
- Sử dụng **dedicated database user** cho ứng dụng
- **Principle of least privilege** - chỉ cấp quyền cần thiết
- Enable **SQL Server encryption**
- Regular **backup và recovery testing**

## CORS Security

### 1. Allowed Origins
```csharp
// Development
services.AddCors(options =>
{
    options.AddPolicy("DevelopmentPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

// Production
services.AddCors(options =>
{
    options.AddPolicy("ProductionPolicy", builder =>
    {
        builder.WithOrigins("https://yourdomain.com")
               .WithMethods("GET", "POST", "PUT", "DELETE")
               .WithHeaders("Content-Type", "Authorization")
               .AllowCredentials();
    });
});
```

## Environment Security

### 1. Development Environment
```bash
# .env.local (KHÔNG commit file này)
JWT_SECRET=your-development-secret-key
DB_PASSWORD=development-password
EMAIL_PASSWORD=app-password
```

### 2. Production Environment
- Sử dụng **Azure Key Vault** hoặc **AWS Secrets Manager**
- Environment variables trên hosting platform
- **KHÔNG** hardcode secrets trong appsettings.json

## API Security Headers

### 1. Security Headers
```csharp
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
    
    await next();
});
```

### 2. Rate Limiting
```csharp
services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("ApiPolicy", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
    });
});
```