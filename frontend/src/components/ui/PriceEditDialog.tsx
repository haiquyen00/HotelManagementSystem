'use client';

import { useState, useEffect } from 'react';
import FormField from '@/components/ui/FormField';
import { 
  CurrencyIcon, 
  CalendarIcon, 
  BedIcon,
  ChartBarIcon,
  EditIcon,
  PlusIcon,
  XIcon,
  EyeIcon
} from '@/components/icons/HotelIcons';

interface RoomType {
  id: string;
  name: string;
  basePrice: number;
  description: string;
}

interface SpecialDate {
  id: string;
  date: string;
  price: number;
  reason: string;
  type: 'holiday' | 'weekend' | 'peak' | 'low' | 'custom';
}

interface PriceEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  roomTypes: RoomType[];
  editingRule?: any;
}

const SPECIAL_DATE_TYPES = [
  { value: 'holiday', label: 'Ngày lễ', color: 'bg-red-100 text-red-800', icon: '🎊' },
  { value: 'weekend', label: 'Cuối tuần', color: 'bg-blue-100 text-blue-800', icon: '🎯' },
  { value: 'peak', label: 'Cao điểm', color: 'bg-orange-100 text-orange-800', icon: '📈' },
  { value: 'low', label: 'Thấp điểm', color: 'bg-green-100 text-green-800', icon: '📉' },
  { value: 'custom', label: 'Tùy chỉnh', color: 'bg-purple-100 text-purple-800', icon: '⚙️' }
];

export function PriceEditDialog({ isOpen, onClose, onSave, roomTypes, editingRule }: PriceEditDialogProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'special' | 'preview'>('basic');
  const [formData, setFormData] = useState({
    roomTypeId: '',
    basePrice: '',
    description: '',
    applyToDateRange: false,
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [newSpecialDate, setNewSpecialDate] = useState({
    date: '',
    price: '',
    reason: '',
    type: 'custom' as const
  });

  useEffect(() => {
    if (editingRule) {
      setFormData({
        roomTypeId: editingRule.roomTypeId || '',
        basePrice: editingRule.price?.toString() || '',
        description: editingRule.reason || '',
        applyToDateRange: false,
        startDate: editingRule.date || '',
        endDate: '',
        reason: editingRule.reason || ''
      });
    } else {
      setFormData({
        roomTypeId: '',
        basePrice: '',
        description: '',
        applyToDateRange: false,
        startDate: '',
        endDate: '',
        reason: ''
      });
    }
    setSpecialDates([]);
  }, [editingRule, isOpen]);

  const handleFormChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSpecialDate = () => {
    if (!newSpecialDate.date || !newSpecialDate.price) return;

    const specialDate: SpecialDate = {
      id: `special-${Date.now()}`,
      date: newSpecialDate.date,
      price: parseFloat(newSpecialDate.price),
      reason: newSpecialDate.reason,
      type: newSpecialDate.type
    };

    setSpecialDates(prev => [...prev, specialDate].sort((a, b) => a.date.localeCompare(b.date)));
    setNewSpecialDate({ date: '', price: '', reason: '', type: 'custom' });
  };

  const removeSpecialDate = (id: string) => {
    setSpecialDates(prev => prev.filter(date => date.id !== id));
  };

  const getSelectedRoomType = () => {
    return roomTypes.find(rt => rt.id === formData.roomTypeId);
  };

  const calculatePreviewPrice = (basePrice: number, adjustment: number = 0) => {
    return Math.round(basePrice + adjustment);
  };

  const handleSave = () => {
    const selectedRoomType = getSelectedRoomType();
    if (!selectedRoomType || !formData.basePrice) return;

    const saveData = {
      ...formData,
      price: parseFloat(formData.basePrice),
      specialDates,
      roomTypeName: selectedRoomType.name
    };

    onSave(saveData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <EditIcon className="w-5 h-5 text-blue-600" />
            {editingRule ? 'Chỉnh sửa giá phòng' : 'Thêm quy tắc giá mới'}
          </h2>          <button
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
          {[
            { id: 'basic', label: 'Thông tin cơ bản', icon: CurrencyIcon },
            { id: 'special', label: 'Ngày đặc biệt', icon: CalendarIcon },
            { id: 'preview', label: 'Xem trước', icon: EyeIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>        {/* Tab Content */}        <div className="p-6 overflow-y-auto max-h-[60vh] dialog-scroll">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                <FormField
                  label="Loại phòng"
                  name="roomTypeId"
                  type="select"
                  value={formData.roomTypeId}
                  onChange={handleFormChange}
                  options={roomTypes.map(rt => ({
                    value: rt.id,
                    label: `${rt.name} (${rt.basePrice.toLocaleString()} VND)`
                  }))}
                  required
                  icon={<BedIcon className="w-4 h-4" />}
                />

                <FormField
                  label="Giá cơ bản"
                  name="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={handleFormChange}
                  placeholder="Nhập giá phòng"
                  required
                  icon={<CurrencyIcon className="w-4 h-4" />}
                />
              </div>

              <FormField
                label="Mô tả"
                name="description"
                type="textarea"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Mô tả về quy tắc giá này..."
                rows={3}
              />

              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="applyToDateRange"
                    checked={formData.applyToDateRange}
                    onChange={(e) => handleFormChange('applyToDateRange', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="applyToDateRange" className="font-medium">
                    Áp dụng cho khoảng thời gian
                  </label>
                </div>

                {formData.applyToDateRange && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                    <FormField
                      label="Từ ngày"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      icon={<CalendarIcon className="w-4 h-4" />}
                    />
                    <FormField
                      label="Đến ngày"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleFormChange}
                      icon={<CalendarIcon className="w-4 h-4" />}
                    />
                  </div>
                )}
              </div>

              <FormField
                label="Lý do thay đổi giá"
                name="reason"
                type="text"
                value={formData.reason}
                onChange={handleFormChange}
                placeholder="VD: Lễ hội, cao điểm, khuyến mãi..."
              />
            </div>
          )}

          {activeTab === 'special' && (
            <div className="space-y-6">
              <div className="border rounded-lg p-4 bg-blue-50">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Thêm ngày đặc biệt
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">                  <FormField
                    label="Ngày"
                    name="date"
                    type="date"
                    value={newSpecialDate.date}
                    onChange={(name, value) => setNewSpecialDate(prev => ({ ...prev, [name]: value }))}
                    icon={<CalendarIcon className="w-4 h-4" />}
                  />
                  
                  <FormField
                    label="Giá"
                    name="price"
                    type="number"
                    value={newSpecialDate.price}
                    onChange={(name, value) => setNewSpecialDate(prev => ({ ...prev, [name]: value }))}
                    placeholder="Giá đặc biệt"
                    icon={<CurrencyIcon className="w-4 h-4" />}
                  />
                  
                  <FormField
                    label="Loại"
                    name="type"
                    type="select"
                    value={newSpecialDate.type}
                    onChange={(name, value) => setNewSpecialDate(prev => ({ ...prev, [name]: value }))}
                    options={SPECIAL_DATE_TYPES.map(type => ({
                      value: type.value,
                      label: `${type.icon} ${type.label}`
                    }))}
                  />
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Hành động</label>
                    <button
                      onClick={addSpecialDate}
                      disabled={!newSpecialDate.date || !newSpecialDate.price}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Thêm
                    </button>
                  </div>
                </div>

                <FormField
                  label="Lý do"
                  name="reason"
                  type="text"
                  value={newSpecialDate.reason}
                  onChange={(name, value) => setNewSpecialDate(prev => ({ ...prev, [name]: value }))}
                  placeholder="Lý do áp dụng giá đặc biệt..."
                />
              </div>

              {/* Special Dates List */}
              <div className="space-y-3">
                <h3 className="font-semibold">Danh sách ngày đặc biệt ({specialDates.length})</h3>
                {specialDates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa có ngày đặc biệt nào</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {specialDates.map(date => {
                      const typeInfo = SPECIAL_DATE_TYPES.find(t => t.value === date.type);
                      return (
                        <div key={date.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo?.color}`}>
                              {typeInfo?.icon} {typeInfo?.label}
                            </span>
                            <div>
                              <div className="font-medium">{new Date(date.date).toLocaleDateString('vi-VN')}</div>
                              <div className="text-sm text-gray-600">{date.reason}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-semibold text-blue-600">
                                {date.price.toLocaleString()} VND
                              </div>
                            </div>                            <button
                              onClick={() => removeSpecialDate(date.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Xóa ngày đặc biệt"
                              aria-label="Xóa ngày đặc biệt"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <EyeIcon className="w-5 h-5" />
                  Xem trước quy tắc giá
                </h3>
                
                {getSelectedRoomType() ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{getSelectedRoomType()?.name}</div>
                        <div className="text-sm text-gray-600">Giá gốc: {getSelectedRoomType()?.basePrice.toLocaleString()} VND</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formData.basePrice ? parseFloat(formData.basePrice).toLocaleString() : '0'} VND
                      </div>
                      {formData.basePrice && getSelectedRoomType() && (
                        <div className="text-sm text-gray-600 mt-1">
                          {parseFloat(formData.basePrice) > getSelectedRoomType()!.basePrice 
                            ? `+${(parseFloat(formData.basePrice) - getSelectedRoomType()!.basePrice).toLocaleString()} VND` 
                            : parseFloat(formData.basePrice) < getSelectedRoomType()!.basePrice
                            ? `-${(getSelectedRoomType()!.basePrice - parseFloat(formData.basePrice)).toLocaleString()} VND`
                            : 'Giá không thay đổi'
                          }
                        </div>
                      )}
                    </div>

                    {specialDates.length > 0 && (
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="font-medium mb-3">Ngày có giá đặc biệt</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {specialDates.map(date => {
                            const typeInfo = SPECIAL_DATE_TYPES.find(t => t.value === date.type);
                            return (
                              <div key={date.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{typeInfo?.icon}</span>
                                  <span className="text-sm">{new Date(date.date).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <span className="font-medium text-orange-600">
                                  {date.price.toLocaleString()} VND
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {formData.applyToDateRange && formData.startDate && formData.endDate && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="font-medium text-yellow-800 mb-2">Áp dụng cho khoảng thời gian</div>
                        <div className="text-sm text-yellow-700">
                          Từ {new Date(formData.startDate).toLocaleDateString('vi-VN')} 
                          đến {new Date(formData.endDate).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BedIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Vui lòng chọn loại phòng để xem trước</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.roomTypeId || !formData.basePrice}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {editingRule ? 'Cập nhật' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}

