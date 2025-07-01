'use client';

import { useState } from 'react';
import FormField from '@/components/ui/FormField';
import { 
  CurrencyIcon, 
  CalendarIcon, 
  BedIcon,
  ChartBarIcon,
  CogIcon,
  XIcon,
  CheckIcon,
  CalculatorIcon
} from '@/components/icons/HotelIcons';

interface RoomType {
  id: string;
  name: string;
  basePrice: number;
  description: string;
}

interface BulkPriceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  roomTypes: RoomType[];
}

const ADJUSTMENT_TYPES = [
  { value: 'percentage', label: 'Tỷ lệ phần trăm (%)', icon: '📊', description: 'Tăng/giảm theo tỷ lệ %' },
  { value: 'fixed', label: 'Số tiền cố định', icon: '💰', description: 'Tăng/giảm số tiền cụ thể' },
  { value: 'set', label: 'Đặt giá mới', icon: '🎯', description: 'Đặt giá mới cho tất cả' }
];

const OPERATION_TYPES = [
  { value: 'increase', label: 'Tăng giá', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' },
  { value: 'decrease', label: 'Giảm giá', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' },
  { value: 'set', label: 'Đặt giá', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' }
];

const DATE_FILTER_TYPES = [
  { value: 'all', label: 'Tất cả ngày' },
  { value: 'range', label: 'Khoảng thời gian' },
  { value: 'weekdays', label: 'Thứ 2 - Thứ 6' },
  { value: 'weekends', label: 'Cuối tuần' },
  { value: 'specific', label: 'Ngày cụ thể' }
];

export function BulkPriceDialog({ isOpen, onClose, onSave, roomTypes }: BulkPriceDialogProps) {
  const [formData, setFormData] = useState({
    selectedRoomTypes: [] as string[],
    adjustmentType: 'percentage',
    operationType: 'increase',
    adjustmentValue: '',
    dateFilter: 'all',
    startDate: '',
    endDate: '',
    specificDates: [] as string[],
    reason: '',
    applyToExisting: true,
    preserveSpecialPrices: true
  });

  const [newSpecificDate, setNewSpecificDate] = useState('');
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleFormChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'adjustmentType' || name === 'operationType' || name === 'adjustmentValue' || name === 'selectedRoomTypes') {
      updatePreview({ ...formData, [name]: value });
    }
  };

  const handleRoomTypeToggle = (roomTypeId: string) => {
    const newSelection = formData.selectedRoomTypes.includes(roomTypeId)
      ? formData.selectedRoomTypes.filter(id => id !== roomTypeId)
      : [...formData.selectedRoomTypes, roomTypeId];
    
    handleFormChange('selectedRoomTypes', newSelection);
  };

  const addSpecificDate = () => {
    if (newSpecificDate && !formData.specificDates.includes(newSpecificDate)) {
      const newDates = [...formData.specificDates, newSpecificDate].sort();
      handleFormChange('specificDates', newDates);
      setNewSpecificDate('');
    }
  };

  const removeSpecificDate = (date: string) => {
    const newDates = formData.specificDates.filter(d => d !== date);
    handleFormChange('specificDates', newDates);
  };

  const calculateNewPrice = (currentPrice: number) => {
    const value = parseFloat(formData.adjustmentValue) || 0;
    
    switch (formData.adjustmentType) {
      case 'percentage':
        if (formData.operationType === 'increase') {
          return Math.round(currentPrice * (1 + value / 100));
        } else if (formData.operationType === 'decrease') {
          return Math.round(currentPrice * (1 - value / 100));
        }
        return currentPrice;
      
      case 'fixed':
        if (formData.operationType === 'increase') {
          return Math.round(currentPrice + value);
        } else if (formData.operationType === 'decrease') {
          return Math.round(Math.max(0, currentPrice - value));
        }
        return currentPrice;
      
      case 'set':
        return Math.round(value);
      
      default:
        return currentPrice;
    }
  };

  const updatePreview = (data = formData) => {
    if (!data.adjustmentValue || data.selectedRoomTypes.length === 0) {
      setPreviewData([]);
      return;
    }

    const preview = data.selectedRoomTypes.map(roomTypeId => {
      const roomType = roomTypes.find(rt => rt.id === roomTypeId);
      if (!roomType) return null;

      const currentPrice = roomType.basePrice;
      const newPrice = calculateNewPrice(currentPrice);
      const difference = newPrice - currentPrice;
      const percentageChange = ((difference / currentPrice) * 100);

      return {
        roomType,
        currentPrice,
        newPrice,
        difference,
        percentageChange
      };
    }).filter(Boolean);

    setPreviewData(preview);
  };

  const handleSave = () => {
    if (formData.selectedRoomTypes.length === 0 || !formData.adjustmentValue) return;

    const saveData = {
      ...formData,
      adjustmentValue: parseFloat(formData.adjustmentValue),
      previewData
    };

    onSave(saveData);
  };

  const getOperationDisplay = () => {
    const operation = OPERATION_TYPES.find(op => op.value === formData.operationType);
    const adjustment = ADJUSTMENT_TYPES.find(adj => adj.value === formData.adjustmentType);
    return { operation, adjustment };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CogIcon className="w-5 h-5 text-blue-600" />
            Điều chỉnh giá hàng loạt
          </h2>          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Đóng dialog"
            aria-label="Đóng dialog"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Left Panel - Settings */}
          <div className="w-1/2 p-6 border-r overflow-y-auto dialog-scroll">
            <div className="space-y-6">
              {/* Room Types Selection */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BedIcon className="w-4 h-4" />
                  Chọn loại phòng ({formData.selectedRoomTypes.length}/{roomTypes.length})
                </h3>
                <div className="space-y-2">
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleFormChange('selectedRoomTypes', roomTypes.map(rt => rt.id))}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Chọn tất cả
                    </button>
                    <button
                      onClick={() => handleFormChange('selectedRoomTypes', [])}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Bỏ chọn tất cả
                    </button>
                  </div>
                  {roomTypes.map(roomType => (
                    <label key={roomType.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedRoomTypes.includes(roomType.id)}
                        onChange={() => handleRoomTypeToggle(roomType.id)}
                        className="rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{roomType.name}</div>
                        <div className="text-sm text-gray-600">
                          Giá hiện tại: {roomType.basePrice.toLocaleString()} VND
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Adjustment Type */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CalculatorIcon className="w-4 h-4" />
                  Loại điều chỉnh
                </h3>
                <div className="space-y-2">
                  {ADJUSTMENT_TYPES.map(type => (
                    <label key={type.value} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="adjustmentType"
                        value={type.value}
                        checked={formData.adjustmentType === type.value}
                        onChange={(e) => handleFormChange('adjustmentType', e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <span>{type.icon}</span>
                          {type.label}
                        </div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Operation & Value */}
              {formData.adjustmentType !== 'set' && (
                <div>
                  <h3 className="font-semibold mb-3">Hành động</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {OPERATION_TYPES.filter(op => op.value !== 'set').map(operation => (
                      <label key={operation.value} className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.operationType === operation.value
                          ? `${operation.bgColor} ${operation.color} border-current`
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          name="operationType"
                          value={operation.value}
                          checked={formData.operationType === operation.value}
                          onChange={(e) => handleFormChange('operationType', e.target.value)}
                          className="sr-only"
                        />
                        <span className={`font-medium ${formData.operationType === operation.value ? operation.color : 'text-gray-700'}`}>
                          {operation.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}              <FormField
                label={
                  formData.adjustmentType === 'percentage' 
                    ? 'Tỷ lệ (%)' 
                    : formData.adjustmentType === 'fixed'
                    ? 'Số tiền (VND)'
                    : 'Giá mới (VND)'
                }
                name="adjustmentValue"
                type="number"
                value={formData.adjustmentValue}
                onChange={handleFormChange}
                placeholder={
                  formData.adjustmentType === 'percentage' 
                    ? 'VD: 10 (tương ứng 10%)'
                    : 'Nhập số tiền'
                }
                icon={<CurrencyIcon className="w-4 h-4" />}
                required
              />

              {/* Date Filter */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Phạm vi áp dụng
                </h3>
                <FormField
                  label="Chọn ngày áp dụng"
                  name="dateFilter"
                  type="select"
                  value={formData.dateFilter}
                  onChange={handleFormChange}
                  options={DATE_FILTER_TYPES.map(type => ({
                    value: type.value,
                    label: type.label
                  }))}
                />                {formData.dateFilter === 'range' && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormField
                      label="Từ ngày"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleFormChange}
                    />
                    <FormField
                      label="Đến ngày"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleFormChange}
                    />
                  </div>
                )}

                {formData.dateFilter === 'specific' && (
                  <div className="mt-4">
                    <div className="flex gap-2 mb-3">
                      <div className="flex-1">
                        <label htmlFor="new-specific-date" className="block text-sm font-medium text-gray-700 mb-1">
                          Chọn ngày
                        </label>
                        <input
                          id="new-specific-date"
                          type="date"
                          value={newSpecificDate}
                          onChange={(e) => setNewSpecificDate(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          title="Chọn ngày cụ thể"
                          placeholder="Chọn ngày"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Thêm</label>
                        <button
                          onClick={addSpecificDate}
                          disabled={!newSpecificDate}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          title="Thêm ngày đã chọn"
                        >
                          Thêm
                        </button>
                      </div>
                    </div>
                    {formData.specificDates.length > 0 && (
                      <div className="space-y-1">
                        {formData.specificDates.map(date => (
                          <div key={date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{new Date(date).toLocaleDateString('vi-VN')}</span>
                            <button
                              onClick={() => removeSpecificDate(date)}
                              className="text-red-600 hover:bg-red-50 p-1 rounded"
                              title="Xóa ngày này"
                              aria-label="Xóa ngày này"
                            >
                              <XIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <FormField
                label="Lý do điều chỉnh"
                name="reason"
                type="textarea"
                value={formData.reason}
                onChange={handleFormChange}
                placeholder="Mô tả lý do điều chỉnh giá..."
                rows={3}
              />

              {/* Options */}
              <div className="space-y-3">
                <h3 className="font-semibold">Tùy chọn</h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.applyToExisting}
                    onChange={(e) => handleFormChange('applyToExisting', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Áp dụng cho các quy tắc giá hiện có</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.preserveSpecialPrices}
                    onChange={(e) => handleFormChange('preserveSpecialPrices', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Giữ nguyên giá đặc biệt</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 p-6 bg-gray-50 overflow-y-auto dialog-scroll">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4" />
              Xem trước thay đổi
            </h3>

            {previewData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CalculatorIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg mb-2">Chưa có dữ liệu xem trước</p>
                <p className="text-sm">Vui lòng chọn loại phòng và nhập giá trị điều chỉnh</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-white p-4 rounded-lg border">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Tổng phòng được chọn</div>
                      <div className="font-semibold text-lg">{previewData.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Loại điều chỉnh</div>
                      <div className="font-semibold">
                        {getOperationDisplay().adjustment?.label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Items */}
                <div className="space-y-3">
                  {previewData.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">{item.roomType.name}</div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.difference > 0 
                            ? 'bg-green-100 text-green-800' 
                            : item.difference < 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.difference > 0 ? '+' : ''}{item.percentageChange.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Giá hiện tại</div>
                          <div className="font-medium">{item.currentPrice.toLocaleString()} VND</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Giá mới</div>
                          <div className="font-medium text-blue-600">{item.newPrice.toLocaleString()} VND</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Chênh lệch</div>
                          <div className={`font-medium ${
                            item.difference > 0 
                              ? 'text-green-600' 
                              : item.difference < 0
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}>
                            {item.difference > 0 ? '+' : ''}{item.difference.toLocaleString()} VND
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={formData.selectedRoomTypes.length === 0 || !formData.adjustmentValue}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            Áp dụng thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
