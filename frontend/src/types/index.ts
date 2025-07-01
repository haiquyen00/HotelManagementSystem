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

// User Types
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UserProfile extends User {
  phone?: string;
  isActive: boolean;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
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
