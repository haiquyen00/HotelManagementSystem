'use client';

import { useState, useEffect } from 'react';
import { HotelLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { EnhancedTable, type Column } from '@/components/ui/EnhancedTable';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { NoRoomsEmpty } from '@/components/ui/EmptyState';
import { useToast } from '@/hooks/useToast';
import { 
  BedIcon, 
  EditIcon, 
  TimesIcon,
  TagIcon,
  UsersIcon
} from '@/components/icons/HotelIcons';
import type { Room } from '@/types/hotel';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    number: '',
    type: 'standard' as 'standard' | 'deluxe' | 'suite' | 'presidential',
    capacity: 2,
    price: 0,
    description: '',
    amenities: [] as string[],
    status: 'available' as 'available' | 'occupied' | 'maintenance' | 'cleaning'
  });

  // Mock data - replace with API call
  useEffect(() => {
    const mockRooms: Room[] = [
      {
        id: '1',
        number: '101',
        type: 'standard',
        capacity: 2,
        price: 1500000,
        description: 'Phòng tiêu chuẩn với view sân vườn',
        amenities: ['1', '2'], // Wi-Fi, Hồ bơi
        status: 'available',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        number: '201',
        type: 'deluxe',
        capacity: 3,
        price: 2500000,
        description: 'Phòng deluxe với view biển tuyệt đẹp',
        amenities: ['1', '2', '3'], // Wi-Fi, Hồ bơi, Gym
        status: 'occupied',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '3',
        number: '301',
        type: 'suite',
        capacity: 4,
        price: 4000000,
        description: 'Suite cao cấp với phòng khách riêng',
        amenities: ['1', '2', '3', '4'], // Wi-Fi, Hồ bơi, Gym, Spa
        status: 'available',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: '4',
        number: '102',
        type: 'standard',
        capacity: 2,
        price: 1500000,
        description: 'Phòng tiêu chuẩn gần sảnh chính',
        amenities: ['1', '5'], // Wi-Fi, Nhà hàng
        status: 'maintenance',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08')
      },
      {
        id: '5',
        number: '401',
        type: 'presidential',
        capacity: 6,
        price: 8000000,
        description: 'Phòng tổng thống với đầy đủ tiện nghi cao cấp',
        amenities: ['1', '2', '3', '4', '5'], // Tất cả tiện nghi
        status: 'available',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05')
      }    ];
    
    // Simulate loading
    setTimeout(() => {
      setRooms(mockRooms);
      setIsLoading(false);
    }, 1500);
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingRoom) {
        // Update existing room
        setRooms(prev => prev.map(r => 
          r.id === editingRoom.id 
            ? { ...r, ...formData, updatedAt: new Date() }
            : r
        ));
        success('Cập nhật phòng thành công', `Phòng ${formData.number} đã được cập nhật`);
      } else {
        // Add new room
        const newRoom: Room = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setRooms(prev => [...prev, newRoom]);
        success('Thêm phòng thành công', `Phòng ${formData.number} đã được thêm vào hệ thống`);
      }

      resetForm();
    } catch (err) {
      error('Có lỗi xảy ra', 'Vui lòng thử lại sau');
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      price: room.price,
      description: room.description,
      amenities: room.amenities,
      status: room.status
    });
    setIsModalOpen(true);
  };
  const handleDelete = async (id: string) => {
    try {
      const room = rooms.find(r => r.id === id);
      if (!room) return;
      
      if (confirm(`Bạn có chắc chắn muốn xóa phòng ${room.number}?`)) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setRooms(prev => prev.filter(r => r.id !== id));
        success('Xóa phòng thành công', `Phòng ${room.number} đã được xóa`);
      }
    } catch (err) {
      error('Không thể xóa phòng', 'Vui lòng thử lại sau');
    }
  };

  const resetForm = () => {
    setFormData({
      number: '',
      type: 'standard',
      capacity: 2,
      price: 0,
      description: '',
      amenities: [],
      status: 'available'
    });
    setEditingRoom(null);
    setIsModalOpen(false);
  };

  const getRoomTypeLabel = (type: string) => {
    const labels = {
      standard: 'Tiêu chuẩn',
      deluxe: 'Deluxe',
      suite: 'Suite',
      presidential: 'Tổng thống'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getRoomTypeColor = (type: string) => {
    const colors = {
      standard: 'bg-ocean-blue',
      deluxe: 'bg-seafoam-green',
      suite: 'bg-coral-pink',
      presidential: 'bg-sunset-orange'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      available: 'Có sẵn',
      occupied: 'Đã đặt',
      maintenance: 'Bảo trì',
      cleaning: 'Dọn dẹp'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-seafoam-green',
      occupied: 'bg-coral-pink',
      maintenance: 'bg-sunset-orange',
      cleaning: 'bg-ocean-blue'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  const columns: Column<Room>[] = [
    {
      key: 'number',
      title: 'Số phòng',
      sortable: true,
      filterable: true,
      render: (value: string, room: Room) => (
        <div className="font-medium text-deep-navy text-lg">
          {room.number}
        </div>
      )
    },
    {
      key: 'type',
      title: 'Loại phòng',
      sortable: true,
      filterable: true,
      render: (value: string, room: Room) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getRoomTypeColor(room.type)}`}>
          {getRoomTypeLabel(room.type)}
        </span>
      )
    },
    {
      key: 'capacity',
      title: 'Sức chứa',
      sortable: true,
      render: (value: number, room: Room) => (
        <div className="flex items-center">
          <UsersIcon />
          <span className="ml-1">{room.capacity} người</span>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Giá/đêm',
      sortable: true,
      render: (value: number, room: Room) => (
        <div className="font-medium text-deep-navy">
          {formatPrice(room.price)}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      sortable: true,
      filterable: true,
      render: (value: string, room: Room) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(room.status)}`}>
          {getStatusLabel(room.status)}
        </span>
      )
    },
    {      key: 'amenities',
      title: 'Tiện nghi',
      render: (value: string[], room: Room) => (
        <div className="text-sm text-gray-600">
          {room.amenities.length} tiện nghi
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      render: (value: any, room: Room) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(room)}
            className="text-ocean-blue border-ocean-blue hover:bg-ocean-blue hover:text-white"
          >
            <EditIcon />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(room.id)}
            className="text-coral-pink border-coral-pink hover:bg-coral-pink hover:text-white"
          >
            <TimesIcon />
          </Button>
        </div>
      )
    }
  ];

  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;

  return (
    <HotelLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-deep-navy">
              Quản lý phòng
            </h2>
            <p className="text-gray-600 mt-2">
              Quản lý phòng và trạng thái của khách sạn
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-ocean-blue to-seafoam-green hover:shadow-lg"
          >
            <BedIcon />
            Thêm phòng
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-ocean-blue">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Tổng số phòng</p>
                <p className="text-2xl font-bold text-deep-navy">{rooms.length}</p>
              </div>
              <div className="text-ocean-blue bg-ocean-blue/10 p-3 rounded-full">
                <BedIcon />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-seafoam-green">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Phòng trống</p>
                <p className="text-2xl font-bold text-deep-navy">{availableRooms}</p>
              </div>
              <div className="text-seafoam-green bg-seafoam-green/10 p-3 rounded-full">
                <TagIcon />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-coral-pink">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Phòng đã đặt</p>
                <p className="text-2xl font-bold text-deep-navy">{occupiedRooms}</p>
              </div>
              <div className="text-coral-pink bg-coral-pink/10 p-3 rounded-full">
                <UsersIcon />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-sunset-orange">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Bảo trì</p>
                <p className="text-2xl font-bold text-deep-navy">{maintenanceRooms}</p>
              </div>
              <div className="text-sunset-orange bg-sunset-orange/10 p-3 rounded-full">
                <span className="text-lg">🔧</span>
              </div>
            </div>
          </Card>
        </div>        {/* Rooms Table */}
        {isLoading ? (
          <TableSkeleton rows={5} />        ) : rooms.length === 0 ? (
          <Card>
            <NoRoomsEmpty onAddRoom={() => setIsModalOpen(true)} />
          </Card>
        ) : (
          <EnhancedTable
            data={rooms}
            columns={columns}
            loading={false}
            emptyMessage="Chưa có phòng nào được thêm"
            searchPlaceholder="Tìm kiếm phòng..."
            pageSize={8}
          />
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={resetForm}
          title={editingRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-deep-navy mb-2">
                Số phòng
              </label>
              <Input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                placeholder="Nhập số phòng (ví dụ: 101)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-navy mb-2">
                Loại phòng
              </label>              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  type: e.target.value as 'standard' | 'deluxe' | 'suite' | 'presidential'
                }))}
                title="Chọn loại phòng"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                required
              >
                <option value="standard">Tiêu chuẩn</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="presidential">Tổng thống</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-navy mb-2">
                Sức chứa (số người)
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-navy mb-2">
                Giá/đêm (VNĐ)
              </label>
              <Input
                type="number"
                min="0"
                step="10000"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                placeholder="Nhập giá phòng"
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
                placeholder="Nhập mô tả phòng"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-navy mb-2">
                Trạng thái
              </label>              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  status: e.target.value as 'available' | 'occupied' | 'maintenance' | 'cleaning'
                }))}
                title="Chọn trạng thái phòng"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                required
              >
                <option value="available">Có sẵn</option>
                <option value="occupied">Đã đặt</option>
                <option value="maintenance">Bảo trì</option>
                <option value="cleaning">Dọn dẹp</option>
              </select>
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
                {editingRoom ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </HotelLayout>
  );
}
