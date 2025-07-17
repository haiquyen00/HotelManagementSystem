'use client';

import { useState, useEffect } from 'react';
import { HotelLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { IconPicker } from '@/components/ui/IconPicker';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/hooks/useToast';
import { useAmenities } from '@/hooks/useAmenities';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { 
  CogIcon, 
  EditIcon, 
  TimesIcon,
  TagIcon
} from '@/components/icons/HotelIcons';
import type { Amenity } from '@/types/hotel';

export default function AmenitiesPage() {
  const {
    amenities,
    categories,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    createAmenity,
    updateAmenity,
    deleteAmenity,
    toggleAmenityStatus,
    bulkDelete,
    bulkUpdateStatus,
    refreshAmenities
  } = useAmenities();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; amenity: Amenity | null }>({
    isOpen: false,
    amenity: null
  });
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState<{ isOpen: boolean; count: number }>({
    isOpen: false,
    count: 0
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const { success, error, warning } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    category: '',
    icon: '',
    isActive: true,
    sortOrder: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      error('Tên tiện ích không được để trống');
      return;
    }
    if (!formData.category.trim()) {
      error('Danh mục không được để trống');
      return;
    }
    if (!formData.icon.trim()) {
      error('Icon không được để trống');
      return;
    }

    try {
      if (editingAmenity) {
        // Update existing amenity
        const result = await updateAmenity(editingAmenity.id, formData);
        if (result) {
          resetForm();
        }
      } else {
        // Create new amenity
        const result = await createAmenity(formData);
        if (result) {
          resetForm();
        }
      }
    } catch (err) {
      error('Có lỗi xảy ra', 'Vui lòng thử lại sau');
    }
  };

  const handleEdit = (amenity: Amenity) => {
    console.log('Editing amenity:', amenity); // Debug log
    setEditingAmenity(amenity);
    setFormData({
      name: amenity.name || '',
      nameEn: amenity.nameEn || '',
      description: amenity.description || '',
      category: amenity.category || '',
      icon: amenity.icon || '',
      isActive: amenity.isActive ?? true,
      sortOrder: amenity.sortOrder || 0
    });
    setIsModalOpen(true);
  };

  // Effect để đảm bảo form được update khi editingAmenity thay đổi
  useEffect(() => {
    if (editingAmenity) {
      console.log('Setting form data for:', editingAmenity); // Debug log
      setFormData({
        name: editingAmenity.name || '',
        nameEn: editingAmenity.nameEn || '',
        description: editingAmenity.description || '',
        category: editingAmenity.category || '',
        icon: editingAmenity.icon || '',
        isActive: editingAmenity.isActive ?? true,
        sortOrder: editingAmenity.sortOrder || 0
      });
    }
  }, [editingAmenity]);

  const handleDelete = (amenity: Amenity) => {
    setDeleteConfirm({ isOpen: true, amenity });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.amenity) return;
    
    try {
      const success = await deleteAmenity(deleteConfirm.amenity.id);
      if (success) {
        setDeleteConfirm({ isOpen: false, amenity: null });
      }
    } catch (err) {
      error('Không thể xóa tiện ích', 'Vui lòng thử lại sau');
    }
  };

  const handleToggleStatus = async (amenity: Amenity) => {
    try {
      await toggleAmenityStatus(amenity.id, !amenity.isActive);
    } catch (err) {
      error('Không thể thay đổi trạng thái', 'Vui lòng thử lại sau');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAmenities.length === 0) {
      warning('Vui lòng chọn ít nhất một tiện ích để xóa');
      return;
    }

    // Hiện modal xác nhận
    setBulkDeleteConfirm({ isOpen: true, count: selectedAmenities.length });
  };

  const confirmBulkDelete = async () => {
    try {
      const success = await bulkDelete(selectedAmenities);
      if (success) {
        setSelectedAmenities([]);
        setBulkDeleteConfirm({ isOpen: false, count: 0 });
      }
    } catch (err) {
      error('Không thể xóa các tiện ích đã chọn', 'Vui lòng thử lại sau');
    }
  };

  const handleBulkToggleStatus = async (isActive: boolean) => {
    if (selectedAmenities.length === 0) {
      warning('Vui lòng chọn ít nhất một tiện ích');
      return;
    }

    try {
      const success = await bulkUpdateStatus(selectedAmenities, isActive);
      if (success) {
        setSelectedAmenities([]);
      }
    } catch (err) {
      error('Không thể thay đổi trạng thái các tiện ích đã chọn', 'Vui lòng thử lại sau');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameEn: '',
      description: '',
      category: '',
      icon: '',
      isActive: true,
      sortOrder: 0
    });
    setEditingAmenity(null);
    setIsModalOpen(false);
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      general: 'Chung',
      room: 'Phòng',
      hotel: 'Khách sạn', 
      wellness: 'Sức khỏe'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-ocean-blue',
      room: 'bg-seafoam-green',
      hotel: 'bg-coral-pink',
      wellness: 'bg-sunset-orange'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  // Helper function để chuyển icon name thành emoji
  const getIconDisplay = (iconName: string): string => {
    const iconMap: Record<string, string> = {
      // Technology
      'wifi': '📶', 'tv': '📺', 'computer': '💻', 'phone': '📞', 'printer': '🖨️',
      // Bathroom  
      'shower': '🚿', 'bathtub': '🛁', 'toilet': '🚽', 'towel': '🧴',
      // Comfort
      'bed': '🛏️', 'pillow': '🛌', 'air-conditioning': '❄️', 'heating': '🔥', 'fan': '💨',
      // Food & Beverage
      'coffee': '☕', 'minibar': '🍷', 'restaurant': '🍽️', 'room-service': '🛎️', 'kettle': '🫖',
      // Recreation
      'swimming-pool': '🏊', 'gym': '💪', 'spa': '🧘', 'games': '🎮', 'library': '📚',
      // Safety & Security
      'safe': '🔒', 'security': '🛡️', 'fire-safety': '🚨', 'cctv': '📹',
      // Transportation
      'parking': '🅿️', 'valet': '🔑', 'shuttle': '🚐', 'taxi': '🚕',
      // General
      'concierge': '🤵', 'cleaning': '🧹', 'laundry': '👕', 'balcony': '🏙️', 
      'garden': '🌳', 'business': '💼', 'elevator': '🛗', 'reception': '🏨',
      'luggage': '🧳', 'pet-friendly': '🐕', 'non-smoking': '🚭'
    };
    
    // Nếu đã là emoji thì trả về trực tiếp
    if (iconName && /\p{Emoji}/u.test(iconName)) {
      return iconName;
    }
    
    // Nếu tìm thấy trong map thì trả về emoji
    return iconMap[iconName] || iconName || '📦';
  };

  const columns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          checked={selectedAmenities.length === amenities.length && amenities.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedAmenities(amenities.map(a => a.id));
            } else {
              setSelectedAmenities([]);
            }
          }}
          className="rounded border-gray-300"
          aria-label="Chọn tất cả tiện ích"
        />
      ),
      render: (amenity: Amenity) => (
        <input
          type="checkbox"
          checked={selectedAmenities.includes(amenity.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedAmenities(prev => [...prev, amenity.id]);
            } else {
              setSelectedAmenities(prev => prev.filter(id => id !== amenity.id));
            }
          }}
          className="rounded border-gray-300"
          aria-label={`Chọn tiện ích ${amenity.name}`}
        />
      )
    },
    {
      key: 'icon',
      label: 'Icon',
      render: (amenity: Amenity) => (
        <div className="text-2xl" title={amenity.icon}>
          {getIconDisplay(amenity.icon)}
        </div>
      )
    },
    {
      key: 'name',
      label: 'Tên tiện nghi',
      render: (amenity: Amenity) => (
        <div>
          <div className="font-medium text-deep-navy">{amenity.name}</div>
          {amenity.nameEn && (
            <div className="text-sm text-gray-500 italic">{amenity.nameEn}</div>
          )}
          <div className="text-sm text-gray-500">{amenity.description}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Danh mục',
      render: (amenity: Amenity) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(amenity.category)}`}>
          {getCategoryLabel(amenity.category)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (amenity: Amenity) => (
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            amenity.isActive 
              ? 'bg-seafoam-green text-white' 
              : 'bg-gray-300 text-gray-700'
          }`}>
            {amenity.isActive ? 'Hoạt động' : 'Tạm ngưng'}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleToggleStatus(amenity)}
            className={`text-xs ${
              amenity.isActive 
                ? 'text-gray-600 hover:text-gray-800' 
                : 'text-seafoam-green hover:text-seafoam-green/80'
            }`}
          >
            {amenity.isActive ? 'Tắt' : 'Bật'}
          </Button>
        </div>
      )
    },
    {
      key: 'sortOrder',
      label: 'Thứ tự',
      render: (amenity: Amenity) => (
        <span className="text-sm text-gray-600">{amenity.sortOrder || 0}</span>
      )
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (amenity: Amenity) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(amenity)}
            className="text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white"
          >
            <EditIcon />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(amenity)}
            className="text-coral-pink border-coral-pink hover:bg-coral-pink hover:text-white"
          >
            <TimesIcon />
          </Button>
        </div>
      )
    }
  ];

  return (
    <HotelLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-deep-navy">
              Quản lý tiện nghi
            </h2>
            <p className="text-gray-600 mt-2">
              Quản lý các tiện nghi và dịch vụ của khách sạn
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-ocean-blue to-seafoam-green hover:shadow-lg"
          >
            <CogIcon />
            Thêm tiện nghi
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-ocean-blue">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Tổng tiện nghi</p>
                <p className="text-2xl font-bold text-deep-navy">{amenities.length}</p>
              </div>
              <div className="text-ocean-blue bg-ocean-blue/10 p-3 rounded-full">
                <CogIcon />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-seafoam-green">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-deep-navy">
                  {amenities.filter(a => a.isActive).length}
                </p>
              </div>
              <div className="text-seafoam-green bg-seafoam-green/10 p-3 rounded-full">
                <TagIcon />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-coral-pink">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Sức khỏe</p>
                <p className="text-2xl font-bold text-deep-navy">
                  {amenities.filter(a => a.category === 'wellness').length}
                </p>
              </div>
              <div className="text-coral-pink bg-coral-pink/10 p-3 rounded-full">
                <span className="text-lg">🧘‍♀️</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-sunset-orange">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Khách sạn</p>
                <p className="text-2xl font-bold text-deep-navy">
                  {amenities.filter(a => a.category === 'hotel').length}
                </p>
              </div>
              <div className="text-sunset-orange bg-sunset-orange/10 p-3 rounded-full">
                <span className="text-lg">🏨</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <Input
                type="text"
                placeholder="Tìm kiếm tiện ích..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                title="Chọn danh mục"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={refreshAmenities}
                disabled={isLoading}
                className="bg-ocean-blue hover:bg-ocean-blue/90"
              >
                {isLoading ? 'Đang tải...' : 'Làm mới'}
              </Button>
            </div>
            <div className="flex items-end justify-end">
              {selectedAmenities.length > 0 && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkToggleStatus(true)}
                    className="text-seafoam-green border-seafoam-green"
                  >
                    Kích hoạt ({selectedAmenities.length})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkToggleStatus(false)}
                    className="text-gray-600 border-gray-600"
                  >
                    Tắt ({selectedAmenities.length})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkDelete}
                    className="text-coral-pink border-coral-pink"
                  >
                    Xóa ({selectedAmenities.length})
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Main Table */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-deep-navy mb-4">
              Danh sách tiện nghi ({amenities.length})
            </h3>

            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-gray-500">Đang tải...</div>
              </div>
            ) : amenities.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-gray-500">Không có tiện ích nào</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.length === amenities.length && amenities.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAmenities(amenities.map(a => a.id));
                            } else {
                              setSelectedAmenities([]);
                            }
                          }}
                          className="rounded border-gray-300"
                          title="Chọn tất cả"
                          aria-label="Chọn tất cả tiện ích"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Icon
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên tiện nghi
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Danh mục
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thứ tự
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {amenities.map((amenity) => (
                      <tr key={amenity.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAmenities(prev => [...prev, amenity.id]);
                              } else {
                                setSelectedAmenities(prev => prev.filter(id => id !== amenity.id));
                              }
                            }}
                            className="rounded border-gray-300"
                            title={`Chọn ${amenity.name}`}
                            aria-label={`Chọn tiện ích ${amenity.name}`}
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-2xl" title={amenity.icon}>
                            {getIconDisplay(amenity.icon)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium text-deep-navy">{amenity.name}</div>
                            {amenity.nameEn && (
                              <div className="text-sm text-gray-500 italic">{amenity.nameEn}</div>
                            )}
                            <div className="text-sm text-gray-500">{amenity.description}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(amenity.category)}`}>
                            {getCategoryLabel(amenity.category)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              amenity.isActive 
                                ? 'bg-seafoam-green text-white' 
                                : 'bg-gray-300 text-gray-700'
                            }`}>
                              {amenity.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleStatus(amenity)}
                              className={`text-xs ${
                                amenity.isActive 
                                  ? 'text-gray-600 hover:text-gray-800' 
                                  : 'text-seafoam-green hover:text-seafoam-green/80'
                              }`}
                            >
                              {amenity.isActive ? 'Tắt' : 'Bật'}
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{amenity.sortOrder || 0}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(amenity)}
                              className="text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white"
                            >
                              <EditIcon />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(amenity)}
                              className="text-coral-pink border-coral-pink hover:bg-coral-pink hover:text-white"
                            >
                              <TimesIcon />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={resetForm}
          title={editingAmenity ? 'Chỉnh sửa tiện nghi' : 'Thêm tiện nghi mới'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-deep-navy mb-2">
                Tên tiện nghi <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên tiện nghi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-navy mb-2">
                Tên tiếng Anh
              </label>
              <Input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                placeholder="Nhập tên tiếng Anh (tùy chọn)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-navy mb-2">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  console.log('Description changed to:', e.target.value); // Debug log
                  setFormData(prev => ({ ...prev, description: e.target.value }));
                }}
                placeholder="Nhập mô tả tiện nghi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                rows={3}
                required
              />
              {/* Debug info */}
              <div className="text-xs text-gray-400 mt-1">
                Current value: {formData.description || 'empty'} (Length: {(formData.description || '').length})
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-navy mb-2">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  category: e.target.value
                }))}
                title="Chọn danh mục tiện nghi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </select>
            </div>

            <IconPicker
              label="Icon"
              value={formData.icon}
              onChange={(icon) => setFormData(prev => ({ ...prev, icon }))}
              required
            />

            <div>
              <label className="block text-sm font-medium text-deep-navy mb-2">
                Thứ tự sắp xếp
              </label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-ocean-blue focus:ring-ocean-blue border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-deep-navy">
                Kích hoạt tiện nghi
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isCreating || isUpdating}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-ocean-blue to-seafoam-green"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating 
                  ? (editingAmenity ? 'Đang cập nhật...' : 'Đang tạo...') 
                  : (editingAmenity ? 'Cập nhật' : 'Thêm mới')
                }
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, amenity: null })}
          onConfirm={confirmDelete}
          title="Xác nhận xóa tiện ích"
          message={`Bạn có chắc chắn muốn xóa tiện ích "${deleteConfirm.amenity?.name}"? Hành động này không thể hoàn tác.`}
          confirmText="Xóa"
          cancelText="Hủy"
          type="danger"
          isLoading={isDeleting}
        />

        {/* Bulk Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={bulkDeleteConfirm.isOpen}
          onClose={() => setBulkDeleteConfirm({ isOpen: false, count: 0 })}
          onConfirm={confirmBulkDelete}
          title="Xác nhận xóa nhiều tiện ích"
          message={`Bạn có chắc chắn muốn xóa ${bulkDeleteConfirm.count} tiện ích đã chọn? Hành động này không thể hoàn tác.`}
          confirmText="Xóa tất cả"
          cancelText="Hủy"
          type="danger"
          isLoading={isDeleting}
        />
      </div>
    </HotelLayout>
  );
}
