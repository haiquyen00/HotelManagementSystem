import api from '@/lib/axios';
import { Room, Amenity, HotelStats, PaginationParams, PaginatedResponse } from '@/types';

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

  // Amenities
  async getAmenities(params: PaginationParams): Promise<PaginatedResponse<Amenity>> {
    const response = await api.get<PaginatedResponse<Amenity>>('/hotel/amenities', { params });
    return response.data;
  },

  async createAmenity(amenityData: Partial<Amenity>): Promise<Amenity> {
    const response = await api.post<Amenity>('/hotel/amenities', amenityData);
    return response.data;
  },

  async updateAmenity(id: string, amenityData: Partial<Amenity>): Promise<Amenity> {
    const response = await api.put<Amenity>(`/hotel/amenities/${id}`, amenityData);
    return response.data;
  },

  async deleteAmenity(id: string): Promise<void> {
    await api.delete(`/hotel/amenities/${id}`);
  },
};
