'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

export default function RoleBasedRoute({ 
  children, 
  allowedRoles, 
  fallback = null, 
  redirectTo = '/auth/login' 
}: RoleBasedRouteProps) {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const router = useRouter();

  const hasAllowedRole = allowedRoles.some(role => hasRole(role));

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('🔒 Redirecting to login - user not authenticated');
        router.push(redirectTo);
      } else if (!hasAllowedRole) {
        console.log('🚫 Access denied - user role not allowed:', user?.role?.name);
        // Redirect based on user role
        if (hasRole('admin')) {
          router.push('/hotel/dashboard');
        } else if (hasRole('customer')) {
          router.push('/customer/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [isLoading, isAuthenticated, hasAllowedRole, router, redirectTo, hasRole, user]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show fallback if not authenticated or no allowed role
  if (!isAuthenticated || !hasAllowedRole) {
    return fallback;
  }

  return <>{children}</>;
}