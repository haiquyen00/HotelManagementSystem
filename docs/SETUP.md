# 🔧 Setup Guide

## Prerequisites

- .NET 8 SDK
- Node.js 18+
- SQL Server (LocalDB or full instance)
- Visual Studio 2022 or VS Code
- Git

## Backend Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd HotelManagementSystem
```

### 2. Database Configuration
```bash
cd backend/API_Hotel
```

Copy `appsettings.example.json` to `appsettings.json`:
```bash
cp appsettings.example.json appsettings.json
```

Update `appsettings.json` with your settings:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HotelManagement;Trusted_Connection=true;TrustServerCertificate=true;"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-must-be-at-least-32-characters-long-for-security",
    "Issuer": "HotelManagement",
    "Audience": "HotelManagement",
    "ExpiryMinutes": 60
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "Port": 587,
    "SenderEmail": "your-email@gmail.com",
    "SenderName": "Hotel Management System",
    "Username": "your-email@gmail.com",
    "Password": "your-gmail-app-password"
  }
}
```

### 3. Database Migration
```bash
# Restore packages
dotnet restore

# Create and apply migrations
dotnet ef migrations add InitialCreate --project ../Business
dotnet ef database update --project ../Business
```

### 4. Run Backend
```bash
dotnet run --project API_Hotel
```

Backend will be available at: `http://localhost:5186`

## Frontend Setup

### 1. Navigate to Frontend
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5186/api
NEXT_PUBLIC_APP_NAME="Hotel Management System"
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### 4. Run Frontend
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 🔐 Security Notes

### JWT Secret Key
- Must be at least 32 characters long
- Use a strong, random key in production
- Never commit to version control

### Email Configuration
- For Gmail: Use App Password, not regular password
- Enable 2FA and generate App Password in Google Account settings

### Database
- Use strong passwords in production
- Enable SSL/TLS connections
- Backup regularly

## 🚀 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup instructions.

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check SQL Server is running
- Verify connection string
- Run `dotnet ef database update`

**Frontend can't connect to API:**
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check backend is running on correct port
- Check CORS configuration

**Email not sending:**
- Verify SMTP settings
- Check Gmail App Password
- Test with a simple email client first

**JWT Token Issues:**
- Ensure SecretKey is at least 32 characters
- Check token expiry settings
- Verify issuer/audience configuration
