'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts';

interface PermissionGuardProps {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
}

export default function PermissionGuard({ 
  children, 
  permission, 
  fallback = null 
}: PermissionGuardProps) {
  const { checkPermission, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return fallback;
  }

  if (!checkPermission(permission)) {
    return fallback;
  }

  return <>{children}</>;
}