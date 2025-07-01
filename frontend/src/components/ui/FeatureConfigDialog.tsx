'use client';

import { useState } from 'react';
import FormField from '@/components/ui/FormField';
import { 
  CogIcon, 
  XIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
  EditIcon,
  CalendarIcon,
  CurrencyIcon,
  UsersIcon
} from '@/components/icons/HotelIcons';

interface FeatureConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  feature: {
    id: string;
    name: string;
    description: string;
    category: string;
    config: Record<string, any>;
  } | null;
}

interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'date' | 'time' | 'array' | 'object';
  description?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  required?: boolean;
  validation?: (value: any) => string | null;
  defaultValue?: any;
}

const FEATURE_CONFIG_SCHEMAS: Record<string, ConfigField[]> = {
  'online-booking': [
    {
      key: 'allowCancellation',
      label: 'Cho phép hủy đặt phòng',
      type: 'boolean',
      description: 'Khách hàng có thể hủy đặt phòng online',
      defaultValue: true
    },
    {
      key: 'cancellationPeriod',
      label: 'Thời gian hủy (giờ)',
      type: 'number',
      description: 'Số giờ trước khi check-in mà khách có thể hủy',
      min: 1,
      max: 168,
      defaultValue: 24
    },
    {
      key: 'requireDeposit',
      label: 'Yêu cầu đặt cọc',
      type: 'boolean',
      description: 'Bắt buộc khách hàng đặt cọc khi booking',
      defaultValue: true
    },
    {
      key: 'depositPercentage',
      label: 'Phần trăm đặt cọc (%)',
      type: 'number',
      description: 'Tỷ lệ phần trăm tiền cọc so với tổng giá trị',
      min: 5,
      max: 100,
      defaultValue: 20
    },
    {
      key: 'maxAdvanceBooking',
      label: 'Đặt trước tối đa (ngày)',
      type: 'number',
      description: 'Số ngày tối đa có thể đặt trước',
      min: 1,
      max: 365,
      defaultValue: 90
    },
    {
      key: 'bookingChannels',
      label: 'Kênh đặt phòng',
      type: 'array',
      description: 'Các kênh cho phép đặt phòng',
      options: [
        { value: 'website', label: 'Website' },
        { value: 'mobile', label: 'Ứng dụng di động' },
        { value: 'phone', label: 'Điện thoại' },
        { value: 'email', label: 'Email' },
        { value: 'walkIn', label: 'Tại chỗ' }
      ],
      defaultValue: ['website', 'mobile', 'phone']
    }
  ],
  'dynamic-pricing': [
    {
      key: 'enabled',
      label: 'Kích hoạt định giá động',
      type: 'boolean',
      description: 'Tự động điều chỉnh giá theo thuật toán',
      defaultValue: false
    },
    {
      key: 'maxIncrease',
      label: 'Tăng giá tối đa (%)',
      type: 'number',
      description: 'Tỷ lệ tăng giá tối đa so với giá gốc',
      min: 0,
      max: 200,
      defaultValue: 50
    },
    {
      key: 'maxDecrease',
      label: 'Giảm giá tối đa (%)',
      type: 'number',
      description: 'Tỷ lệ giảm giá tối đa so với giá gốc',
      min: 0,
      max: 50,
      defaultValue: 20
    },
    {
      key: 'occupancyThreshold',
      label: 'Ngưỡng công suất (%)',
      type: 'number',
      description: 'Công suất khách sạn để bắt đầu tăng giá',
      min: 50,
      max: 95,
      defaultValue: 80
    },
    {
      key: 'seasonalAdjustment',
      label: 'Điều chỉnh theo mùa',
      type: 'boolean',
      description: 'Áp dụng hệ số giá theo mùa',
      defaultValue: true
    },
    {
      key: 'demandBasedPricing',
      label: 'Định giá theo nhu cầu',
      type: 'boolean',
      description: 'Điều chỉnh giá dựa trên mức độ tìm kiếm',
      defaultValue: false
    },
    {
      key: 'updateFrequency',
      label: 'Tần suất cập nhật',
      type: 'select',
      description: 'Tần suất cập nhật giá tự động',
      options: [
        { value: 'hourly', label: 'Theo giờ' },
        { value: 'daily', label: 'Hàng ngày' },
        { value: 'weekly', label: 'Hàng tuần' }
      ],
      defaultValue: 'daily'
    }
  ],
  'loyalty-program': [
    {
      key: 'enabled',
      label: 'Kích hoạt chương trình',
      type: 'boolean',
      description: 'Bật/tắt chương trình khách hàng thân thiết',
      defaultValue: true
    },
    {
      key: 'pointsPerBooking',
      label: 'Điểm mỗi lần đặt',
      type: 'number',
      description: 'Số điểm thưởng cho mỗi lần đặt phòng',
      min: 10,
      max: 1000,
      defaultValue: 100
    },
    {
      key: 'pointsPerAmount',
      label: 'Điểm mỗi 1000 VND',
      type: 'number',
      description: 'Số điểm thưởng cho mỗi 1000 VND chi tiêu',
      min: 1,
      max: 10,
      defaultValue: 1
    },
    {
      key: 'redemptionRate',
      label: 'Tỷ lệ quy đổi điểm',
      type: 'number',
      description: 'Giá trị VND của 1 điểm khi đổi thưởng',
      min: 0.001,
      max: 1,
      defaultValue: 0.01
    },
    {
      key: 'tierLevels',
      label: 'Cấp độ thành viên',
      type: 'array',
      description: 'Các cấp độ trong chương trình',
      options: [
        { value: 'Bronze', label: 'Đồng' },
        { value: 'Silver', label: 'Bạc' },
        { value: 'Gold', label: 'Vàng' },
        { value: 'Platinum', label: 'Bạch kim' },
        { value: 'Diamond', label: 'Kim cương' }
      ],
      defaultValue: ['Bronze', 'Silver', 'Gold', 'Platinum']
    },
    {
      key: 'tierBenefits',
      label: 'Ưu đãi theo cấp',
      type: 'boolean',
      description: 'Áp dụng ưu đãi khác nhau theo cấp độ',
      defaultValue: true
    },
    {
      key: 'pointsExpiry',
      label: 'Điểm hết hạn (tháng)',
      type: 'number',
      description: 'Số tháng sau khi điểm hết hạn (0 = không hết hạn)',
      min: 0,
      max: 60,
      defaultValue: 24
    }
  ],
  'automated-emails': [
    {
      key: 'bookingConfirmation',
      label: 'Email xác nhận đặt phòng',
      type: 'boolean',
      description: 'Gửi email xác nhận sau khi đặt phòng',
      defaultValue: true
    },
    {
      key: 'reminderEmails',
      label: 'Email nhắc nhở',
      type: 'boolean',
      description: 'Gửi email nhắc nhở trước ngày check-in',
      defaultValue: true
    },
    {
      key: 'reminderDays',
      label: 'Nhắc nhở trước (ngày)',
      type: 'number',
      description: 'Số ngày trước check-in để gửi email nhắc nhở',
      min: 1,
      max: 14,
      defaultValue: 3
    },
    {
      key: 'thankYouEmails',
      label: 'Email cảm ơn',
      type: 'boolean',
      description: 'Gửi email cảm ơn sau khi check-out',
      defaultValue: true
    },
    {
      key: 'promotionalEmails',
      label: 'Email khuyến mãi',
      type: 'boolean',
      description: 'Gửi email về các chương trình khuyến mãi',
      defaultValue: false
    },
    {
      key: 'emailTemplate',
      label: 'Mẫu email',
      type: 'select',
      description: 'Chọn mẫu email sử dụng',
      options: [
        { value: 'modern', label: 'Modern' },
        { value: 'classic', label: 'Classic' },
        { value: 'minimal', label: 'Minimal' },
        { value: 'luxury', label: 'Luxury' }
      ],
      defaultValue: 'modern'
    },
    {
      key: 'sendFrom',
      label: 'Gửi từ email',
      type: 'text',
      description: 'Địa chỉ email gửi đi',
      defaultValue: 'noreply@hotel.com'
    }
  ]
};

export function FeatureConfigDialog({ isOpen, onClose, onSave, feature }: FeatureConfigDialogProps) {
  const [config, setConfig] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState('basic');

  if (!isOpen || !feature) return null;

  const configSchema = FEATURE_CONFIG_SCHEMAS[feature.id] || [];

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const finalConfig = { ...feature.config, ...config };
    onSave(finalConfig);
  };

  const renderConfigField = (field: ConfigField) => {
    const currentValue = config[field.key] ?? feature.config[field.key] ?? field.defaultValue;

    switch (field.type) {
      case 'boolean':
        return (
          <div key={field.key} className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={currentValue || false}
                onChange={(e) => handleConfigChange(field.key, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">{field.label}</div>
                {field.description && (
                  <div className="text-sm text-gray-500">{field.description}</div>
                )}
              </div>
            </label>
          </div>
        );

      case 'select':
        return (
          <FormField
            key={field.key}
            label={field.label}
            name={field.key}
            type="select"
            value={currentValue?.toString() || ''}
            onChange={handleConfigChange}
            options={field.options || []}
            hint={field.description}
            required={field.required}
          />
        );

      case 'array':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.description && (
              <p className="text-sm text-gray-500">{field.description}</p>
            )}
            <div className="space-y-2">
              {field.options?.map(option => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(currentValue || []).includes(option.value)}
                    onChange={(e) => {
                      const newValue = currentValue || [];
                      if (e.target.checked) {
                        handleConfigChange(field.key, [...newValue, option.value]);
                      } else {
                        handleConfigChange(field.key, newValue.filter((v: string) => v !== option.value));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'number':
        return (
          <FormField
            key={field.key}
            label={field.label}
            name={field.key}
            type="number"
            value={currentValue?.toString() || ''}
            onChange={handleConfigChange}
            hint={field.description}
            min={field.min?.toString()}
            max={field.max?.toString()}
            required={field.required}
          />
        );

      default:
        return (
          <FormField
            key={field.key}
            label={field.label}
            name={field.key}
            type="text"
            value={currentValue?.toString() || ''}
            onChange={handleConfigChange}
            hint={field.description}
            required={field.required}
          />
        );
    }
  };

  const getCategoryIcon = () => {
    switch (feature.category) {
      case 'booking': return <CalendarIcon className="w-5 h-5" />;
      case 'pricing': return <CurrencyIcon className="w-5 h-5" />;
      case 'guest': return <UsersIcon className="w-5 h-5" />;
      default: return <CogIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {getCategoryIcon()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{feature.name}</h2>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Đóng"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Form */}
        <div className="p-6 overflow-y-auto max-h-[60vh] dialog-scroll">
          {configSchema.length === 0 ? (
            <div className="text-center py-12">
              <CogIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có cấu hình chi tiết
              </h3>
              <p className="text-gray-500">
                Tính năng này chưa có các tùy chọn cấu hình chi tiết.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {configSchema.map(renderConfigField)}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            Cấu hình sẽ được áp dụng ngay lập tức sau khi lưu
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <CheckIcon className="w-4 h-4" />
              <span>Lưu cấu hình</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
