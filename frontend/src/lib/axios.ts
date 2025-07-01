import axios from 'axios';
import { STORAGE_KEYS } from '@/constants';

// Tạo instance axios với cấu hình cơ bản
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7231/api'|| 'https://localhost:5186/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm token vào header
api.interceptors.request.use(
  (config) => {
    // Chỉ lấy token khi đang ở client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi và auto refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Thử refresh token
      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          try {
            const response = await axios.post(`${api.defaults.baseURL}/Auth/refresh`, {
              refreshToken,
            });

            if (response.data.success) {
              const { accessToken, refreshToken: newRefreshToken } = response.data.data;
              
              // Lưu token mới
              localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
              localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
              
              // Retry request với token mới
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh token cũng hết hạn, redirect về login
            console.error('Refresh token failed:', refreshError);
          }
        }

        // Clear tokens và redirect
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Redirect tới login page
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
