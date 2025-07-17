import { useState, useEffect, useCallback } from 'react';
import { hotelService } from '@/services/api/hotelService';
import { Amenity } from '@/types/hotel';
import { useToast } from '@/hooks/useToast';

interface UseAmenitiesReturn {
  amenities: Amenity[];
  categories: string[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  refreshAmenities: () => Promise<void>;
  createAmenity: (data: {
    name: string;
    nameEn?: string;
    description: string;
    category: string;
    icon: string;
    isActive: boolean;
    sortOrder?: number;
  }) => Promise<Amenity | null>;
  updateAmenity: (id: string, data: {
    name: string;
    nameEn?: string;
    description: string;
    category: string;
    icon: string;
    isActive: boolean;
    sortOrder?: number;
  }) => Promise<Amenity | null>;
  deleteAmenity: (id: string) => Promise<boolean>;
  toggleAmenityStatus: (id: string, isActive: boolean) => Promise<boolean>;
  bulkDelete: (ids: string[]) => Promise<boolean>;
  bulkUpdateStatus: (ids: string[], isActive: boolean) => Promise<boolean>;
}

export const useAmenities = (): UseAmenitiesReturn => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { success, error: showError } = useToast();

  // Load amenities
  const loadAmenities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let data: Amenity[];
      
      if (searchTerm.trim()) {
        data = await hotelService.searchAmenities(searchTerm);
      } else {
        const params = selectedCategory ? { category: selectedCategory } : undefined;
        data = await hotelService.getAmenities(params);
      }
      
      setAmenities(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi tải danh sách tiện ích';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, showError]);

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const data = await hotelService.getAmenityCategories();
      setCategories(data);
    } catch (err) {
      console.error('Lỗi khi tải danh mục:', err);
    }
  }, []);

  // Refresh amenities
  const refreshAmenities = useCallback(async () => {
    await loadAmenities();
  }, [loadAmenities]);

  // Create amenity
  const createAmenity = useCallback(async (data: {
    name: string;
    nameEn?: string;
    description: string;
    category: string;
    icon: string;
    isActive: boolean;
    sortOrder?: number;
  }): Promise<Amenity | null> => {
    setIsCreating(true);
    try {
      const newAmenity = await hotelService.createAmenity(data);
      setAmenities(prev => [newAmenity, ...prev]);
      success('Tạo tiện ích thành công!');
      return newAmenity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi tạo tiện ích';
      showError(errorMessage);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [success, showError]);

  // Update amenity
  const updateAmenity = useCallback(async (id: string, data: {
    name: string;
    nameEn?: string;
    description: string;
    category: string;
    icon: string;
    isActive: boolean;
    sortOrder?: number;
  }): Promise<Amenity | null> => {
    setIsUpdating(true);
    try {
      const updatedAmenity = await hotelService.updateAmenity(id, data);
      setAmenities(prev => prev.map(item => 
        item.id === id ? updatedAmenity : item
      ));
      success('Cập nhật tiện ích thành công!');
      return updatedAmenity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi cập nhật tiện ích';
      showError(errorMessage);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [success, showError]);

  // Delete amenity
  const deleteAmenity = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      await hotelService.deleteAmenity(id);
      setAmenities(prev => prev.filter(item => item.id !== id));
      success('Xóa tiện ích thành công!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi xóa tiện ích';
      showError(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [success, showError]);

  // Toggle amenity status
  const toggleAmenityStatus = useCallback(async (id: string, isActive: boolean): Promise<boolean> => {
    try {
      const updatedAmenity = await hotelService.updateAmenityStatus(id, isActive);
      setAmenities(prev => prev.map(item => 
        item.id === id ? updatedAmenity : item
      ));
      success(`${isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} tiện ích thành công!`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi thay đổi trạng thái tiện ích';
      showError(errorMessage);
      return false;
    }
  }, [success, showError]);

  // Bulk delete
  const bulkDelete = useCallback(async (ids: string[]): Promise<boolean> => {
    setIsDeleting(true);
    try {
      await hotelService.bulkDeleteAmenities(ids);
      setAmenities(prev => prev.filter(item => !ids.includes(item.id)));
      success(`Xóa ${ids.length} tiện ích thành công!`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi xóa nhiều tiện ích';
      showError(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [success, showError]);

  // Bulk update status
  const bulkUpdateStatus = useCallback(async (ids: string[], isActive: boolean): Promise<boolean> => {
    try {
      await hotelService.bulkUpdateAmenityStatus(ids, isActive);
      setAmenities(prev => prev.map(item => 
        ids.includes(item.id) ? { ...item, isActive } : item
      ));
      success(`${isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} ${ids.length} tiện ích thành công!`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi khi thay đổi trạng thái nhiều tiện ích';
      showError(errorMessage);
      return false;
    }
  }, [success, showError]);

  // Effects
  useEffect(() => {
    loadAmenities();
  }, [loadAmenities]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    amenities,
    categories,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    refreshAmenities,
    createAmenity,
    updateAmenity,
    deleteAmenity,
    toggleAmenityStatus,
    bulkDelete,
    bulkUpdateStatus,
  };
};
