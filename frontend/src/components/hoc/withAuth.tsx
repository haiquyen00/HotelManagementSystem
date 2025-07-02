'use client';

import React, { ComponentType } from 'react';
import { useAuth } from '@/contexts';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface WithAuthOptions {
  redirectTo?: string;
  allowedRoles?: string[];
  permissions?: string[];
}

function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    redirectTo = '/auth/login',
    allowedRoles = [],
    permissions = [],
  } = options;

  const AuthenticatedComponent = (props: P) => {
    const { isAuthenticated, isLoading, user, hasRole, checkPermission } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.push(redirectTo);
          return;
        }

        // Check role requirements
        if (allowedRoles.length > 0) {
          const hasAllowedRole = allowedRoles.some(role => hasRole(role));
          if (!hasAllowedRole) {
            // Redirect based on user role
            if (hasRole('admin')) {
              router.push('/hotel/dashboard');
            } else if (hasRole('customer')) {
              router.push('/customer/dashboard');
            } else {
              router.push('/dashboard');
            }
            return;
          }
        }

        // Check permission requirements
        if (permissions.length > 0) {
          const hasAllPermissions = permissions.every(permission => checkPermission(permission));
          if (!hasAllPermissions) {
            router.push('/unauthorized');
            return;
          }
        }
      }
    }, [isLoading, isAuthenticated, user, router, hasRole, checkPermission]);

    // Show loading state
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    // Don't render if not authenticated or doesn't have required roles/permissions
    if (!isAuthenticated) {
      return null;
    }

    if (allowedRoles.length > 0) {
      const hasAllowedRole = allowedRoles.some(role => hasRole(role));
      if (!hasAllowedRole) {
        return null;
      }
    }

    if (permissions.length > 0) {
      const hasAllPermissions = permissions.every(permission => checkPermission(permission));
      if (!hasAllPermissions) {
        return null;
      }
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
}

export default withAuth;