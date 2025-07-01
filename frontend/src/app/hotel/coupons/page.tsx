'use client';

import { useState } from 'react';
import { HotelLayout } from '@/components/layout';
import { CouponDialog } from '@/components/ui';
import {
  TagIcon,
  PlusIcon,
  SearchIcon,
  MoreHorizontalIcon,
  TrashIcon,
  CopyIcon,
  EditIcon,
  EyeIcon,
  PercentIcon,
  GiftIcon,
  ClockIcon,
  TicketIcon,
  StarIcon
} from '@/components/icons/HotelIcons';

// Mock data cho demo
const mockCoupons = [
  {
    id: '1',
    code: 'WELCOME2025',
    name: 'Chào mừng khách hàng mới',
    description: 'Giảm giá cho khách hàng đặt phòng lần đầu',
    type: 'percentage',
    value: 15,
    minOrderValue: 1000000,
    maxDiscount: 500000,
    usageLimit: 100,
    usedCount: 23,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'active',
    applicableRoomTypes: ['all'],
    customerType: 'new',
    createdAt: '2025-01-15T10:00:00',
    createdBy: 'Admin'
  },
  {
    id: '2',
    code: 'SUMMER50',
    name: 'Khuyến mãi mùa hè',
    description: 'Giảm 50.000 VND cho đặt phòng trong mùa hè',
    type: 'fixed',
    value: 50000,
    minOrderValue: 800000,
    maxDiscount: null,
    usageLimit: 500,
    usedCount: 156,
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'active',
    applicableRoomTypes: ['standard', 'deluxe'],
    customerType: 'all',
    createdAt: '2025-05-20T14:30:00',
    createdBy: 'Manager'
  },
  {
    id: '3',
    code: 'VIP25',
    name: 'Ưu đãi khách VIP',
    description: 'Giảm 25% cho khách hàng VIP',
    type: 'percentage',
    value: 25,
    minOrderValue: 2000000,
    maxDiscount: 1000000,
    usageLimit: 50,
    usedCount: 12,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'active',
    applicableRoomTypes: ['suite', 'presidential'],
    customerType: 'vip',
    createdAt: '2025-01-10T09:15:00',
    createdBy: 'Admin'
  },
  {
    id: '4',
    code: 'BIRTHDAY2024',
    name: 'Sinh nhật khách sạn 2024',
    description: 'Mã giảm giá kỷ niệm sinh nhật khách sạn',
    type: 'percentage',
    value: 30,
    minOrderValue: 1500000,
    maxDiscount: 800000,
    usageLimit: 200,
    usedCount: 200,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    status: 'expired',
    applicableRoomTypes: ['all'],
    customerType: 'all',
    createdAt: '2024-11-25T16:45:00',
    createdBy: 'Marketing'
  },
  {
    id: '5',
    code: 'WEEKEND10',
    name: 'Cuối tuần vui vẻ',
    description: 'Giảm 10% cho đặt phòng cuối tuần',
    type: 'percentage',
    value: 10,
    minOrderValue: 500000,
    maxDiscount: 200000,
    usageLimit: 1000,
    usedCount: 89,
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    status: 'paused',
    applicableRoomTypes: ['standard'],
    customerType: 'all',
    createdAt: '2025-05-25T11:20:00',
    createdBy: 'Staff'
  }
];

const couponTypes = [
  { value: 'all', label: 'Tất cả loại', icon: TagIcon },
  { value: 'percentage', label: 'Phần trăm', icon: PercentIcon },
  { value: 'fixed', label: 'Số tiền cố định', icon: GiftIcon }
];

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái', color: 'gray' },
  { value: 'active', label: 'Đang hoạt động', color: 'green' },
  { value: 'paused', label: 'Tạm dừng', color: 'yellow' },
  { value: 'expired', label: 'Hết hạn', color: 'red' }
];

const customerTypes = [
  { value: 'all', label: 'Tất cả khách hàng' },
  { value: 'new', label: 'Khách hàng mới' },
  { value: 'returning', label: 'Khách hàng cũ' },
  { value: 'vip', label: 'Khách VIP' }
];

export default function CouponsPage() {  const [coupons, setCoupons] = useState(mockCoupons);
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showDialog, setShowDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  // Filtered and sorted coupons
  const filteredCoupons = coupons
    .filter(coupon => {
      const matchesSearch = 
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || coupon.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        if (sortOrder === 'asc') {
        return (aValue || 0) > (bValue || 0) ? 1 : -1;
      } else {
        return (aValue || 0) < (bValue || 0) ? 1 : -1;
      }
    });

  // Statistics
  const stats = {
    total: coupons.length,
    active: coupons.filter(c => c.status === 'active').length,
    paused: coupons.filter(c => c.status === 'paused').length,
    expired: coupons.filter(c => c.status === 'expired').length,
    totalUsed: coupons.reduce((sum, c) => sum + c.usedCount, 0),
    averageDiscount: Math.round(coupons.reduce((sum, c) => {
      if (c.type === 'percentage') return sum + c.value;
      return sum + (c.value / 10000);
    }, 0) / coupons.length)
  };

  const handleSelectCoupon = (couponId: string) => {
    setSelectedCoupons(prev => 
      prev.includes(couponId) 
        ? prev.filter(id => id !== couponId)
        : [...prev, couponId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCoupons.length === filteredCoupons.length) {
      setSelectedCoupons([]);
    } else {
      setSelectedCoupons(filteredCoupons.map(c => c.id));
    }
  };

  const handleDeleteCoupon = (couponId: string) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
    setSelectedCoupons(prev => prev.filter(id => id !== couponId));
  };

  const handleDuplicateCoupon = (coupon: any) => {
    const newCoupon = {
      ...coupon,
      id: Date.now().toString(),
      code: `${coupon.code}_COPY`,
      name: `${coupon.name} (Sao chép)`,
      usedCount: 0,
      status: 'paused',
      createdAt: new Date().toISOString(),
      createdBy: 'Current User'
    };
    setCoupons(prev => [newCoupon, ...prev]);
  };

  const getStatusColor = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      expired: 'bg-red-100 text-red-800 border-red-200'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatValue = (coupon: any) => {
    if (coupon.type === 'percentage') {
      return `${coupon.value}%`;
    } else {
      return `${coupon.value.toLocaleString('vi-VN')} VND`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getUsagePercentage = (coupon: any) => {
    return coupon.usageLimit ? Math.round((coupon.usedCount / coupon.usageLimit) * 100) : 0;
  };

  return (
    <HotelLayout>
      <div className="p-6 max-w-full content-scroll">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
                  <TicketIcon className="w-6 h-6" />
                </div>
                Quản lý mã giảm giá
              </h1>
              <p className="text-gray-600 mt-2">
                Tạo và quản lý các mã giảm giá, chương trình khuyến mãi cho khách sạn
              </p>
            </div>
            <button
              onClick={() => {
                setEditingCoupon(null);
                setShowDialog(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="w-5 h-5" />
              Tạo mã giảm giá
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Tổng số mã</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <TagIcon className="w-5 h-5 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Đang hoạt động</p>
                  <p className="text-3xl font-bold">{stats.active}</p>
                </div>
                <StarIcon className="w-5 h-5 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Tạm dừng</p>
                  <p className="text-3xl font-bold">{stats.paused}</p>
                </div>
                <ClockIcon className="w-5 h-5 text-yellow-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Hết hạn</p>
                  <p className="text-3xl font-bold">{stats.expired}</p>
                </div>
                <TrashIcon className="w-5 h-5 text-red-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Lượt sử dụng</p>
                  <p className="text-3xl font-bold">{stats.totalUsed}</p>
                </div>
                <GiftIcon className="w-5 h-5 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">Giảm TB</p>
                  <p className="text-3xl font-bold">{stats.averageDiscount}%</p>
                </div>
                <PercentIcon className="w-5 h-5 text-pink-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã, tên hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="w-full lg:w-48">              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                title="Lọc theo loại mã giảm giá"
              >
                {couponTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                title="Lọc theo trạng thái mã giảm giá"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="w-full lg:w-48">              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                title="Sắp xếp danh sách mã giảm giá"
              >
                <option value="createdAt-desc">Mới nhất</option>
                <option value="createdAt-asc">Cũ nhất</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
                <option value="usedCount-desc">Nhiều lượt dùng nhất</option>
                <option value="usedCount-asc">Ít lượt dùng nhất</option>
                <option value="value-desc">Giá trị cao nhất</option>
                <option value="value-asc">Giá trị thấp nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCoupons.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-purple-800 font-medium">
                Đã chọn {selectedCoupons.length} mã giảm giá
              </span>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                  Xóa đã chọn
                </button>
                <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors">
                  Tạm dừng
                </button>
                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  Kích hoạt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Coupons List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">              <input
                type="checkbox"
                checked={selectedCoupons.length === filteredCoupons.length}
                onChange={handleSelectAll}
                className="mr-4 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                title="Chọn tất cả mã giảm giá"
              />
              <span className="text-sm font-medium text-gray-700">
                Hiển thị {filteredCoupons.length} trên tổng {coupons.length} mã giảm giá
              </span>
            </div>
          </div>

          {/* Coupons Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredCoupons.map(coupon => (
                <div
                  key={coupon.id}
                  className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">                      <input
                        type="checkbox"
                        checked={selectedCoupons.includes(coupon.id)}
                        onChange={() => handleSelectCoupon(coupon.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        title={`Chọn mã ${coupon.code}`}
                      />
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${coupon.type === 'percentage' ? 'bg-purple-100 text-purple-600' : 'bg-pink-100 text-pink-600'}`}>
                          {coupon.type === 'percentage' ? <PercentIcon /> : <GiftIcon />}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{coupon.code}</h3>
                          <p className="text-sm text-gray-600">{coupon.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(coupon.status)}`}>
                        {statusOptions.find(s => s.value === coupon.status)?.label}
                      </span>
                      <div className="relative">                        <button 
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Tùy chọn khác"
                        >
                          <MoreHorizontalIcon />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {coupon.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-purple-50 rounded-xl p-3">
                      <p className="text-xs text-purple-600 font-medium">Giá trị giảm</p>
                      <p className="text-lg font-bold text-purple-700">{formatValue(coupon)}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-xs text-blue-600 font-medium">Đơn tối thiểu</p>
                      <p className="text-lg font-bold text-blue-700">
                        {coupon.minOrderValue.toLocaleString('vi-VN')} VND
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Sử dụng</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-700">
                          {coupon.usedCount}/{coupon.usageLimit || '∞'}
                        </p>                        {coupon.usageLimit && (
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <div 
                              className={`bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ${getUsagePercentage(coupon) > 75 ? 'w-3/4' : getUsagePercentage(coupon) > 50 ? 'w-1/2' : getUsagePercentage(coupon) > 25 ? 'w-1/4' : 'w-1/12'}`}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Thời hạn</p>
                      <p className="text-sm font-semibold text-gray-700">
                        {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Tạo bởi {coupon.createdBy} • {formatDate(coupon.createdAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDuplicateCoupon(coupon)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sao chép mã"
                      >
                        <CopyIcon />
                      </button>
                      <button
                        onClick={() => {
                          setEditingCoupon(coupon);
                          setShowDialog(true);
                        }}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa mã"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredCoupons.length === 0 && (
            <div className="text-center py-12">
              <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy mã giảm giá</h3>
              <p className="text-gray-500 mb-4">Thử thay đổi bộ lọc hoặc tạo mã giảm giá mới</p>
              <button
                onClick={() => {
                  setEditingCoupon(null);
                  setShowDialog(true);
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Tạo mã giảm giá đầu tiên
              </button>
            </div>
          )}
        </div>

        {/* Coupon Dialog */}
        {showDialog && (
          <CouponDialog
            coupon={editingCoupon}
            onClose={() => {
              setShowDialog(false);
              setEditingCoupon(null);
            }}
            onSave={(couponData: any) => {
              if (editingCoupon) {
                setCoupons(prev => prev.map(c => 
                  c.id === editingCoupon.id 
                    ? { ...couponData, id: editingCoupon.id, createdAt: editingCoupon.createdAt, createdBy: editingCoupon.createdBy }
                    : c
                ));
              } else {
                const newCoupon = {
                  ...couponData,
                  id: Date.now().toString(),
                  usedCount: 0,
                  createdAt: new Date().toISOString(),
                  createdBy: 'Current User'
                };
                setCoupons(prev => [newCoupon, ...prev]);
              }
              setShowDialog(false);
              setEditingCoupon(null);
            }}
          />
        )}
      </div>
    </HotelLayout>
  );
}
