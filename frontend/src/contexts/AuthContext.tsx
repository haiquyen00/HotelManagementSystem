'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService } from '@/services';
import { STORAGE_KEYS } from '@/constants';
import { User, LoginRequest, RegisterRequest, AuthResponse, AuthContextType, AuthState, Role } from '@/types';

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Helper function to parse permissions from role
  const parseRolePermissions = (roleData: any): Role => {
    let permissions: Record<string, string[]> = {};
    
    // Parse permissions from JSON string if it exists
    if (roleData.permissions) {
      try {
        permissions = typeof roleData.permissions === 'string' 
          ? JSON.parse(roleData.permissions) 
          : roleData.permissions;
      } catch (error) {
        console.warn('Failed to parse role permissions:', error);
        permissions = {};
      }
    }

    return {
      id: roleData.id || '',
      name: roleData.name || 'customer',
      displayName: roleData.displayName || 'Khách hàng',
      permissions,
    };
  };

  // Helper function to parse user data
  const parseUserData = (userData: any): User => {
    const role = parseRolePermissions(userData.role || {});
    
    return {
      id: userData.id,
      fullName: userData.fullName,
      email: userData.email,
      role,
      phone: userData.phone,
      avatarUrl: userData.avatarUrl,
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      emailVerifiedAt: userData.emailVerifiedAt,
      lastLoginAt: userData.lastLoginAt,
    };
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        console.log('🔍 Loading auth data:', { 
          savedUser: !!savedUser, 
          accessToken: !!accessToken,
          refreshToken: !!refreshToken 
        });
        
        if (savedUser && accessToken) {
          const userData = JSON.parse(savedUser);
          const user = parseUserData(userData);
          
          console.log('✅ User loaded from localStorage:', user);
          
          setState(prev => ({
            ...prev,
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          }));
        } else {
          console.log('❌ No valid auth data found');
          setState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    loadUser();
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;
        const user = parseUserData(userData);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        
        setState(prev => ({
          ...prev,
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        }));
        
        console.log('✅ Login successful:', user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage and state
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      console.log('✅ Logout successful');
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: RegisterRequest): Promise<AuthResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        if (response.data) {
          // Auto-login case: có tokens
          const { accessToken, refreshToken, user: newUserData } = response.data;
          const user = parseUserData(newUserData);
          
          // Save to localStorage
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUserData));
          
          setState(prev => ({
            ...prev,
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          }));
        } else {
          // Verification required case
          setState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
        
        return response;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        const user = parseUserData(response.data);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
        
        setState(prev => ({
          ...prev,
          user,
        }));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }, []);

  // Check if user has specific permission
  const checkPermission = useCallback((permission: string): boolean => {
    if (!state.user?.role?.permissions) return false;
    
    // Check if permission exists in any category
    for (const category of Object.keys(state.user.role.permissions)) {
      if (state.user.role.permissions[category].includes(permission)) {
        return true;
      }
    }
    
    return false;
  }, [state.user]);

  // Check if user has specific role
  const hasRole = useCallback((role: string): boolean => {
    return state.user?.role?.name === role;
  }, [state.user]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    refreshUser,
    checkPermission,
    hasRole,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export context for advanced usage
export default AuthContext;