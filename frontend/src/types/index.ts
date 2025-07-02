// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ErrorDetail[];
}

export interface ErrorDetail {
  code: string;
  message: string;
  field?: string;
  value?: any;
}

// Role and Permission Types
export interface Role {
  id: string;
  name: string; // admin, customer, manager
  displayName: string; // "Quản trị viên", "Khách hàng"
  permissions: Record<string, string[]>; // Parsed from JSON
}

// User Types
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
}

export interface UserProfile extends User {
  phone?: string;
  isActive: boolean;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth State Types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  refreshUser: () => Promise<void>;
  checkPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  clearError: () => void;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface GoogleLoginRequest {
  googleToken: string;
}

export interface AuthDataResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresAt: string;
  user: User;
}

export interface AuthResponse extends ApiResponse<AuthDataResponse> {}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  token: string;
}


// Form Types
export interface FormError {
  field: string;
  message: string;
}

// Common Types
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Hotel Types
export * from './hotel';
