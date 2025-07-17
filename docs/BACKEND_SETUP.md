# 🏗️ Backend Setup

## 1. Clone Repository
```bash
git clone <your-repo-url>
cd HotelManagementSystem/backend
```

## 2. Cấu hình Database

### Tạo file cấu hình
```bash
cd API_Hotel
cp appsettings.example.json appsettings.json
```

### Cập nhật appsettings.json
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

## 3. Database Migration
```bash
# Restore packages
dotnet restore

# Tạo migration đầu tiên
dotnet ef migrations add InitialCreate --project ../Business

# Áp dụng migration vào database
dotnet ef database update --project ../Business
```

## 4. Chạy Backend
```bash
dotnet run --project API_Hotel
```

**Backend sẽ chạy tại:** `http://localhost:5186`

## 5. Kiểm tra API
- Truy cập Swagger UI: `http://localhost:5186/swagger`
- Test endpoints cơ bản
- Xác minh database connection

## 6. Seed Data (Optional)
```bash
# Chạy seed data nếu có
dotnet run --project API_Hotel -- --seed
```