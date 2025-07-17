'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function UserRoleDebug() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
        <strong>Debug:</strong> Not authenticated
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50 max-w-sm">
      <strong>Debug Info:</strong>
      <div className="mt-2 text-sm">
        <div><strong>Name:</strong> {user.fullName}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Role Name:</strong> {user.role.name}</div>
        <div><strong>Role Display:</strong> {user.role.displayName}</div>
        <div><strong>Role ID:</strong> {user.role.id || 'N/A'}</div>
        <div><strong>Permissions:</strong> {Object.keys(user.role.permissions).length} categories</div>
      </div>
    </div>
  );
}
