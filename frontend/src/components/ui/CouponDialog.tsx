'use client';

import { useState, useEffect } from 'react';
import {
  XIcon,
  TagIcon,
  PercentIcon,
  GiftIcon,
  ClockIcon,
  UsersIcon,
  CalendarIcon,
  CurrencyIcon
} from '@/components/icons/HotelIcons';

interface CouponData {
  id?: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'expired';
  applicableRoomTypes: string[];
  customerType: 'all' | 'new' | 'returning' | 'vip';
  usedCount?: number;
  createdAt?: string;
  createdBy?: string;
}

interface CouponDialogProps {
  coupon?: CouponData | null;
  onClose: () => void;
  onSave: (couponData: CouponData) => void;
}

const roomTypes = [
  { value: 'all', label: 'Tất cả loại phòng' },
  { value: 'standard', label: 'Phòng tiêu chuẩn' },
  { value: 'deluxe', label: 'Phòng deluxe' },
  { value: 'suite', label: 'Phòng suite' },
  { value: 'presidential', label: 'Phòng tổng thống' }
];

const customerTypes = [
  { value: 'all', label: 'Tất cả khách hàng' },
  { value: 'new', label: 'Khách hàng mới' },
  { value: 'returning', label: 'Khách hàng cũ' },
  { value: 'vip', label: 'Khách VIP' }
];

export const CouponDialog: React.FC<CouponDialogProps> = ({ coupon, onClose, onSave }) => {
  const [formData, setFormData] = useState<CouponData>({
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: 0,
    minOrderValue: 0,
    maxDiscount: null,
    usageLimit: null,
    startDate: '',
    endDate: '',
    status: 'active',
    applicableRoomTypes: ['all'],
    customerType: 'all'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        minOrderValue: coupon.minOrderValue,
        maxDiscount: coupon.maxDiscount,
        usageLimit: coupon.usageLimit,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        status: coupon.status,
        applicableRoomTypes: coupon.applicableRoomTypes,
        customerType: coupon.customerType
      });
    }
  }, [coupon]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Mã giảm giá không được để trống';
    } else if (formData.code.length < 3) {
      newErrors.code = 'Mã giảm giá phải có ít nhất 3 ký tự';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Tên mã giảm giá không được để trống';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    }

    if (formData.value <= 0) {
      newErrors.value = 'Giá trị giảm phải lớn hơn 0';
    } else if (formData.type === 'percentage' && formData.value > 100) {
      newErrors.value = 'Phần trăm giảm không được vượt quá 100%';
    }

    if (formData.minOrderValue < 0) {
      newErrors.minOrderValue = 'Giá trị đơn hàng tối thiểu không được âm';
    }

    if (formData.maxDiscount !== null && formData.maxDiscount <= 0) {
      newErrors.maxDiscount = 'Giảm tối đa phải lớn hơn 0 hoặc để trống';
    }

    if (formData.usageLimit !== null && formData.usageLimit <= 0) {
      newErrors.usageLimit = 'Giới hạn sử dụng phải lớn hơn 0 hoặc để trống';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Ngày bắt đầu không được để trống';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Ngày kết thúc không được để trống';
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof CouponData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateCode = () => {
    const prefix = formData.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
    const suffix = Math.random().toString(36).substr(2, 4).toUpperCase();
    const code = `${prefix}${suffix}`;
    handleInputChange('code', code);
  };

  const tabs = [
    { id: 0, name: 'Thông tin cơ bản', icon: TagIcon },
    { id: 1, name: 'Điều kiện áp dụng', icon: ClockIcon },
    { id: 2, name: 'Khách hàng & Phòng', icon: UsersIcon }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
              <TagIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {coupon ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
              </h2>
              <p className="text-gray-600">
                {coupon ? 'Cập nhật thông tin mã giảm giá' : 'Tạo mã giảm giá cho khách hàng'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Đóng"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="dialog-scroll overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {/* Tab 1: Thông tin cơ bản */}
            {activeTab === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mã giảm giá */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã giảm giá *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                        placeholder="Nhập mã giảm giá"
                        className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                          errors.code ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={generateCode}
                        className="px-4 py-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors"
                        title="Tạo mã tự động"
                      >
                        Tạo tự động
                      </button>
                    </div>
                    {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                  </div>

                  {/* Tên mã giảm giá */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên mã giảm giá *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nhập tên mã giảm giá"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                </div>

                {/* Mô tả */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Nhập mô tả chi tiết về mã giảm giá"
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Loại và giá trị giảm */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại giảm giá
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('type', 'percentage')}
                        className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl transition-all ${
                          formData.type === 'percentage'
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <PercentIcon className="w-4 h-4" />
                        Phần trăm
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('type', 'fixed')}
                        className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl transition-all ${
                          formData.type === 'fixed'
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <CurrencyIcon className="w-4 h-4" />
                        Số tiền
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá trị giảm *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.value || ''}
                        onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                        placeholder={formData.type === 'percentage' ? 'Nhập % giảm' : 'Nhập số tiền'}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                          errors.value ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {formData.type === 'percentage' ? '%' : 'VND'}
                      </div>
                    </div>
                    {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
                  </div>
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'active', label: 'Hoạt động', color: 'green' },
                      { value: 'paused', label: 'Tạm dừng', color: 'yellow' },
                      { value: 'expired', label: 'Hết hạn', color: 'red' }
                    ].map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => handleInputChange('status', status.value)}
                        className={`px-4 py-3 border rounded-xl transition-all ${
                          formData.status === status.value
                            ? `border-${status.color}-500 bg-${status.color}-50 text-${status.color}-700`
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Điều kiện áp dụng */}
            {activeTab === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Giá trị đơn hàng tối thiểu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá trị đơn hàng tối thiểu
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.minOrderValue || ''}
                        onChange={(e) => handleInputChange('minOrderValue', parseFloat(e.target.value) || 0)}
                        placeholder="Nhập giá trị tối thiểu"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                          errors.minOrderValue ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        VND
                      </div>
                    </div>
                    {errors.minOrderValue && <p className="text-red-500 text-sm mt-1">{errors.minOrderValue}</p>}
                  </div>

                  {/* Giảm tối đa */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giảm tối đa (để trống nếu không giới hạn)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.maxDiscount || ''}
                        onChange={(e) => handleInputChange('maxDiscount', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="Nhập giảm tối đa"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                          errors.maxDiscount ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={formData.type === 'fixed'}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        VND
                      </div>
                    </div>
                    {errors.maxDiscount && <p className="text-red-500 text-sm mt-1">{errors.maxDiscount}</p>}
                    {formData.type === 'fixed' && (
                      <p className="text-sm text-gray-500 mt-1">Không áp dụng cho giảm giá cố định</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Giới hạn số lần sử dụng */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới hạn số lần sử dụng (để trống nếu không giới hạn)
                    </label>
                    <input
                      type="number"
                      value={formData.usageLimit || ''}
                      onChange={(e) => handleInputChange('usageLimit', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Nhập số lần sử dụng tối đa"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                        errors.usageLimit ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.usageLimit && <p className="text-red-500 text-sm mt-1">{errors.usageLimit}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ngày bắt đầu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày bắt đầu *
                    </label>                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                        errors.startDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      title="Chọn ngày bắt đầu hiệu lực"
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>

                  {/* Ngày kết thúc */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày kết thúc *
                    </label>                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                        errors.endDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      title="Chọn ngày kết thúc hiệu lực"
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Khách hàng & Phòng */}
            {activeTab === 2 && (
              <div className="space-y-6">
                {/* Loại khách hàng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Áp dụng cho loại khách hàng
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {customerTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('customerType', type.value)}
                        className={`px-4 py-3 border rounded-xl transition-all text-sm ${
                          formData.customerType === type.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loại phòng áp dụng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Áp dụng cho loại phòng
                  </label>
                  <div className="space-y-2">
                    {roomTypes.map((room) => (
                      <label key={room.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.applicableRoomTypes.includes(room.value)}
                          onChange={(e) => {
                            if (room.value === 'all') {
                              handleInputChange('applicableRoomTypes', e.target.checked ? ['all'] : []);
                            } else {
                              const newTypes = e.target.checked
                                ? [...formData.applicableRoomTypes.filter(t => t !== 'all'), room.value]
                                : formData.applicableRoomTypes.filter(t => t !== room.value);
                              handleInputChange('applicableRoomTypes', newTypes);
                            }
                          }}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">{room.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {coupon ? 'Cập nhật' : 'Tạo mã giảm giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
