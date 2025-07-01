'use client';

import { useState, useEffect } from 'react';
import { HotelLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/hooks/useToast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { 
  CogIcon, 
  EditIcon, 
  TimesIcon,
  TagIcon
} from '@/components/icons/HotelIcons';
import type { Amenity } from '@/types/hotel';

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; amenity: Amenity | null }>({
    isOpen: false,
    amenity: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const { success, error, warning } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general' as 'general' | 'room' | 'hotel' | 'wellness',
    icon: '',
    isActive: true
  });

  // Mock data - replace with API call
  useEffect(() => {
    const mockAmenities: Amenity[] = [
      {
        id: '1',
        name: 'Wi-Fi miễn phí',
        description: 'Internet tốc độ cao miễn phí trong toàn bộ khách sạn',
        category: 'general',
        icon: '📶',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Hồ bơi',
        description: 'Hồ bơi ngoài trời với view biển tuyệt đẹp',
        category: 'wellness',
        icon: '🏊‍♂️',
        isActive: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '3',
        name: 'Phòng gym',
        description: 'Phòng tập gym hiện đại với đầy đủ thiết bị',
        category: 'wellness',
        icon: '💪',
        isActive: true,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: '4',
        name: 'Spa',
        description: 'Dịch vụ spa cao cấp với các liệu pháp thư giãn',
        category: 'wellness',
        icon: '🧘‍♀️',
        isActive: true,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08')
      },
      {
        id: '5',
        name: 'Nhà hàng',
        description: 'Nhà hàng phục vụ các món ăn địa phương và quốc tế',
        category: 'hotel',
        icon: '🍽️',
        isActive: true,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05')
      }
    ];
    setAmenities(mockAmenities);
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingAmenity) {
        // Update existing amenity
        setAmenities(prev => prev.map(a => 
          a.id === editingAmenity.id 
            ? { ...a, ...formData, updatedAt: new Date() }
            : a
        ));
        success('Cập nhật tiện ích thành công', `${formData.name} đã được cập nhật`);
      } else {
        // Add new amenity
        const newAmenity: Amenity = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setAmenities(prev => [...prev, newAmenity]);
        success('Thêm tiện ích thành công', `${formData.name} đã được thêm vào danh sách`);
      }

      resetForm();
    } catch (err) {
      error('Có lỗi xảy ra', 'Vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setFormData({
      name: amenity.name,
      description: amenity.description,
      category: amenity.category,
      icon: amenity.icon,
      isActive: amenity.isActive
    });
    setIsModalOpen(true);
  };
  const handleDelete = (amenity: Amenity) => {
    setDeleteConfirm({ isOpen: true, amenity });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.amenity) return;
    
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAmenities(prev => prev.filter(a => a.id !== deleteConfirm.amenity!.id));
      success('Xóa tiện ích thành công', `${deleteConfirm.amenity.name} đã được xóa`);
      setDeleteConfirm({ isOpen: false, amenity: null });
    } catch (err) {
      error('Không thể xóa tiện ích', 'Vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'general',
      icon: '',
      isActive: true
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

  const columns = [
    {
      key: 'icon',
      label: 'Icon',
      render: (amenity: Amenity) => (
        <div className="text-2xl">{amenity.icon}</div>
      )
    },
    {
      key: 'name',
      label: 'Tên tiện nghi',
      render: (amenity: Amenity) => (
        <div>
          <div className="font-medium text-deep-navy">{amenity.name}</div>
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
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          amenity.isActive 
            ? 'bg-seafoam-green text-white' 
            : 'bg-gray-300 text-gray-700'
        }`}>
          {amenity.isActive ? 'Hoạt động' : 'Tạm ngưng'}
        </span>
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
          </Button>          <Button
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

        {/* Amenities Table */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-deep-navy mb-4">
              Danh sách tiện nghi
            </h3>
            <Table
              data={amenities}
              columns={columns}
              emptyMessage="Chưa có tiện nghi nào được thêm"
            />
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
                Tên tiện nghi
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
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nhập mô tả tiện nghi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-navy mb-2">
                Danh mục
              </label>              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  category: e.target.value as 'general' | 'room' | 'hotel' | 'wellness'
                }))}
                title="Chọn danh mục tiện nghi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                required
              >
                <option value="general">Chung</option>
                <option value="room">Phòng</option>
                <option value="hotel">Khách sạn</option>
                <option value="wellness">Sức khỏe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-navy mb-2">
                Icon (emoji)
              </label>
              <Input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="Chọn emoji (ví dụ: 🏊‍♂️)"
                required
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
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-ocean-blue to-seafoam-green"
              >
                {editingAmenity ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>          </form>
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
          isLoading={isLoading}
        />
      </div>
    </HotelLayout>
  );
}
