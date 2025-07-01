## Cấu trúc thư mục Frontend với Next.js + Tailwind

Dự án này được tổ chức với cấu trúc thư mục chuyên nghiệp để phát triển ứng dụng frontend và call API.

### 📁 Cấu trúc thư mục

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Tailwind CSS global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── login/            # Login page
│   └── about/            # About page
├── components/           # Tất cả React components
│   ├── ui/              # UI components tái sử dụng
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Loading.tsx
│   │   └── index.ts
│   ├── layout/          # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   └── index.ts
│   ├── forms/           # Form components
│   │   ├── LoginForm.tsx
│   │   └── index.ts
│   ├── common/          # Common components
│   └── index.ts
├── services/            # API services
│   ├── api/            # API endpoints
│   │   └── userService.ts
│   ├── auth/           # Authentication services
│   │   └── authService.ts
│   └── index.ts
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useApi.ts
│   └── index.ts
├── lib/                # Libraries & configurations
│   └── axios.ts        # Axios configuration
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── index.ts
├── constants/          # App constants & config
│   └── index.ts
├── store/              # State management (future)
└── styles/             # Additional styles (if needed)
```

### 🚀 Các tính năng đã cài đặt

- ✅ **Next.js 15** với App Router
- ✅ **TypeScript** support
- ✅ **Tailwind CSS v4** 
- ✅ **Axios** để call API
- ✅ **Custom Hooks** (useAuth, useApi)
- ✅ **UI Components** tái sử dụng
- ✅ **Form Components** với validation
- ✅ **Service Layer** để organize API calls
- ✅ **TypeScript Types** cho type safety
- ✅ **Utility Functions** 
- ✅ **Constants & Configuration**

### 📖 Hướng dẫn sử dụng

1. **Components**: Sử dụng các component từ `@/components`
2. **API Calls**: Sử dụng các service từ `@/services`
3. **Hooks**: Sử dụng custom hooks từ `@/hooks`
4. **Types**: Import types từ `@/types`
5. **Utils**: Sử dụng utility functions từ `@/utils`

### 🔧 Cách phát triển

1. **Thêm component mới**: Tạo trong thư mục `components/` tương ứng
2. **Thêm API service**: Tạo trong `services/api/`
3. **Thêm custom hook**: Tạo trong `hooks/`
4. **Thêm page mới**: Tạo trong `app/`

### 🌐 Environment Variables

Copy `.env.example` thành `.env.local` và điền các giá trị thực tế:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=NextJS App
```

### 📦 Package đã cài đặt

- `next` - React framework
- `react` & `react-dom` - React library  
- `typescript` - Type safety
- `tailwindcss` - CSS framework
- `axios` - HTTP client
- `eslint` - Code linting

Dự án đã sẵn sàng để phát triển! 🎉
