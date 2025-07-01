'use client';

import { useState } from 'react';
import FormField from '@/components/ui/FormField';
import { CalendarIcon, CurrencyIcon, ClockIcon } from '@/components/icons/HotelIcons';

interface PricingRule {
  id: string;
  name: string;
  description: string;
  roomTypeIds: string[];
  startDate: string;
  endDate: string;
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  priceType: 'fixed' | 'percentage' | 'add' | 'subtract';
  priceValue: number;
  priority: number;
  isActive: boolean;
  conditions?: {
    minNights?: number;
    maxNights?: number;
    advanceBooking?: number; // days
    guestCount?: { min?: number; max?: number };
  };
}

interface RoomType {
  id: string;
  name: string;
  basePrice: number;
}

interface BulkPricingFormProps {
  roomTypes: RoomType[];
  onSave: (rules: PricingRule[]) => void;
  onCancel: () => void;
  editingRule?: PricingRule | null;
}

const DAYS_OF_WEEK = [
  { id: 0, label: 'Chủ nhật', short: 'CN' },
  { id: 1, label: 'Thứ hai', short: 'T2' },
  { id: 2, label: 'Thứ ba', short: 'T3' },
  { id: 3, label: 'Thứ tư', short: 'T4' },
  { id: 4, label: 'Thứ năm', short: 'T5' },
  { id: 5, label: 'Thứ sáu', short: 'T6' },
  { id: 6, label: 'Thứ bảy', short: 'T7' },
];

const PRICE_TYPES = [
  { value: 'fixed', label: 'Giá cố định', description: 'Đặt giá cụ thể' },
  { value: 'percentage', label: 'Phần trăm', description: 'Tăng/giảm theo %' },
  { value: 'add', label: 'Cộng thêm', description: 'Cộng số tiền vào giá gốc' },
  { value: 'subtract', label: 'Trừ bớt', description: 'Trừ số tiền khỏi giá gốc' },
];

export const BulkPricingForm: React.FC<BulkPricingFormProps> = ({
  roomTypes,
  onSave,
  onCancel,
  editingRule
}) => {
  const [formData, setFormData] = useState<Partial<PricingRule>>({
    name: editingRule?.name || '',
    description: editingRule?.description || '',
    roomTypeIds: editingRule?.roomTypeIds || [],
    startDate: editingRule?.startDate || '',
    endDate: editingRule?.endDate || '',
    daysOfWeek: editingRule?.daysOfWeek || [],
    priceType: editingRule?.priceType || 'fixed',
    priceValue: editingRule?.priceValue || 0,
    priority: editingRule?.priority || 1,
    isActive: editingRule?.isActive ?? true,
    conditions: editingRule?.conditions || {},
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFormChange = (name: string, value: any) => {
    if (name.startsWith('conditions.')) {
      const conditionKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          [conditionKey]: value === '' ? undefined : value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRoomTypeToggle = (roomTypeId: string) => {
    setFormData(prev => ({
      ...prev,
      roomTypeIds: prev.roomTypeIds?.includes(roomTypeId)
        ? prev.roomTypeIds.filter(id => id !== roomTypeId)
        : [...(prev.roomTypeIds || []), roomTypeId]
    }));
  };

  const handleDayToggle = (day: number) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek?.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...(prev.daysOfWeek || []), day]
    }));
  };

  const handleSave = () => {
    const rule: PricingRule = {
      id: editingRule?.id || `rule-${Date.now()}`,
      name: formData.name!,
      description: formData.description!,
      roomTypeIds: formData.roomTypeIds!,
      startDate: formData.startDate!,
      endDate: formData.endDate!,
      daysOfWeek: formData.daysOfWeek!,
      priceType: formData.priceType!,
      priceValue: formData.priceValue!,
      priority: formData.priority!,
      isActive: formData.isActive!,
      conditions: formData.conditions,
    };

    onSave([rule]);
  };

  const getPricePreview = (roomType: RoomType) => {
    if (!formData.priceValue) return roomType.basePrice;

    switch (formData.priceType) {
      case 'fixed':
        return formData.priceValue;
      case 'percentage':
        return roomType.basePrice * (1 + formData.priceValue / 100);
      case 'add':
        return roomType.basePrice + formData.priceValue;
      case 'subtract':
        return Math.max(0, roomType.basePrice - formData.priceValue);
      default:
        return roomType.basePrice;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Tên quy tắc"
          name="name"
          value={formData.name || ''}
          onChange={handleFormChange}
          required
          placeholder="Ví dụ: Giá cuối tuần mùa hè"
          hint="Đặt tên dễ nhận biết cho quy tắc giá"
        />

        <FormField
          label="Mô tả"
          name="description"
          value={formData.description || ''}
          onChange={handleFormChange}
          placeholder="Mô tả chi tiết về quy tắc này"
        />
      </div>

      {/* Room Types Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-deep-navy">
          Loại phòng áp dụng <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {roomTypes.map(roomType => (
            <label key={roomType.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-pearl-white transition-colors">
              <input
                type="checkbox"
                checked={formData.roomTypeIds?.includes(roomType.id) || false}
                onChange={() => handleRoomTypeToggle(roomType.id)}
                className="text-ocean-blue focus:ring-ocean-blue"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-deep-navy">{roomType.name}</div>
                <div className="text-xs text-gray-500">{roomType.basePrice.toLocaleString('vi-VN')} VNĐ</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Ngày bắt đầu"
          name="startDate"
          type="text"
          value={formData.startDate || ''}
          onChange={handleFormChange}
          required
          placeholder="YYYY-MM-DD"
          icon={<CalendarIcon className="w-4 h-4" />}
        />

        <FormField
          label="Ngày kết thúc"
          name="endDate"
          type="text"
          value={formData.endDate || ''}
          onChange={handleFormChange}
          required
          placeholder="YYYY-MM-DD"
          icon={<CalendarIcon className="w-4 h-4" />}
        />
      </div>

      {/* Days of Week */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-deep-navy">
          Ngày trong tuần áp dụng
        </label>
        <div className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map(day => (
            <button
              key={day.id}
              type="button"
              onClick={() => handleDayToggle(day.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                formData.daysOfWeek?.includes(day.id)
                  ? 'bg-ocean-blue text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {day.short}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, daysOfWeek: [0, 1, 2, 3, 4, 5, 6] }))}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-seafoam-green/10 text-seafoam-green hover:bg-seafoam-green/20 transition-colors"
          >
            Tất cả
          </button>
        </div>
      </div>

      {/* Pricing Configuration */}
      <div className="space-y-4">
        <FormField
          label="Loại điều chỉnh giá"
          name="priceType"
          type="select"
          value={formData.priceType || 'fixed'}
          onChange={handleFormChange}
          required
          options={PRICE_TYPES.map(type => ({ value: type.value, label: type.label }))}
          icon={<CurrencyIcon className="w-4 h-4" />}
        />

        <FormField
          label={
            formData.priceType === 'fixed' ? 'Giá mới (VNĐ)' :
            formData.priceType === 'percentage' ? 'Phần trăm thay đổi (%)' :
            'Số tiền (VNĐ)'
          }
          name="priceValue"
          type="number"
          value={formData.priceValue?.toString() || ''}
          onChange={handleFormChange}
          required
          placeholder={
            formData.priceType === 'fixed' ? 'Nhập giá cố định' :
            formData.priceType === 'percentage' ? 'Nhập % (số âm để giảm giá)' :
            'Nhập số tiền'
          }
          icon={<CurrencyIcon className="w-4 h-4" />}
        />

        <FormField
          label="Độ ưu tiên"
          name="priority"
          type="number"
          value={formData.priority?.toString() || '1'}
          onChange={handleFormChange}
          hint="Số càng cao càng ưu tiên. Dùng khi có nhiều quy tắc chồng lặp."
        />
      </div>

      {/* Price Preview */}
      {formData.roomTypeIds && formData.roomTypeIds.length > 0 && formData.priceValue && (
        <div className="bg-pearl-white p-4 rounded-lg">
          <h4 className="text-sm font-medium text-deep-navy mb-3">Xem trước giá</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {roomTypes
              .filter(rt => formData.roomTypeIds!.includes(rt.id))
              .map(roomType => {
                const newPrice = getPricePreview(roomType);
                const isIncrease = newPrice > roomType.basePrice;
                const change = newPrice - roomType.basePrice;
                
                return (
                  <div key={roomType.id} className="bg-white p-3 rounded-lg">
                    <div className="text-sm font-medium text-deep-navy">{roomType.name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500 line-through">
                        {roomType.basePrice.toLocaleString('vi-VN')} VNĐ
                      </span>
                      <span className={`text-xs font-medium ${
                        isIncrease ? 'text-coral-pink' : change < 0 ? 'text-seafoam-green' : 'text-gray-600'
                      }`}>
                        {change > 0 ? '+' : ''}{change.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-deep-navy">
                      {newPrice.toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Advanced Conditions */}
      <div className="border-t pt-6">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-ocean-blue hover:text-ocean-blue/80 transition-colors"
        >
          <ClockIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Điều kiện nâng cao</span>
          <svg 
            className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Số đêm tối thiểu"
              name="conditions.minNights"
              type="number"
              value={formData.conditions?.minNights?.toString() || ''}
              onChange={handleFormChange}
              placeholder="Không giới hạn"
              hint="Áp dụng khi đặt ít nhất X đêm"
            />

            <FormField
              label="Số đêm tối đa"
              name="conditions.maxNights"
              type="number"
              value={formData.conditions?.maxNights?.toString() || ''}
              onChange={handleFormChange}
              placeholder="Không giới hạn"
              hint="Áp dụng khi đặt tối đa X đêm"
            />

            <FormField
              label="Đặt trước (ngày)"
              name="conditions.advanceBooking"
              type="number"
              value={formData.conditions?.advanceBooking?.toString() || ''}
              onChange={handleFormChange}
              placeholder="Không yêu cầu"
              hint="Áp dụng khi đặt trước ít nhất X ngày"
            />

            <FormField
              label="Số khách tối thiểu"
              name="conditions.guestCount.min"
              type="number"
              value={formData.conditions?.guestCount?.min?.toString() || ''}
              onChange={handleFormChange}
              placeholder="Không giới hạn"
              hint="Áp dụng khi có ít nhất X khách"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!formData.name || !formData.startDate || !formData.endDate || !formData.roomTypeIds?.length}
          className="px-4 py-2 bg-ocean-blue text-white hover:bg-ocean-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {editingRule ? 'Cập nhật' : 'Tạo quy tắc'}
        </button>
      </div>
    </div>
  );
};
