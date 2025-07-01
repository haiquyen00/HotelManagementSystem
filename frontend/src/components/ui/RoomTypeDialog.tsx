'use client';

import { useState, useEffect } from 'react';
import { 
  BedIcon, 
  CurrencyIcon, 
  UsersIcon, 
  XIcon, 
  CheckIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
  ImageIcon
} from '@/components/icons/HotelIcons';
import FormField from '@/components/ui/FormField';

interface RoomTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  roomType?: any;
  mode: 'create' | 'edit' | 'view' | null;
  amenityLabels: Record<string, string>;
  bedTypeLabels: Record<string, string>;
}

const DEFAULT_AMENITIES = [
  { id: 'wifi', label: 'WiFi miễn phí', category: 'technology' },
  { id: 'ac', label: 'Điều hòa', category: 'comfort' },
  { id: 'tv', label: 'TV màn hình phẳng', category: 'entertainment' },
  { id: 'minibar', label: 'Minibar', category: 'food-drink' },
  { id: 'balcony', label: 'Ban công', category: 'space' },
  { id: 'coffee-machine', label: 'Máy pha cà phê', category: 'food-drink' },
  { id: 'kitchenette', label: 'Bếp nhỏ', category: 'food-drink' },
  { id: 'living-area', label: 'Khu vực sinh hoạt', category: 'space' },
  { id: 'jacuzzi', label: 'Jacuzzi', category: 'luxury' },
  { id: 'butler-service', label: 'Dịch vụ quản gia', category: 'luxury' },
  { id: 'safe', label: 'Két an toàn', category: 'security' },
  { id: 'hairdryer', label: 'Máy sấy tóc', category: 'comfort' },
  { id: 'iron', label: 'Bàn ủi', category: 'comfort' },
  { id: 'workspace', label: 'Bàn làm việc', category: 'business' },
  { id: 'phone', label: 'Điện thoại', category: 'technology' },
  { id: 'room-service', label: 'Dịch vụ phòng 24/7', category: 'service' }
];

const BED_TYPES = [
  { value: 'single', label: 'Giường đơn' },
  { value: 'double', label: 'Giường đôi' },
  { value: 'queen', label: 'Giường Queen' },
  { value: 'king', label: 'Giường King' },
  { value: 'multiple', label: 'Nhiều giường' }
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Tạm ngưng' },
  { value: 'maintenance', label: 'Bảo trì' }
];

export function RoomTypeDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  roomType, 
  mode,
  amenityLabels,
  bedTypeLabels
}: RoomTypeDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    nameVn: '',
    description: '',
    descriptionVn: '',
    basePrice: '',
    maxOccupancy: '',
    bedType: 'double',
    roomSize: '',
    amenities: [] as string[],
    images: [] as string[],
    status: 'active',
    totalRooms: '',
    availableRooms: ''
  });

  const [imageInput, setImageInput] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'amenities' | 'images'>('basic');

  useEffect(() => {
    if (isOpen && roomType && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: roomType.name || '',
        nameVn: roomType.nameVn || '',
        description: roomType.description || '',
        descriptionVn: roomType.descriptionVn || '',
        basePrice: roomType.basePrice?.toString() || '',
        maxOccupancy: roomType.maxOccupancy?.toString() || '',
        bedType: roomType.bedType || 'double',
        roomSize: roomType.roomSize?.toString() || '',
        amenities: roomType.amenities || [],
        images: roomType.images || [],
        status: roomType.status || 'active',
        totalRooms: roomType.totalRooms?.toString() || '',
        availableRooms: roomType.availableRooms?.toString() || ''
      });
    } else if (isOpen && mode === 'create') {
      setFormData({
        name: '',
        nameVn: '',
        description: '',
        descriptionVn: '',
        basePrice: '',
        maxOccupancy: '2',
        bedType: 'double',
        roomSize: '',
        amenities: ['wifi', 'ac', 'tv'],
        images: [],
        status: 'active',
        totalRooms: '',
        availableRooms: ''
      });
    }
    setActiveTab('basic');
  }, [isOpen, roomType, mode]);

  const handleFormChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    if (mode === 'view') return;
    
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleAddImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    if (mode === 'view') return;
    
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }));
  };

  const handleSave = () => {
    const saveData = {
      ...formData,
      basePrice: parseFloat(formData.basePrice) || 0,
      maxOccupancy: parseInt(formData.maxOccupancy) || 2,
      roomSize: parseFloat(formData.roomSize) || 0,
      totalRooms: parseInt(formData.totalRooms) || 0,
      availableRooms: parseInt(formData.availableRooms) || 0
    };

    onSave(saveData);
  };

  const isReadOnly = mode === 'view';

  if (!isOpen) return null;

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Thêm loại phòng mới';
      case 'edit': return 'Chỉnh sửa loại phòng';
      case 'view': return 'Chi tiết loại phòng';
      default: return 'Loại phòng';
    }
  };

  const tabs = [
    { id: 'basic', label: 'Thông tin cơ bản', icon: BedIcon },
    { id: 'amenities', label: 'Tiện nghi', icon: CheckIcon },
    { id: 'images', label: 'Hình ảnh', icon: ImageIcon }
  ];

  const groupedAmenities = DEFAULT_AMENITIES.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, typeof DEFAULT_AMENITIES>);
  const categoryLabels: Record<string, string> = {
    technology: 'Công nghệ',
    comfort: 'Tiện nghi',
    entertainment: 'Giải trí',
    'food-drink': 'Ăn uống',
    space: 'Không gian',
    luxury: 'Hạng sang',
    security: 'An ninh',
    business: 'Kinh doanh',
    service: 'Dịch vụ'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BedIcon className="w-5 h-5 text-blue-600" />
            {getTitle()}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Đóng dialog"
            aria-label="Đóng dialog"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] dialog-scroll">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Tên tiếng Anh"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Standard Room, Deluxe Suite..."
                  disabled={isReadOnly}
                  required
                />

                <FormField
                  label="Tên tiếng Việt"
                  name="nameVn"
                  type="text"
                  value={formData.nameVn}
                  onChange={handleFormChange}
                  placeholder="Phòng Tiêu Chuẩn, Suite Cao Cấp..."
                  disabled={isReadOnly}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Mô tả tiếng Anh"
                  name="description"
                  type="textarea"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe the room type in English..."
                  rows={4}
                  disabled={isReadOnly}
                />

                <FormField
                  label="Mô tả tiếng Việt"
                  name="descriptionVn"
                  type="textarea"
                  value={formData.descriptionVn}
                  onChange={handleFormChange}
                  placeholder="Mô tả loại phòng bằng tiếng Việt..."
                  rows={4}
                  disabled={isReadOnly}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  label="Giá cơ bản (VND)"
                  name="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={handleFormChange}
                  placeholder="1200000"
                  icon={<CurrencyIcon className="w-4 h-4" />}
                  disabled={isReadOnly}
                  required
                />

                <FormField
                  label="Sức chứa tối đa"
                  name="maxOccupancy"         
                  type="number"
                  value={formData.maxOccupancy}
                  onChange={handleFormChange}
                  min="1"
                  max="10"
                  icon={<UsersIcon className="w-4 h-4" />}
                  disabled={isReadOnly}
                  required
                />

                <FormField
                  label="Diện tích (m²)"
                  name="roomSize"
                  type="number"
                  value={formData.roomSize}
                  onChange={handleFormChange}
                  placeholder="25"
                  min="1"
                  disabled={isReadOnly}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  label="Loại giường"
                  name="bedType"
                  type="select"
                  value={formData.bedType}
                  onChange={handleFormChange}
                  options={BED_TYPES}
                  disabled={isReadOnly}
                />

                <FormField
                  label="Tổng số phòng"
                  name="totalRooms"
                  type="number"
                  value={formData.totalRooms}
                  onChange={handleFormChange}
                  placeholder="10"
                  min="1"
                  disabled={isReadOnly}
                  required
                />

                <FormField
                  label="Số phòng có sẵn"
                  name="availableRooms"
                  type="number"
                  value={formData.availableRooms}
                  onChange={handleFormChange}
                  placeholder="8"
                  min="0"
                  max={formData.totalRooms}
                  disabled={isReadOnly}
                  required
                />
              </div>

              <FormField
                label="Trạng thái"
                name="status"
                type="select"
                value={formData.status}
                onChange={handleFormChange}
                options={STATUS_OPTIONS}
                disabled={isReadOnly}
              />
            </div>
          )}

          {activeTab === 'amenities' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Chọn tiện nghi</h3>
                <div className="text-sm text-gray-600">
                  Đã chọn: {formData.amenities.length} tiện nghi
                </div>
              </div>

              {Object.entries(groupedAmenities).map(([category, amenities]) => (
                <div key={category} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-gray-800 border-b pb-2">
                    {categoryLabels[category]} ({amenities.filter(a => formData.amenities.includes(a.id)).length}/{amenities.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {amenities.map(amenity => (
                      <label
                        key={amenity.id}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.amenities.includes(amenity.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity.id)}
                          onChange={() => handleAmenityToggle(amenity.id)}
                          disabled={isReadOnly}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium">{amenity.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Hình ảnh phòng</h3>
                <div className="text-sm text-gray-600">
                  {formData.images.length} hình ảnh
                </div>
              </div>

              {!isReadOnly && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">                <div className="text-center">
                  <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Thêm hình ảnh
                  </h4>
                    <p className="text-gray-600 mb-4">
                      Thêm URL hình ảnh hoặc tải lên từ máy tính
                    </p>
                    
                    <div className="flex gap-2 max-w-md mx-auto">
                      <input
                        type="url"
                        placeholder="https://example.com/room-image.jpg"
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />                      <button
                        onClick={handleAddImage}
                        disabled={!imageInput.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Thêm hình ảnh"
                        aria-label="Thêm hình ảnh"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {formData.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`Room image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="60" viewBox="0 0 100 60"><rect width="100" height="60" fill="%23f3f4f6"/><text x="50" y="30" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="10">No Image</text></svg>';
                          }}
                        />
                      </div>
                      {!isReadOnly && (                        <button
                          onClick={() => handleRemoveImage(imageUrl)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          title="Xóa hình ảnh này"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </button>
                      )}
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded truncate">
                          Hình {index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg mb-2">Chưa có hình ảnh</p>
                  <p className="text-sm">
                    {isReadOnly 
                      ? 'Loại phòng này chưa có hình ảnh nào'
                      : 'Thêm hình ảnh để khách hàng có thể xem trước phòng'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isReadOnly ? 'Đóng' : 'Hủy'}
          </button>
          {!isReadOnly && (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <CheckIcon className="w-4 h-4" />
              {mode === 'create' ? 'Tạo loại phòng' : 'Lưu thay đổi'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
