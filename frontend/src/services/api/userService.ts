import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { User, PaginationParams, PaginatedResponse } from '@/types';

export const userService = {
  // Lấy danh sách users
  async getUsers(params: PaginationParams): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS, {
      params,
    });
    return response.data;
  },

  // Lấy user theo ID
  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(API_ENDPOINTS.USER_BY_ID(id));
    return response.data;
  },

  // Tạo user mới
  async createUser(userData: Partial<User>): Promise<User> {
    const response = await api.post<User>(API_ENDPOINTS.USERS, userData);
    return response.data;
  },

  // Cập nhật user
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.put<User>(API_ENDPOINTS.USER_BY_ID(id), userData);
    return response.data;
  },

  // Xóa user
  async deleteUser(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.USER_BY_ID(id));
  },
};
