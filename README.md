# 🏨 Hotel Management System

A full-stack hotel management application built with .NET 8 Web API and Next.js 15.

## 🚀 Features

### 🔐 Authentication
- User registration with email verification
- Login/logout with JWT tokens
- Password reset functionality
- Role-based access control

### 🏨 Hotel Management
- Hotel listing and search
- Room management
- Booking system
- Payment processing

### 👥 User Management
- User profiles
- Booking history
- Admin dashboard

## 🛠️ Tech Stack

### Backend
- **Framework**: .NET 8 Web API
- **Database**: SQL Server
- **ORM**: Entity Framework Core
- **Authentication**: JWT + BCrypt
- **Email**: SMTP service
- **Architecture**: Clean Architecture (Service/Repository pattern)

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios

## 📁 Project Structure

```
HotelManagementSystem/
├── backend/                 # .NET 8 Web API
│   ├── API_Hotel/          # API Controllers & Startup
│   ├── Business/           # Domain Models & DbContext
│   ├── Service/            # Business Logic Services
│   ├── Repositories/       # Data Access Layer
│   └── DTO/               # Data Transfer Objects
├── frontend/               # Next.js Application
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── pages/         # App Router Pages
│   │   ├── hooks/         # Custom Hooks
│   │   ├── services/      # API Services
│   │   └── types/         # TypeScript Types
│   └── public/            # Static Assets
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- SQL Server
- Git

### Backend Setup
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run --project API_Hotel
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuration

### Backend (.NET)
Update `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your-sql-server-connection"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key",
    "Issuer": "HotelManagement",
    "Audience": "HotelManagement"
  }
}
```

### Frontend (Next.js)
Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5186/api
NEXT_PUBLIC_APP_NAME="Hotel Management System"
```

## 📚 API Documentation

See [API Documentation](./docs/API.md) for detailed API endpoints.

## 🚀 Deployment

See [Deployment Guide](./docs/DEPLOYMENT.md) for production deployment instructions.

## 👥 Contributors

- [Your Name] - Full Stack Developer

## 📄 License

This project is licensed under the MIT License.
