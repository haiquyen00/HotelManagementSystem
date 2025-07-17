# ⚙️ Configuration Guide

## Backend Configuration

### 1. Database Settings
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HotelManagement;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

**Connection String Options:**
- **LocalDB**: `Server=(localdb)\\mssqllocaldb;...`
- **SQL Server Express**: `Server=.\\SQLEXPRESS;...`
- **Full SQL Server**: `Server=localhost;...`
- **Azure SQL**: `Server=tcp:server.database.windows.net,1433;...`

### 2. JWT Settings
```json
{
  "JwtSettings": {
    "SecretKey": "your-32-character-minimum-secret-key",
    "Issuer": "HotelManagement",
    "Audience": "HotelManagement", 
    "ExpiryMinutes": 60,
    "RefreshTokenExpiryDays": 7
  }
}
```

### 3. Email Configuration
```json
{
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "Port": 587,
    "SenderEmail": "your-email@gmail.com",
    "SenderName": "Hotel Management System",
    "Username": "your-email@gmail.com",
    "Password": "your-app-password",
    "EnableSsl": true
  }
}
```

### 4. CORS Configuration
```json
{
  "CorsSettings": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "AllowCredentials": true
  }
}
```

## Frontend Configuration

### 1. Environment Variables
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5186/api
NEXT_PUBLIC_API_TIMEOUT=30000

# App Information
NEXT_PUBLIC_APP_NAME="Hotel Management System"
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_DEBUG_MODE=true
```

### 2. Next.js Configuration
File `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'yourdomain.com'],
  },
  env: {
    CUSTOM_KEY: 'custom-value',
  },
}

module.exports = nextConfig
```

### 3. Tailwind Configuration
File `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-navy': '#2B5797',
        'ocean-blue': '#4A90E2',
        'seafoam-green': '#7ED321',
        'coral-pink': '#F5A623',
        'pearl-white': '#F8F9FA',
      },
    },
  },
  plugins: [],
}
```