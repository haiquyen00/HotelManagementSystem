---
applyTo: '**'
---

# 🎯 Custom Instructions cho Hotel Management System

## 📋 I. HƯỚNG DẪN CHUNG

**Bối cảnh dự án:**
- Hệ thống quản lý khách sạn full-stack
- Backend: .NET 8 Web API với Clean Architecture  
- Frontend: Next.js 15 với TypeScript + Tailwind CSS
- Database: SQL Server với Entity Framework Core
- Authentication: JWT + BCrypt

**Các module chính:**
1. Xác thực & phân quyền
2. Quản lý khách sạn (loại phòng, tiện ích, giá cả)
3. Hệ thống đặt phòng
4. Quản lý khách hàng
5. Dashboard & thống kê

## 🔧 II. HƯỚNG DẪN NEXT.JS FRONTEND

### Cấu trúc thư mục:
- Tuân thủ App Router của Next.js 15
- Components trong `src/components/`
- Pages trong `src/app/`
- Services trong `src/services/`
- Types trong `src/types/`

### Quy tắc đặt tên:
- Components: PascalCase (`HotelDashboard.tsx`)
- Pages: kebab-case (`dashboard/page.tsx`)
- Hooks: prefix 'use' (`useAuth.ts`)

### Styling Guidelines:
- Sử dụng design system colors đã định nghĩa
- Grid layouts cho cards
- Form layouts với proper spacing
- Responsive design: mobile-first approach

### API Integration:
- Tạo service layer riêng biệt
- Sử dụng custom hooks cho API calls
- Proper error handling với toast notifications
- Loading states cho tất cả async operations

### Performance:
- Lazy loading cho heavy components
- Memoization cho expensive calculations
- Optimize images với Next.js Image component

## 🏗️ III. HƯỚNG DẪN .NET API BACKEND

### Clean Architecture:
- API_Hotel: Controllers & Startup
- Business: Domain entities & DbContext
- Service: Business logic services
- Repositories: Data access layer
- DTO: Data transfer objects

### Controller Patterns:
- Base controller với dependency injection
- Proper HTTP status codes
- Standardized response format
- Global exception handling

### RESTful Conventions:
- Naming: `/api/hotels`, `/api/rooms`, `/api/bookings`
- HTTP methods: GET, POST, PUT, DELETE
- Query parameters cho filtering/pagination
- Nested resources: `/api/hotels/{id}/rooms`

### Service Layer:
- Interface-based design
- Dependency injection
- Proper error handling và logging
- Business logic separation

### Repository Pattern:
- Generic base repository
- Specific repositories cho domain entities
- Async/await patterns
- LINQ queries optimization

### Validation:
- Model validation với Data Annotations
- FluentValidation cho complex rules
- Custom validation attributes
- Client and server-side validation

### Database Design:
- Base entity với common properties
- Entity configurations
- Proper relationships và foreign keys
- Migration management

## 🌐 IV. QUY TẮC THIẾT KẾ RESTFUL API

### URL Structure & Resource Naming:
- Sử dụng danh từ số nhiều: `/api/hotels`, `/api/rooms`
- Lowercase với dấu gạch ngang: `/room-types`, `/booking-history`
- Không dùng động từ trong URL

### HTTP Methods Standards:
- `GET /api/hotels` - Lấy danh sách
- `POST /api/hotels` - Tạo mới
- `PUT /api/hotels/{id}` - Cập nhật toàn bộ
- `PATCH /api/hotels/{id}` - Cập nhật một phần
- `DELETE /api/hotels/{id}` - Xóa

### HTTP Status Codes:
- 200 OK, 201 Created, 204 No Content
- 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- 500 Internal Server Error

### Query Parameters:
- Filtering: `?type=deluxe&status=available`
- Pagination: `?page=1&limit=10`
- Sorting: `?sort=name&order=asc`
- Search: `?search=grand`

## 🔄 V. TÍCH HỢP FRONTEND-BACKEND

### Type Synchronization:
- Shared interfaces giữa frontend và backend
- Consistent naming conventions
- Proper date/time handling
- Currency formatting

### Error Handling:
- Consistent error response format
- Proper HTTP status codes
- User-friendly error messages
- Logging cho debugging

### Authentication Flow:
- JWT token management
- Refresh token implementation
- Role-based authorization
- Protected routes

## 📝 VI. QUY TRÌNH PHÁT TRIỂN

### Git Workflow:
- Branch naming: `feature/`, `bugfix/`, `hotfix/`
- Commit messages bằng tiếng Việt
- Pull request templates
- Code review checklist

### Code Quality:
- Consistent formatting
- Proper commenting
- Error handling
- Performance considerations

### Documentation:
- API documentation với Swagger
- Component documentation
- README files cho features
- Setup và deployment guides

---

**Lưu ý quan trọng:**
- Luôn sử dụng tiếng Việt trong comments và messages
- Tuân thủ design system đã định nghĩa
- Implement proper error handling
- Optimize cho performance và accessibility
- Maintain clean và readable code structure