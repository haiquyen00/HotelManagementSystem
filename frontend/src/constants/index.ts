// API URLs
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/Auth/login',
  REGISTER: '/Auth/register',
  LOGOUT: '/Auth/logout',

  REFRESH_TOKEN: '/Auth/refresh',
  PROFILE: '/Auth/profile',
  CHANGE_PASSWORD: '/Auth/change-password',
  FORGOT_PASSWORD: '/Auth/forgot-password',
  RESET_PASSWORD: '/Auth/reset-password',
  VERIFY_EMAIL: '/Auth/verify-email',

  // Users
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,

  // API Info
  API_INFO: '/api/info',

  // Thêm các endpoint khác tại đây...
} as const;

// App Constants
export const APP_CONFIG = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Hotel Management System',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  DEFAULT_PAGE_SIZE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;


// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
