'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService } from '@/services';
import { STORAGE_KEYS } from '@/constants';
import { User, LoginRequest, RegisterRequest, AuthResponse, AuthContextType, AuthState, Role } from '@/types';
import { TokenManager } from '@/utils/tokenManager';

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

  const tokenManager = TokenManager.getInstance();

  // Helper function to parse permissions from role
  const parseRolePermissions = useCallback((roleData: unknown): Role => {
    let permissions: Record<string, string[]> = {};
    
    // Parse permissions from JSON string if it exists
    if (roleData && typeof roleData === 'object' && 'permissions' in roleData) {
      const data = roleData as { permissions?: string | Record<string, string[]>; id?: string; name?: string; displayName?: string };
      if (data.permissions) {
        try {
          permissions = typeof data.permissions === 'string' 
            ? JSON.parse(data.permissions) 
            : data.permissions;
        } catch (error) {
          console.warn('Failed to parse role permissions:', error);
          permissions = {};
        }
      }

      return {
        id: data.id || '',
        name: data.name || 'customer',
        displayName: data.displayName || 'Khách hàng',
        permissions,
      };
    }

    return {
      id: '',
      name: 'customer',
      displayName: 'Khách hàng',
      permissions: {},
    };
  }, []);

  // Helper function to parse user data
  const parseUserData = useCallback((userData: unknown): User => {
    if (!userData || typeof userData !== 'object') {
      throw new Error('Invalid user data');
    }

    const data = userData as {
      id?: string;
      fullName?: string;
      email?: string;
      role?: unknown;
      phone?: string;
      avatarUrl?: string;
      isActive?: boolean;
      emailVerifiedAt?: string;
      lastLoginAt?: string;
    };
    
    const role = parseRolePermissions(data.role || {});
    
    return {
      id: data.id || '',
      fullName: data.fullName || '',
      email: data.email || '',
      role,
      phone: data.phone,
      avatarUrl: data.avatarUrl,
      isActive: data.isActive !== undefined ? data.isActive : true,
      emailVerifiedAt: data.emailVerifiedAt,
      lastLoginAt: data.lastLoginAt,
    };
  }, [parseRolePermissions]);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const accessToken = tokenManager.getAccessToken();
        const refreshToken = tokenManager.getRefreshToken();
        
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
        tokenManager.clearTokens();
        
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    loadUser();
  }, [parseUserData]);

  // Setup auto-refresh token when user is authenticated
  useEffect(() => {
    if (state.isAuthenticated && state.refreshToken) {
      const refreshTokenFn = async (token: string) => {
        const response = await authService.refreshToken(token);
        if (response.success && response.data) {
          return {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          };
        }
        throw new Error('Token refresh failed');
      };

      tokenManager.scheduleTokenRefresh(refreshTokenFn);
    }
  }, [state.isAuthenticated, state.refreshToken, tokenManager]);

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
        tokenManager.setTokens(accessToken, refreshToken);
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error && 'response' in error && typeof error.response === 'object' && error.response && 'data' in error.response && typeof error.response.data === 'object' && error.response.data && 'message' in error.response.data
          ? String(error.response.data.message)
          : 'Login failed';
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
      tokenManager.clearTokens();
      
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
          tokenManager.setTokens(accessToken, refreshToken);
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error && 'response' in error && typeof error.response === 'object' && error.response && 'data' in error.response && typeof error.response.data === 'object' && error.response.data && 'message' in error.response.data
          ? String(error.response.data.message)
          : 'Registration failed';
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