// Permission constants and utilities
export const PERMISSIONS = {
  // User management
  USER_VIEW: 'user.view',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  
  // Hotel management
  HOTEL_VIEW: 'hotel.view',
  HOTEL_CREATE: 'hotel.create',
  HOTEL_UPDATE: 'hotel.update',
  HOTEL_DELETE: 'hotel.delete',
  
  // Room management
  ROOM_VIEW: 'room.view',
  ROOM_CREATE: 'room.create',
  ROOM_UPDATE: 'room.update',
  ROOM_DELETE: 'room.delete',
  
  // Booking management
  BOOKING_VIEW: 'booking.view',
  BOOKING_CREATE: 'booking.create',
  BOOKING_UPDATE: 'booking.update',
  BOOKING_DELETE: 'booking.delete',
  
  // Customer actions
  CUSTOMER_BOOKING: 'customer.booking',
  CUSTOMER_VIEW_OWN: 'customer.view_own',
  CUSTOMER_UPDATE_OWN: 'customer.update_own',
} as const;

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  MANAGER: 'manager',
} as const;

// Default permissions for roles
export const DEFAULT_ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    users: [PERMISSIONS.USER_VIEW, PERMISSIONS.USER_CREATE, PERMISSIONS.USER_UPDATE, PERMISSIONS.USER_DELETE],
    hotels: [PERMISSIONS.HOTEL_VIEW, PERMISSIONS.HOTEL_CREATE, PERMISSIONS.HOTEL_UPDATE, PERMISSIONS.HOTEL_DELETE],
    rooms: [PERMISSIONS.ROOM_VIEW, PERMISSIONS.ROOM_CREATE, PERMISSIONS.ROOM_UPDATE, PERMISSIONS.ROOM_DELETE],
    bookings: [PERMISSIONS.BOOKING_VIEW, PERMISSIONS.BOOKING_CREATE, PERMISSIONS.BOOKING_UPDATE, PERMISSIONS.BOOKING_DELETE],
  },
  [ROLES.CUSTOMER]: {
    bookings: [PERMISSIONS.CUSTOMER_BOOKING, PERMISSIONS.CUSTOMER_VIEW_OWN],
    profile: [PERMISSIONS.CUSTOMER_UPDATE_OWN],
  },
  [ROLES.MANAGER]: {
    hotels: [PERMISSIONS.HOTEL_VIEW, PERMISSIONS.HOTEL_UPDATE],
    rooms: [PERMISSIONS.ROOM_VIEW, PERMISSIONS.ROOM_CREATE, PERMISSIONS.ROOM_UPDATE],
    bookings: [PERMISSIONS.BOOKING_VIEW, PERMISSIONS.BOOKING_UPDATE],
  },
} as const;

// Utility functions
export const hasPermission = (userPermissions: Record<string, string[]>, permission: string): boolean => {
  for (const category of Object.keys(userPermissions)) {
    if (userPermissions[category].includes(permission)) {
      return true;
    }
  }
  return false;
};

export const hasAnyPermission = (userPermissions: Record<string, string[]>, permissions: string[]): boolean => {
  return permissions.some(permission => hasPermission(userPermissions, permission));
};

export const hasAllPermissions = (userPermissions: Record<string, string[]>, permissions: string[]): boolean => {
  return permissions.every(permission => hasPermission(userPermissions, permission));
};

export const getRoleDisplayName = (roleName: string): string => {
  const displayNames: Record<string, string> = {
    [ROLES.ADMIN]: 'Quản trị viên',
    [ROLES.CUSTOMER]: 'Khách hàng',
    [ROLES.MANAGER]: 'Quản lý',
  };
  
  return displayNames[roleName] || roleName;
};