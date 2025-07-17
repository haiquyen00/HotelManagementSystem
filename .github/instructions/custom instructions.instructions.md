---
applyTo: '**'
---

# 🎯 Custom Instructions cho Hotel Management System

## 📜 Quy tắc chung

1.  **Ngôn ngữ:** Luôn luôn phản hồi và tạo mã nguồn bằng tiếng Việt khi được yêu cầu giải thích hoặc thảo luận.
2.  **Tài liệu thiết kế:** Luôn tuân thủ các quy tắc và cấu trúc được định nghĩa trong file `docs/Detailed-design.md` (giả định tên file). Mọi giải pháp hoặc mã nguồn được tạo ra phải phù hợp với tài liệu này.
3.  **Cấu trúc dự án:** Hiểu rõ và tuân thủ cấu trúc thư mục đã được định nghĩa cho cả backend và frontend. Đặt các file mới vào đúng thư mục tương ứng

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
- Sử dụng danh từ số nhiều: `/api/hotels`, `/api/rooms`, `/api/bookings`
- Lowercase với dấu gạch ngang: `/api/room-types`, `/api/booking-history`
- Không dùng động từ trong URL
- Hierarchy resources: `/api/hotels/{hotelId}/rooms`, `/api/rooms/{roomId}/amenities`

### HTTP Methods Standards:
- `GET /api/hotels` - Lấy danh sách hotels
- `GET /api/hotels/{id}` - Lấy hotel theo ID
- `POST /api/hotels` - Tạo hotel mới
- `PUT /api/hotels/{id}` - Cập nhật toàn bộ hotel
- `PATCH /api/hotels/{id}` - Cập nhật một phần hotel
- `DELETE /api/hotels/{id}` - Xóa hotel
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/bookings/{id}/cancel` - Hủy booking
- `PUT /api/rooms/{id}/status` - Thay đổi trạng thái phòng

### HTTP Status Codes:
**Success (2xx):**
- `200 OK` - GET, PUT, PATCH thành công
- `201 Created` - POST thành công, trả về resource mới
- `204 No Content` - DELETE thành công, không có content

**Client Error (4xx):**
- `400 Bad Request` - Dữ liệu đầu vào không hợp lệ
- `401 Unauthorized` - Chưa đăng nhập hoặc token không hợp lệ
- `403 Forbidden` - Không có quyền truy cập resource
- `404 Not Found` - Resource không tồn tại
- `409 Conflict` - Dữ liệu đã tồn tại (email trùng, số phòng trùng)
- `422 Unprocessable Entity` - Validation errors

**Server Error (5xx):**
- `500 Internal Server Error` - Lỗi server nội bộ

### Query Parameters Standards:
**Filtering:**
- `?status=available&type=deluxe` - Lọc theo trạng thái và loại
- `?price_min=100000&price_max=500000` - Lọc theo khoảng giá
- `?check_in=2025-07-20&check_out=2025-07-25` - Lọc theo ngày

**Pagination:**
- `?page=1&pageSize=10` - Phân trang chuẩn
- `?offset=20&limit=10` - Alternative pagination

**Sorting:**
- `?sortBy=createdAt&sortDirection=desc` - Sắp xếp theo field
- `?sort=name,price&order=asc,desc` - Multiple sorting

**Search:**
- `?search=grand hotel` - Tìm kiếm full-text
- `?q=deluxe` - Quick search

### Request Headers Standards:
```
Content-Type: application/json
Authorization: Bearer {jwt_token}
Accept: application/json
X-Request-ID: {unique_request_id}
```

### Standardized Response Format:
**Success Response:**
```json
{
  "success": true,
  "message": "Lấy danh sách khách sạn thành công",
  "data": {
    // Response data here
  },
  "errors": []
}
```

**Pagination Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "data": [...],
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 5,
    "totalItems": 50,
    "hasPrevious": false,
    "hasNext": true
  },
  "errors": []
}
```

**Error Response Format:**
```json
{
  "success": false,
  "message": "Dữ liệu đầu vào không hợp lệ",
  "data": null,
  "errors": [
    {
      "code": "VAL_REQUIRED_FIELD",
      "message": "Email là bắt buộc",
      "field": "email",
      "value": null
    },
    {
      "code": "REG_EMAIL_EXISTS", 
      "message": "Email này đã được sử dụng",
      "field": "email",
      "value": "user@example.com"
    }
  ]
}
```

### Error Code System:
**Authentication Errors (AUTH_xxx):**
- `AUTH_001` - Email hoặc mật khẩu không chính xác
- `AUTH_007` - Token không hợp lệ
- `AUTH_008` - Token đã hết hạn

**Validation Errors (VAL_xxx):**
- `VAL_001` - Trường bắt buộc bị thiếu
- `VAL_002` - Định dạng không hợp lệ
- `VAL_003` - Độ dài vượt quá giới hạn

**Business Logic Errors (BIZ_xxx):**
- `BIZ_001` - Phòng đã được đặt
- `BIZ_002` - Không thể hủy booking đã quá hạn
- `BIZ_003` - Số lượng phòng không đủ

### API Versioning Strategy:
**URL Versioning (Recommended):**
- `/api/v1/hotels` - Version 1
- `/api/v2/hotels` - Version 2

**Header Versioning:**
```
API-Version: 1.0
Accept: application/vnd.hotel.v1+json
```

### Security Headers:
**Request:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
X-API-Key: your-api-key (nếu cần)
```

**Response:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
X-Request-ID: req_123456789
```

### CORS Configuration:
**Development:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Request-ID
Access-Control-Allow-Credentials: true
```

**Production:**
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

### Content Negotiation:
**Request Accept Headers:**
- `application/json` - JSON response
- `application/xml` - XML response (nếu hỗ trợ)
- `text/csv` - CSV export
- `application/pdf` - PDF export

**Response Content-Type:**
- `application/json; charset=utf-8`
- `text/csv; charset=utf-8`

### Caching Strategy:
**Static Data (24h cache):**
```
Cache-Control: public, max-age=86400
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Dynamic Data (1h cache):**
```
Cache-Control: public, max-age=3600
Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT
```

**No Cache:**
```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

### Rate Limiting:
**Headers:**
```
X-RateLimit-Limit: 1000      // Requests per hour
X-RateLimit-Remaining: 999   // Remaining requests
X-RateLimit-Reset: 3600      // Reset time in seconds
```

**429 Too Many Requests Response:**
```json
{
  "success": false,
  "message": "Quá nhiều requests. Vui lòng thử lại sau.",
  "data": null,
  "errors": [
    {
      "code": "RATE_LIMIT_EXCEEDED",
      "message": "Đã vượt quá giới hạn 1000 requests/hour"
    }
  ]
}
```

### Documentation Standards:
**Swagger/OpenAPI Annotations:**
```csharp
[HttpGet]
[ProducesResponseType(typeof(ApiResponse<List<HotelDto>>), 200)]
[ProducesResponseType(typeof(ApiResponse), 400)]
[ProducesResponseType(typeof(ApiResponse), 401)]
public async Task<IActionResult> GetHotels([FromQuery] PaginationRequest request)
```

**Endpoint Documentation:**
- Summary: "Lấy danh sách khách sạn"
- Description: "API để lấy danh sách tất cả khách sạn với hỗ trợ phân trang và tìm kiếm"
- Parameters: Mô tả chi tiết từng parameter
- Responses: Examples cho mỗi status code
- Authentication: Bearer token required

### Request/Response Examples:
**Create Hotel Request:**
```json
POST /api/hotels
{
  "name": "Grand Hotel Saigon",
  "address": "123 Nguyen Hue, Q1, TP.HCM",
  "phone": "0283829292",
  "email": "info@grandhotel.com",
  "description": "Khách sạn 5 sao tại trung tâm TP.HCM"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Tạo khách sạn thành công",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Grand Hotel Saigon",
    "address": "123 Nguyen Hue, Q1, TP.HCM",
    "phone": "0283829292",
    "email": "info@grandhotel.com",
    "description": "Khách sạn 5 sao tại trung tâm TP.HCM",
    "createdAt": "2025-07-16T10:30:00Z",
    "updatedAt": "2025-07-16T10:30:00Z"
  },
  "errors": []
}
```

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

