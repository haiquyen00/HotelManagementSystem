'use client';

import { useState } from 'react';
import { HotelLayout } from '@/components/layout';
import { 
  BedIcon, 
  UsersIcon, 
  CurrencyIcon, 
  EditIcon, 
  EyeIcon, 
  XIcon,
  ListIcon,
  TagIcon,
  ChartBarIcon,
  CogIcon,
  PlusIcon,
  SearchIcon,
  MoreHorizontalIcon,
  TrashIcon,
  CopyIcon
} from '@/components/icons/HotelIcons';
import FormField from '@/components/ui/FormField';
import { RoomTypeDialog } from '@/components/ui/RoomTypeDialog';

// Mock data for room types
const mockRoomTypes = [
  {
    id: '1',
    name: 'Standard Room',
    nameVn: 'Phòng Tiêu Chuẩn',
    description: 'Comfortable room with basic amenities perfect for business travelers',
    descriptionVn: 'Phòng thoải mái với các tiện nghi cơ bản, hoàn hảo cho khách du lịch công tác',
    basePrice: 1200000,
    maxOccupancy: 2,
    bedType: 'double',
    roomSize: 25,
    amenities: ['wifi', 'ac', 'tv', 'minibar'],
    images: ['/images/standard-room-1.jpg', '/images/standard-room-2.jpg'],
    status: 'active',
    totalRooms: 15,
    availableRooms: 8,
    createdAt: '2024-01-15',
    updatedAt: '2024-06-10'
  },
  {
    id: '2',
    name: 'Deluxe Room',
    nameVn: 'Phòng Cao Cấp',
    description: 'Spacious room with premium amenities and city view',
    descriptionVn: 'Phòng rộng rãi với tiện nghi cao cấp và tầm nhìn ra thành phố',
    basePrice: 1800000,
    maxOccupancy: 3,
    bedType: 'king',
    roomSize: 35,
    amenities: ['wifi', 'ac', 'tv', 'minibar', 'balcony', 'coffee-machine'],
    images: ['/images/deluxe-room-1.jpg', '/images/deluxe-room-2.jpg'],
    status: 'active',
    totalRooms: 10,
    availableRooms: 5,
    createdAt: '2024-01-15',
    updatedAt: '2024-06-08'
  },
  {
    id: '3',
    name: 'Family Suite',
    nameVn: 'Suite Gia Đình',
    description: 'Large suite perfect for families with children',
    descriptionVn: 'Suite lớn hoàn hảo cho gia đình có trẻ em',
    basePrice: 2500000,
    maxOccupancy: 4,
    bedType: 'multiple',
    roomSize: 55,
    amenities: ['wifi', 'ac', 'tv', 'minibar', 'balcony', 'coffee-machine', 'kitchenette', 'living-area'],
    images: ['/images/family-suite-1.jpg', '/images/family-suite-2.jpg'],
    status: 'active',
    totalRooms: 5,
    availableRooms: 2,
    createdAt: '2024-01-20',
    updatedAt: '2024-06-05'
  },
  {
    id: '4',
    name: 'Presidential Suite',
    nameVn: 'Suite Tổng Thống',
    description: 'Ultimate luxury suite with panoramic ocean view',
    descriptionVn: 'Suite sang trọng tối cao với tầm nhìn toàn cảnh ra đại dương',
    basePrice: 5000000,
    maxOccupancy: 6,
    bedType: 'multiple',
    roomSize: 120,
    amenities: ['wifi', 'ac', 'tv', 'minibar', 'balcony', 'coffee-machine', 'kitchenette', 'living-area', 'jacuzzi', 'butler-service'],
    images: ['/images/presidential-suite-1.jpg', '/images/presidential-suite-2.jpg'],
    status: 'active',
    totalRooms: 1,
    availableRooms: 1,
    createdAt: '2024-02-01',
    updatedAt: '2024-06-01'
  },
  {
    id: '5',
    name: 'Economy Room',
    nameVn: 'Phòng Tiết Kiệm',
    description: 'Budget-friendly room with essential amenities',
    descriptionVn: 'Phòng giá rẻ với các tiện nghi thiết yếu',
    basePrice: 800000,
    maxOccupancy: 2,
    bedType: 'single',
    roomSize: 18,
    amenities: ['wifi', 'ac', 'tv'],
    images: ['/images/economy-room-1.jpg'],
    status: 'maintenance',
    totalRooms: 8,
    availableRooms: 0,
    createdAt: '2024-01-10',
    updatedAt: '2024-06-12'
  }
];

const amenityLabels: Record<string, string> = {
  wifi: 'WiFi miễn phí',
  ac: 'Điều hòa',
  tv: 'TV màn hình phẳng',
  minibar: 'Minibar',
  balcony: 'Ban công',
  'coffee-machine': 'Máy pha cà phê',
  kitchenette: 'Bếp nhỏ',
  'living-area': 'Khu vực sinh hoạt',
  jacuzzi: 'Jacuzzi',
  'butler-service': 'Dịch vụ quản gia'
};

const bedTypeLabels: Record<string, string> = {
  single: 'Giường đơn',
  double: 'Giường đôi',
  queen: 'Giường Queen',
  king: 'Giường King',
  multiple: 'Nhiều giường'
};

const statusLabels: Record<string, string> = {
  active: 'Hoạt động',
  inactive: 'Tạm ngưng',
  maintenance: 'Bảo trì'
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800', 
  maintenance: 'bg-yellow-100 text-yellow-800'
};

export default function RoomTypesPage() {
  const [roomTypes, setRoomTypes] = useState(mockRoomTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedRoomType, setSelectedRoomType] = useState<any>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter and sort room types
  const filteredRoomTypes = roomTypes
    .filter(roomType => {
      const matchesSearch = roomType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           roomType.nameVn.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || roomType.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'name':
          aVal = a.nameVn;
          bVal = b.nameVn;
          break;
        case 'price':
          aVal = a.basePrice;
          bVal = b.basePrice;
          break;
        case 'capacity':
          aVal = a.maxOccupancy;
          bVal = b.maxOccupancy;
          break;
        case 'rooms':
          aVal = a.totalRooms;
          bVal = b.totalRooms;
          break;
        case 'created':
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        default:
          aVal = a.nameVn;
          bVal = b.nameVn;
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleCreateRoomType = () => {
    setSelectedRoomType(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleEditRoomType = (roomType: any) => {
    setSelectedRoomType(roomType);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleViewRoomType = (roomType: any) => {
    setSelectedRoomType(roomType);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleDuplicateRoomType = (roomType: any) => {
    const duplicated = {
      ...roomType,
      id: Date.now().toString(),
      name: `${roomType.name} (Copy)`,
      nameVn: `${roomType.nameVn} (Bản sao)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRoomTypes(prev => [...prev, duplicated]);
  };

  const handleDeleteRoomType = (roomTypeId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại phòng này?')) {
      setRoomTypes(prev => prev.filter(rt => rt.id !== roomTypeId));
    }
  };

  const handleSaveRoomType = (data: any) => {
    if (dialogMode === 'create') {
      const newRoomType = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setRoomTypes(prev => [...prev, newRoomType]);
    } else if (dialogMode === 'edit') {
      setRoomTypes(prev => prev.map(rt => 
        rt.id === selectedRoomType.id 
          ? { ...rt, ...data, updatedAt: new Date().toISOString().split('T')[0] }
          : rt
      ));
    }
    setIsDialogOpen(false);
  };
  const getOccupancyRate = (roomType: any) => {
    return ((roomType.totalRooms - roomType.availableRooms) / roomType.totalRooms * 100).toFixed(1);
  };
  return (
    <HotelLayout>
      <div className="p-6 max-w-full content-scroll">
        {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <BedIcon className="w-8 h-8 text-blue-600" />
            Quản lý loại phòng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý các loại phòng và cấu hình trong khách sạn
          </p>
        </div>        <button
          onClick={handleCreateRoomType}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Thêm loại phòng
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng loại phòng</p>
              <p className="text-2xl font-bold text-gray-900">{roomTypes.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BedIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-green-600">
                {roomTypes.filter(rt => rt.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số phòng</p>
              <p className="text-2xl font-bold text-gray-900">
                {roomTypes.reduce((sum, rt) => sum + rt.totalRooms, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Giá trung bình</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(roomTypes.reduce((sum, rt) => sum + rt.basePrice, 0) / roomTypes.length).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CurrencyIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm loại phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
            <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            title="Lọc theo trạng thái"
            aria-label="Lọc theo trạng thái"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Tạm ngưng</option>
            <option value="maintenance">Bảo trì</option>
          </select>          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            title="Sắp xếp theo"
            aria-label="Sắp xếp theo"
          >
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="price-asc">Giá thấp - cao</option>
            <option value="price-desc">Giá cao - thấp</option>
            <option value="capacity-asc">Sức chứa tăng dần</option>
            <option value="capacity-desc">Sức chứa giảm dần</option>
            <option value="rooms-desc">Số phòng nhiều nhất</option>
            <option value="created-desc">Mới nhất</option>
          </select>
        </div>
      </div>

      {/* Room Types Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRoomTypes.map(roomType => (
          <div key={roomType.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Room Type Image */}
            <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg">
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t-lg"></div>
              <div className="absolute top-4 left-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[roomType.status]}`}>
                  {statusLabels[roomType.status]}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <div className="relative">                  <button 
                    className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                    title="Tùy chọn khác"
                    aria-label="Tùy chọn khác"
                  >
                    <MoreHorizontalIcon className="w-4 h-4 text-white" />
                  </button>
                  <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">                    <button
                      onClick={() => handleViewRoomType(roomType)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleEditRoomType(roomType)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <EditIcon className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDuplicateRoomType(roomType)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <CopyIcon className="w-4 h-4" />
                      Sao chép
                    </button>
                    <button
                      onClick={() => handleDeleteRoomType(roomType.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1">{roomType.nameVn}</h3>
                <p className="text-white text-opacity-90 text-sm">{roomType.name}</p>
              </div>
            </div>

            {/* Room Type Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-blue-600">
                  {roomType.basePrice.toLocaleString()} VND
                </div>
                <div className="text-sm text-gray-600">
                  {getOccupancyRate(roomType)}% đã đặt
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sức chứa tối đa:</span>
                  <span className="font-medium">{roomType.maxOccupancy} người</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Loại giường:</span>
                  <span className="font-medium">{bedTypeLabels[roomType.bedType]}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Diện tích:</span>
                  <span className="font-medium">{roomType.roomSize}m²</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Số phòng:</span>
                  <span className="font-medium">
                    {roomType.availableRooms}/{roomType.totalRooms} có sẵn
                  </span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Tiện nghi:</p>
                <div className="flex flex-wrap gap-1">
                  {roomType.amenities.slice(0, 4).map(amenity => (
                    <span key={amenity} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {amenityLabels[amenity]}
                    </span>
                  ))}
                  {roomType.amenities.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{roomType.amenities.length - 4} khác
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewRoomType(roomType)}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Xem chi tiết
                </button>
                <button
                  onClick={() => handleEditRoomType(roomType)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRoomTypes.length === 0 && (
        <div className="text-center py-12">
          <BedIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy loại phòng nào
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
              : 'Hãy tạo loại phòng đầu tiên cho khách sạn của bạn'
            }
          </p>          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={handleCreateRoomType}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Thêm loại phòng
            </button>
          )}
        </div>
      )}      {/* Room Type Dialog */}
      <RoomTypeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveRoomType}
        roomType={selectedRoomType}        mode={dialogMode}
        amenityLabels={amenityLabels}
        bedTypeLabels={bedTypeLabels}
      />
      </div>
    </HotelLayout>
  );
}
