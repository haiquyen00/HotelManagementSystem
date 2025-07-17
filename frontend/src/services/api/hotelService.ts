import api from '@/lib/axios';
import { Room, Amenity, HotelStats, PaginationParams, PaginatedResponse } from '@/types';

// API Response types để map với backend .NET
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any[];
}

interface AmenitySearchParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  category?: string;
  isActive?: boolean;
}

interface CreateAmenityRequest {
  name: string;
  nameEn?: string;
  description: string;
  category: string;
  icon: string;
  isActive: boolean;
  sortOrder?: number;
}

interface UpdateAmenityRequest {
  name: string;
  nameEn?: string;
  description: string;
  category: string;
  icon: string;
  isActive: boolean;
  sortOrder?: number;
}

export const hotelService = {
  // Stats
  async getHotelStats(): Promise<HotelStats> {
    const response = await api.get<HotelStats>('/hotel/stats');
    return response.data;
  },

  // Rooms
  async getRooms(params: PaginationParams): Promise<PaginatedResponse<Room>> {
    const response = await api.get<PaginatedResponse<Room>>('/hotel/rooms', { params });
    return response.data;
  },

  async getRoomById(id: string): Promise<Room> {
    const response = await api.get<Room>(`/hotel/rooms/${id}`);
    return response.data;
  },

  async createRoom(roomData: Partial<Room>): Promise<Room> {
    const response = await api.post<Room>('/hotel/rooms', roomData);
    return response.data;
  },

  async updateRoom(id: string, roomData: Partial<Room>): Promise<Room> {
    const response = await api.put<Room>(`/hotel/rooms/${id}`, roomData);
    return response.data;
  },

  async deleteRoom(id: string): Promise<void> {
    await api.delete(`/hotel/rooms/${id}`);
  },

  // Amenities - Updated to match .NET API
  async getAmenities(params?: AmenitySearchParams): Promise<Amenity[]> {
    // Nếu có category, sử dụng endpoint riêng
    if (params?.category) {
      const response = await api.get<ApiResponse<Amenity[]>>(`/amenities/category/${encodeURIComponent(params.category)}`);
      console.log('API Response for getAmenitiesByCategory:', response.data); // Debug log
      return response.data.data;
    }
    
    // Nếu không có category, lấy tất cả
    const response = await api.get<ApiResponse<Amenity[]>>('/amenities');
    console.log('API Response for getAmenities:', response.data); // Debug log
    return response.data.data;
  },

  async getAmenitiesWithPaging(params: AmenitySearchParams): Promise<PaginatedResponse<Amenity>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Amenity>>>('/amenities/paged', { params });
    return response.data.data;
  },

  async getAmenityById(id: string): Promise<Amenity> {
    const response = await api.get<ApiResponse<Amenity>>(`/amenities/${id}`);
    return response.data.data;
  },

  async getActiveAmenities(): Promise<Amenity[]> {
    const response = await api.get<ApiResponse<Amenity[]>>('/amenities/active');
    return response.data.data;
  },

  async getAmenityCategories(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/amenities/categories');
    return response.data.data;
  },

  async searchAmenities(searchTerm: string): Promise<Amenity[]> {
    const response = await api.get<ApiResponse<Amenity[]>>(`/amenities/search?searchTerm=${encodeURIComponent(searchTerm)}`);
    return response.data.data;
  },

  async createAmenity(amenityData: CreateAmenityRequest): Promise<Amenity> {
    const response = await api.post<ApiResponse<Amenity>>('/amenities', amenityData);
    return response.data.data;
  },

  async updateAmenity(id: string, amenityData: UpdateAmenityRequest): Promise<Amenity> {
    const response = await api.put<ApiResponse<Amenity>>(`/amenities/${id}`, amenityData);
    return response.data.data;
  },

  async deleteAmenity(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/amenities/${id}`);
  },

  async updateAmenityStatus(id: string, isActive: boolean): Promise<Amenity> {
    const response = await api.patch<ApiResponse<Amenity>>(`/amenities/${id}/toggle-status`, { isActive });
    return response.data.data;
  },

  async updateAmenitySortOrder(amenities: { id: string; sortOrder: number }[]): Promise<void> {
    await api.put<ApiResponse<void>>('/amenities/sort-order', { amenities });
  },

  async bulkDeleteAmenities(ids: string[]): Promise<void> {
    await api.delete<ApiResponse<void>>('/amenities/bulk', { 
      data: ids,
      headers: { 'Content-Type': 'application/json' }
    });
  },

  async bulkUpdateAmenityStatus(ids: string[], isActive: boolean): Promise<void> {
    await api.patch<ApiResponse<void>>('/amenities/bulk/toggle-status', { ids, isActive });
  }
};
