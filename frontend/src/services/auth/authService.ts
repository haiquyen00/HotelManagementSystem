import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { 
  User, 
  UserProfile,
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  ChangePasswordRequest,
  UpdateProfileRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ApiResponse
} from '@/types';

export const authService = {
  // Đăng nhập
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  // Đăng ký
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  // Đăng xuất
  async logout(): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(API_ENDPOINTS.LOGOUT);
    return response.data;
  },

  // Lấy profile user
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await api.get<ApiResponse<UserProfile>>(API_ENDPOINTS.PROFILE);
    return response.data;
  },

  // Cập nhật profile
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse> {
    const response = await api.put<ApiResponse>(API_ENDPOINTS.PROFILE, data);
    return response.data;
  },

  // Đổi mật khẩu
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(API_ENDPOINTS.CHANGE_PASSWORD, data);
    return response.data;
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });
    return response.data;
  },

  // Quên mật khẩu
  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(API_ENDPOINTS.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  },

  // Reset mật khẩu
  async resetPassword(data: {
    email: string;
    token: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(API_ENDPOINTS.RESET_PASSWORD, data);
    return response.data;
  },

  // Xác thực email
  async verifyEmail(data: {
    email: string;
    token: string;
  }): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(API_ENDPOINTS.VERIFY_EMAIL, data);
    return response.data;
  },
};
