'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services';
import { STORAGE_KEYS } from '@/constants';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  googleLogin: (googleToken: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user từ localStorage khi component mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        
        console.log('🔍 Loading auth data:', { savedUser: !!savedUser, token: !!token });
        
        if (savedUser && token) {
          const user = JSON.parse(savedUser);
          console.log('✅ User loaded from localStorage:', user);
          setUser(user);
        } else {
          console.log('❌ No valid auth data found');
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      } finally {
        console.log('🏁 Auth loading completed');
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;
        
        // Lưu vào localStorage
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        
        setUser(userData);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Google Login function
  const googleLogin = useCallback(async (googleToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.googleLogin(googleToken);
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;
        
        // Lưu vào localStorage
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        
        setUser(userData);
      } else {
        throw new Error(response.message || 'Google login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Google login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: RegisterRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        if (response.data) {
          // Auto-login case: có tokens
          const { accessToken, refreshToken, user: newUser } = response.data;
          
          // Lưu vào localStorage
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
          
          setUser(newUser);
        } else {
          // Verification required case: không có tokens
          // User sẽ cần verify email trước khi login
        }
        
        return response; // Return response để component xử lý
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      setUser(null);
      
      // Redirect to login
      window.location.href = '/auth/login';
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
        setUser(response.data);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    googleLogin,
    register,
    logout,
    refreshUser,
    clearError,
  };
};
