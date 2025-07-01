import { STORAGE_KEYS } from '@/constants';

export class TokenManager {
  private static instance: TokenManager;
  private refreshTokenPromise: Promise<string> | null = null;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  // Get access token from localStorage
  public getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  // Get refresh token from localStorage
  public getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Set tokens in localStorage
  public setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  // Clear all tokens
  public clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Check if access token is expired
  public isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  // Check if access token will expire soon (within 5 minutes)
  public isAccessTokenExpiringSoon(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const fiveMinutes = 5 * 60; // 5 minutes in seconds
      return payload.exp < (currentTime + fiveMinutes);
    } catch {
      return true;
    }
  }

  // Get user info from access token
  public getUserFromToken(): any | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        fullName: payload.fullName,
        role: payload.role,
      };
    } catch {
      return null;
    }
  }

  // Refresh access token (to be called by auth service)
  public async refreshAccessToken(refreshTokenFn: (token: string) => Promise<{ accessToken: string; refreshToken: string }>): Promise<string | null> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    this.refreshTokenPromise = (async () => {
      try {
        const response = await refreshTokenFn(refreshToken);
        this.setTokens(response.accessToken, response.refreshToken);
        return response.accessToken;
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.clearTokens();
        throw error;
      } finally {
        this.refreshTokenPromise = null;
      }
    })();

    return this.refreshTokenPromise;
  }

  // Schedule automatic token refresh
  public scheduleTokenRefresh(refreshTokenFn: (token: string) => Promise<{ accessToken: string; refreshToken: string }>): void {
    const checkAndRefresh = () => {
      if (this.isAccessTokenExpiringSoon()) {
        this.refreshAccessToken(refreshTokenFn).catch(() => {
          // Token refresh failed, user will be logged out
          this.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        });
      }
    };

    // Check every minute
    setInterval(checkAndRefresh, 60 * 1000);
    
    // Also check immediately
    checkAndRefresh();
  }
}