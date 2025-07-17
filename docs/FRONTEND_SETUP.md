# 🎨 Frontend Setup

## 1. Navigate to Frontend
```bash
cd HotelManagementSystem/frontend
```

## 2. Cài đặt Dependencies
```bash
# Cài đặt packages
npm install

# Hoặc sử dụng yarn
yarn install
```

## 3. Cấu hình Environment

### Tạo file .env.local
```bash
NEXT_PUBLIC_API_URL=http://localhost:5186/api
NEXT_PUBLIC_APP_NAME="Hotel Management System"
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### Các biến môi trường khác (optional)
```bash
# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=your-ga-id

# Feature flags
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_BOOKING=true

# Debug mode
NEXT_PUBLIC_DEBUG_MODE=true
```

## 4. Chạy Frontend
```bash
# Development mode
npm run dev

# Hoặc với yarn
yarn dev
```

**Frontend sẽ chạy tại:** `http://localhost:3000`

## 5. Build Scripts khác
```bash
# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Type checking
npm run type-check
```

## 6. Kiểm tra Frontend
- Truy cập trang chủ: `http://localhost:3000`
- Test đăng nhập/đăng ký
- Xác minh kết nối với API