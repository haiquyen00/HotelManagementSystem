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
- Tạo service layer riêng biệt (`hotelService.ts`)
- Sử dụng custom hooks cho API calls (`useAmenities.ts`)
- Proper error handling với toast notifications
- Loading states cho tất cả async operations
- Standardized API response handling với `ApiResponse<T>`
- Bulk operations support (create, update, delete)

### Component Patterns:
- Modal với glass morphism effects
- IconPicker với categorized selection
- ConfirmDialog cho destructive actions
- Reusable UI components trong `src/components/ui/`
- Custom hooks cho business logic

### State Management:
- Local state với useState/useCallback
- Custom hooks cho complex logic
- Optimistic updates với proper error handling
- Loading states per operation type

### Performance:
- Lazy loading cho heavy components
- Memoization cho expensive calculations
- Optimize images với Next.js Image component
- Debounced search implementation

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

## 🚀 VIII. DEVELOPMENT WORKFLOW

### Module Development Process:
1. **Planning & Analysis**
   - Xác định requirements và scope
   - Thiết kế database schema (entities, relationships)
   - Define API endpoints với authorization
   - Plan frontend UI/UX components

2. **Backend First Approach**
   - Tạo Entity models và DbContext configuration
   - Implement Repository interfaces và implementations
   - Develop Service layer với business logic
   - Create Controller với proper authorization
   - Add Swagger documentation
   - Write unit tests cho core functionality

3. **Frontend Development**
   - Create TypeScript types matching backend DTOs
   - Implement API service layer
   - Develop custom hooks cho state management
   - Build reusable UI components
   - Create main page với full functionality
   - Add error handling và loading states

4. **Integration & Testing**
   - Test API endpoints với Postman/Swagger
   - Verify frontend-backend integration
   - Test user permissions và authorization
   - Performance testing với large datasets
   - UI responsiveness testing

5. **Documentation & Deployment**
   - Update API documentation
   - Write component documentation
   - Update Custom Instructions với new patterns
   - Git commit với descriptive messages
   - Deployment preparation

### Code Quality Standards:
**Backend:**
```csharp
// ✅ DO: Consistent naming và structure
public class AmenityService : IAmenityService
{
    private readonly IAmenityRepository _repository;
    private readonly ILogger<AmenityService> _logger;
    
    // ✅ Proper error handling
    public async Task<ServiceResult<T>> MethodAsync(Request request)
    {
        try
        {
            // Validation first
            if (await _repository.ExistsAsync(request.Name))
                return ServiceResult<T>.ErrorResult("Already exists");
                
            // Business logic
            var entity = MapRequestToEntity(request);
            
            // Repository call
            var result = await _repository.CreateAsync(entity);
            
            return ServiceResult<T>.SuccessResult(MapEntityToDto(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in {Method}", nameof(MethodAsync));
            return ServiceResult<T>.ErrorResult("System error");
        }
    }
}
```

**Frontend:**
```typescript
// ✅ DO: Consistent hook pattern
export const useResource = () => {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await service.getData();
            setData(result);
        } catch (err) {
            setError(err.message);
            showToast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    return { data, isLoading, error, loadData, createItem, updateItem, deleteItem };
};
```

### Testing Strategy:
**Backend Unit Tests:**
```csharp
[Test]
public async Task CreateAmenity_WithValidData_ShouldReturnSuccess()
{
    // Arrange
    var request = new CreateAmenityRequest { Name = "Test Amenity" };
    
    // Act
    var result = await _service.CreateAsync(request);
    
    // Assert
    Assert.IsTrue(result.Success);
    Assert.IsNotNull(result.Data);
}
```

**Frontend Component Tests:**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

test('should create amenity when form is submitted', async () => {
    render(<AmenityForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Tên tiện ích'), {
        target: { value: 'Test Amenity' }
    });
    
    fireEvent.click(screen.getByText('Tạo mới'));
    
    await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
            name: 'Test Amenity'
        });
    });
});
```

### Performance Guidelines:
**Database:**
- Sử dụng pagination cho large datasets
- Add indexes cho frequently queried fields
- Use projection cho DTOs (select specific fields)
- Implement caching cho static data

**Frontend:**
- Lazy load components với React.lazy()
- Debounce search inputs
- Memoize expensive calculations
- Virtual scrolling cho large lists

### Security Checklist:
- ✅ Authorization policies properly configured
- ✅ Input validation on both frontend and backend
- ✅ SQL injection prevention với Entity Framework
- ✅ XSS prevention với proper sanitization
- ✅ CSRF protection với proper headers
- ✅ Secure token storage và transmission

## 🎯 VII. PROVEN PATTERNS (từ Amenities Management)

### Backend Architecture Patterns:
**Controller Design:**
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize] // Base authentication required
public class AmenitiesController : ControllerBase
{
    // Public endpoints: [AllowAnonymous]
    // Staff+ endpoints: [Authorize(Policy = "StaffOrAbove")]  
    // Manager+ endpoints: [Authorize(Policy = "ManagerOrAbove")]
    
    // Standardized response format
    return Ok(new ApiResponse<T> { Success = true, Data = result });
}
```

**Service Layer Pattern:**
```csharp
public interface IAmenityService
{
    Task<ServiceResult<T>> MethodAsync(params);
}

public class AmenityService : IAmenityService
{
    // Validation -> Business Logic -> Repository Call -> Response
    public async Task<ServiceResult<AmenityDto>> CreateAsync(CreateAmenityRequest request)
    {
        // 1. Validation
        if (await _repository.NameExistsAsync(request.Name))
            return ServiceResult<AmenityDto>.ErrorResult("Tên đã tồn tại");
            
        // 2. Business Logic
        var entity = MapToEntity(request);
        
        // 3. Repository Call
        var result = await _repository.CreateAsync(entity);
        
        // 4. Return Success/Error
        return ServiceResult<AmenityDto>.SuccessResult(MapToDto(result));
    }
}
```

**Repository Pattern:**
```csharp
public interface IAmenityRepository : IBaseRepository<Amenity>
{
    Task<(IEnumerable<Amenity> items, int totalCount)> GetPagedAsync(params);
    Task<bool> NameExistsAsync(string name, Guid? excludeId = null);
    Task<IEnumerable<Amenity>> SearchAsync(string searchTerm);
}
```

### Frontend Architecture Patterns:
**Custom Hook Pattern:**
```typescript
export const useAmenities = () => {
    const [state, setState] = useState<State>();
    const [isLoading, setIsLoading] = useState(false);
    
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await hotelService.getAmenities();
            setState(data);
        } catch (error) {
            showError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [dependencies]);
    
    return { data: state, isLoading, loadData, createItem, updateItem, deleteItem };
};
```

**Service Layer Pattern:**
```typescript
export const hotelService = {
    async getAmenities(params?: SearchParams): Promise<Amenity[]> {
        const response = await api.get<ApiResponse<Amenity[]>>('/amenities', { params });
        return response.data.data; // Extract data from ApiResponse
    },
    
    async createAmenity(data: CreateRequest): Promise<Amenity> {
        const response = await api.post<ApiResponse<Amenity>>('/amenities', data);
        return response.data.data;
    }
};
```

**Component Composition Pattern:**
```tsx
const ManagementPage = () => {
    const { 
        items, isLoading, createItem, updateItem, deleteItem, bulkDelete 
    } = useAmenities();
    
    return (
        <div className="space-y-6">
            <SearchAndFilter onSearch={handleSearch} onFilter={handleFilter} />
            <BulkActions selectedIds={selectedIds} onBulkDelete={bulkDelete} />
            <DataGrid 
                data={items} 
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <ItemForm onSubmit={isEditing ? updateItem : createItem} />
            </Modal>
        </div>
    );
};
```

### UI/UX Patterns:
**Glass Morphism Modal:**
```css
.modal-backdrop {
    background: rgba(59, 130, 246, 0.1);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.modal-content {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

**Icon Picker Component:**
```tsx
const IconPicker = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    const filteredIcons = ICONS.filter(icon => 
        selectedCategory === 'All' || icon.category === selectedCategory
    );
    
    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)}>
                {selectedIcon ? selectedIcon.emoji : 'Chọn icon'}
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full">
                    <CategoryFilter />
                    <IconGrid icons={filteredIcons} onSelect={onChange} />
                </div>
            )}
        </div>
    );
};
```

### Error Handling Patterns:
**Backend:**
```csharp
try
{
    var result = await _service.ProcessAsync(request);
    return result.Success 
        ? Ok(ApiResponse<T>.SuccessResult(result.Data, result.Message))
        : BadRequest(ApiResponse<T>.ErrorResult(result.Message, result.Errors));
}
catch (ValidationException ex)
{
    return BadRequest(ApiResponse<T>.ValidationErrorResult(ex.Errors));
}
catch (NotFoundException ex)
{
    return NotFound(ApiResponse<T>.ErrorResult(ex.Message));
}
catch (Exception ex)
{
    _logger.LogError(ex, "Unexpected error in {Method}", nameof(MethodName));
    return StatusCode(500, ApiResponse<T>.ErrorResultWithCode(ErrorCodes.SRV_INTERNAL_ERROR));
}
```

**Frontend:**
```typescript
const handleOperation = async () => {
    setIsLoading(true);
    try {
        await operationCall();
        success('Thao tác thành công!');
        await refreshData(); // Refresh UI
    } catch (error) {
        if (error.response?.status === 400) {
            showError('Dữ liệu không hợp lệ');
        } else if (error.response?.status === 403) {
            showError('Bạn không có quyền thực hiện thao tác này');
        } else {
            showError('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    } finally {
        setIsLoading(false);
    }
};
```

### Bulk Operations Pattern:
**API Design:**
```csharp
[HttpDelete("bulk")]
[Authorize(Policy = "ManagerOrAbove")]
public async Task<ActionResult<ApiResponse<bool>>> BulkDelete([FromBody] List<Guid> ids)
{
    var result = await _service.BulkDeleteAsync(ids);
    return result.Success ? Ok(result) : BadRequest(result);
}
```

**Frontend Implementation:**
```tsx
const BulkActions = ({ selectedIds, onBulkDelete }) => {
    const handleBulkDelete = async () => {
        const confirmed = await showConfirmDialog({
            title: 'Xóa nhiều tiện ích',
            message: `Bạn có chắc muốn xóa ${selectedIds.length} tiện ích?`
        });
        
        if (confirmed) {
            await onBulkDelete(selectedIds);
        }
    };
    
    return (
        <div className="flex space-x-2">
            <button onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
                Xóa đã chọn ({selectedIds.length})
            </button>
        </div>
    );
};
```

## 🗺️ IX. MODULE DEVELOPMENT ROADMAP

### Completed Modules:
✅ **Amenities Management** (Production Ready)
- Full CRUD với role-based permissions
- Bulk operations với confirmation dialogs
- Visual icon picker với categorized selection
- Real-time search và filtering
- Glass morphism UI với responsive design
- Comprehensive API với 14 endpoints
- Complete documentation và testing

### Next Priority Modules:

#### 🏨 **1. Room Types Management** (Recommended Next)
**Why this module:** Foundation cho booking system
**Key Features:**
- CRUD operations cho room types
- Image upload và gallery management
- Pricing configuration per room type
- Amenities assignment to room types
- Availability và capacity management
- Seasonal pricing rules

**Technical Implementation:**
- Follow Amenities pattern: Controller → Service → Repository
- Image upload service với file validation
- Many-to-many relationship với Amenities
- Pricing calculation logic
- Status management (Available/Maintenance/Discontinued)

#### 🏪 **2. Rooms Management**
**Dependencies:** Room Types module
**Key Features:**
- Individual room assignment to types
- Room status tracking (Available/Occupied/Cleaning/Maintenance)
- Room numbering system
- Maintenance scheduling
- Guest check-in/check-out tracking

#### 📅 **3. Booking System**
**Dependencies:** Room Types + Rooms modules
**Key Features:**
- Availability calendar
- Reservation creation và management
- Check-in/check-out process
- Payment integration
- Booking modifications và cancellations
- Guest communication

#### 👥 **4. Customer Management**
**Key Features:**
- Customer profiles và history
- Loyalty program integration
- Booking history
- Preferences tracking
- Communication log

#### 📊 **5. Dashboard & Analytics**
**Dependencies:** All previous modules
**Key Features:**
- Revenue analytics
- Occupancy rates
- Performance metrics
- Booking trends
- Customer insights

### Development Patterns to Reuse:
1. **Backend Architecture:**
   - Clean Architecture với Service/Repository patterns
   - ServiceResult<T> cho consistent responses
   - Authorization policies
   - Swagger documentation
   - Bulk operations support

2. **Frontend Architecture:**
   - Custom hooks pattern (useRoomTypes, useBookings, etc.)
   - Reusable UI components
   - Modal forms với validation
   - Search và filter capabilities
   - Loading states và error handling

3. **Database Design:**
   - Base entity pattern
   - Proper relationships với foreign keys
   - Enum conversions
   - Audit trail (CreatedAt, UpdatedAt)

### Technical Debt & Improvements:
- [ ] Implement unit testing suite
- [ ] Add integration tests
- [ ] Performance optimization cho large datasets
- [ ] Caching layer implementation
- [ ] Real-time notifications với SignalR
- [ ] Mobile responsive improvements
- [ ] Accessibility (WCAG) compliance
- [ ] Internationalization (i18n) support

### Module Estimation:
- **Room Types Management:** 2-3 days
- **Rooms Management:** 2-3 days  
- **Booking System:** 5-7 days
- **Customer Management:** 3-4 days
- **Dashboard & Analytics:** 4-5 days

**Total Project Completion:** ~3-4 weeks với current patterns

