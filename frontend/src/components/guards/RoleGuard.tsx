'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleGuardProps) {
  const { hasRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return fallback;
  }

  const hasAllowedRole = allowedRoles.some(role => hasRole(role));

  if (!hasAllowedRole) {
    return fallback;
  }

  return <>{children}</>;
}