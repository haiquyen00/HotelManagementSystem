// Test passwords để dễ nhớ
export const TEST_PASSWORDS = {
  ADMIN: 'Admin123!',
  USER: 'User123!', 
  MANAGER: 'Manager123!',
  NEW_PASSWORD: 'NewPass123!',
  BACKUP_PASSWORD: 'Backup123!',
} as const;

// Test users
export const TEST_USERS = {
  ADMIN: {
    email: 'admin@example.com',
    password: TEST_PASSWORDS.ADMIN,
  },
  USER: {
    email: 'user@example.com', 
    password: TEST_PASSWORDS.USER,
  },
  MANAGER: {
    email: 'manager@example.com',
    password: TEST_PASSWORDS.MANAGER,
  },
} as const;

// Common test data
export const TEST_DATA = {
  PASSWORDS: TEST_PASSWORDS,
  USERS: TEST_USERS,
} as const;
