'use client';

import { useState, useEffect } from 'react';
import { HotelLayout } from '@/components/layout';
import { useToast } from '@/hooks/useToast';
import FormField from '@/components/ui/FormField';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { DashboardStatsSkeleton, TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { EnhancedTable } from '@/components/ui/EnhancedTable';
import { BulkPricingForm } from '@/components/ui/BulkPricingForm';
import { ImportExportTools } from '@/components/ui/ImportExportTools';
import { PriceEditDialog } from '@/components/ui/PriceEditDialog';
import { BulkPriceDialog } from '@/components/ui/BulkPriceDialog';
import { SeasonalPricingDialog } from '@/components/ui/SeasonalPricingDialog';
import { 
  CurrencyIcon, 
  CalendarIcon, 
  BedIcon,
  ChartBarIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  CogIcon,
  ChartLineIcon
} from '@/components/icons/HotelIcons';

// Types
interface RoomType {
  id: string;
  name: string;
  basePrice: number;
  description: string;
}

interface PricingRule {
  id: string;
  roomTypeId: string;
  roomTypeName: string;
  date: string;
  price: number;
  reason: string;
  isActive: boolean;
  createdAt: string;
}

interface DailyPricing {
  date: string;
  roomPrices: { [roomTypeId: string]: number };
}

const MOCK_ROOM_TYPES: RoomType[] = [
  { id: '1', name: 'Standard Room', basePrice: 800000, description: 'Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản' },
  { id: '2', name: 'Deluxe Room', basePrice: 1200000, description: 'Phòng cao cấp với view biển tuyệt đẹp' },
  { id: '3', name: 'Suite Room', basePrice: 2000000, description: 'Phòng suite sang trọng với không gian rộng rãi' },
  { id: '4', name: 'Presidential Suite', basePrice: 5000000, description: 'Phòng tổng thống với dịch vụ VIP' },
];

export default function HotelPricingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRule, setSelectedRule] = useState<PricingRule | null>(null);
  const [currentView, setCurrentView] = useState<'rules' | 'calendar' | 'bulk' | 'tools'>('rules');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  // Advanced Dialog States
  const [showPriceEditDialog, setShowPriceEditDialog] = useState(false);
  const [showBulkPriceDialog, setShowBulkPriceDialog] = useState(false);
  const [showSeasonalPricingDialog, setShowSeasonalPricingDialog] = useState(false);
  const [editingPriceRule, setEditingPriceRule] = useState<PricingRule | null>(null);

  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    roomTypeId: '',
    date: '',
    price: '',
    reason: '',
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setRoomTypes(MOCK_ROOM_TYPES);
      setPricingRules(generateMockPricingRules());
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const generateMockPricingRules = (): PricingRule[] => {
    const rules: PricingRule[] = [];
    const today = new Date();
    
    // Generate some sample pricing rules
    for (let i = 0; i < 20; i++) {
      const date = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
      const roomType = MOCK_ROOM_TYPES[Math.floor(Math.random() * MOCK_ROOM_TYPES.length)];
        rules.push({
        id: `rule-${i + 1}`,
        roomTypeId: roomType.id,
        roomTypeName: roomType.name,
        date: date.toISOString().split('T')[0],
        price: Math.round(roomType.basePrice + (Math.random() * 500000)),
        reason: i % 3 === 0 ? 'Cuối tuần' : i % 3 === 1 ? 'Lễ hội' : 'Cao điểm',
        isActive: Math.random() > 0.2,
        createdAt: new Date().toISOString(),
      });
    }
    
    return rules;
  };

  const handleFormChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!formData.roomTypeId || !formData.date || !formData.price) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      const roomType = roomTypes.find(rt => rt.id === formData.roomTypeId);
      if (!roomType) return;      const newRule: PricingRule = {
        id: `rule-${Date.now()}`,
        roomTypeId: formData.roomTypeId,
        roomTypeName: roomType.name,
        date: formData.date,
        price: Math.round(parseFloat(formData.price) || 0),
        reason: formData.reason || 'Điều chỉnh giá',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      if (showEditModal && selectedRule) {
        // Update existing rule
        setPricingRules(prev => prev.map(rule => 
          rule.id === selectedRule.id ? { ...newRule, id: selectedRule.id } : rule
        ));
        toast.success('Cập nhật quy tắc giá thành công');
      } else {
        // Add new rule
        setPricingRules(prev => [...prev, newRule]);
        toast.success('Thêm quy tắc giá thành công');
      }

      setShowAddModal(false);
      setShowEditModal(false);
      setFormData({ roomTypeId: '', date: '', price: '', reason: '' });
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleEdit = (rule: PricingRule) => {
    setSelectedRule(rule);
    setFormData({
      roomTypeId: rule.roomTypeId,
      date: rule.date,
      price: rule.price.toString(),
      reason: rule.reason,
    });
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!selectedRule) return;

    try {
      setPricingRules(prev => prev.filter(rule => rule.id !== selectedRule.id));
      toast.success('Xóa quy tắc giá thành công');
      setShowDeleteConfirm(false);
      setSelectedRule(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa');
    }
  };
  const toggleRuleStatus = (ruleId: string) => {
    setPricingRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
    toast.success('Cập nhật trạng thái thành công');
  };

  // Advanced Dialog Handlers
  const handlePriceEditSave = (data: any) => {
    try {
      if (data.specialDates && data.specialDates.length > 0) {
        // Handle special dates - create multiple rules
        const newRules: PricingRule[] = [];
        
        // Base rule
        if (data.applyToDateRange && data.startDate && data.endDate) {
          const startDate = new Date(data.startDate);
          const endDate = new Date(data.endDate);
          
          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const specialDate = data.specialDates.find((sd: any) => sd.date === dateStr);
            
            newRules.push({
              id: `rule-${Date.now()}-${dateStr}`,
              roomTypeId: data.roomTypeId,
              roomTypeName: data.roomTypeName,
              date: dateStr,
              price: specialDate ? specialDate.price : data.price,
              reason: specialDate ? specialDate.reason : data.reason || 'Điều chỉnh giá',
              isActive: true,
              createdAt: new Date().toISOString(),
            });
          }
        } else {
          // Individual special dates
          data.specialDates.forEach((specialDate: any) => {
            newRules.push({
              id: `rule-${Date.now()}-${specialDate.id}`,
              roomTypeId: data.roomTypeId,
              roomTypeName: data.roomTypeName,
              date: specialDate.date,
              price: specialDate.price,
              reason: specialDate.reason,
              isActive: true,
              createdAt: new Date().toISOString(),
            });
          });
        }
        
        setPricingRules(prev => [...prev, ...newRules]);
        toast.success(`Thêm ${newRules.length} quy tắc giá thành công`);
      } else {
        // Single rule
        const newRule: PricingRule = {
          id: editingPriceRule?.id || `rule-${Date.now()}`,
          roomTypeId: data.roomTypeId,
          roomTypeName: data.roomTypeName,
          date: data.startDate,
          price: Math.round(data.price || 0),
          reason: data.reason || 'Điều chỉnh giá',
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        if (editingPriceRule) {
          setPricingRules(prev => prev.map(rule => 
            rule.id === editingPriceRule.id ? newRule : rule
          ));
          toast.success('Cập nhật quy tắc giá thành công');
        } else {
          setPricingRules(prev => [...prev, newRule]);
          toast.success('Thêm quy tắc giá thành công');
        }
      }

      setShowPriceEditDialog(false);
      setEditingPriceRule(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu quy tắc giá');
    }
  };

  const handleBulkPriceSave = (data: any) => {
    try {
      const newRules: PricingRule[] = [];
      
      data.selectedRoomTypes.forEach((roomTypeId: string) => {
        const roomType = roomTypes.find(rt => rt.id === roomTypeId);
        if (!roomType) return;

        // Generate dates based on filter
        let datesToApply: string[] = [];
        
        if (data.dateFilter === 'range' && data.startDate && data.endDate) {
          const startDate = new Date(data.startDate);
          const endDate = new Date(data.endDate);
          
          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            datesToApply.push(d.toISOString().split('T')[0]);
          }
        } else if (data.dateFilter === 'specific') {
          datesToApply = data.specificDates;
        } else if (data.dateFilter === 'weekends' || data.dateFilter === 'weekdays') {
          // Generate next 30 days and filter
          const today = new Date();
          for (let i = 0; i < 30; i++) {
            const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
            const dayOfWeek = date.getDay();
            
            if (data.dateFilter === 'weekends' && (dayOfWeek === 0 || dayOfWeek === 6)) {
              datesToApply.push(date.toISOString().split('T')[0]);
            } else if (data.dateFilter === 'weekdays' && dayOfWeek >= 1 && dayOfWeek <= 5) {
              datesToApply.push(date.toISOString().split('T')[0]);
            }
          }
        }

        datesToApply.forEach(dateStr => {
          const currentPrice = roomType.basePrice; // Get current price logic here
          let newPrice = currentPrice;
          
          switch (data.adjustmentType) {
            case 'percentage':
              if (data.operationType === 'increase') {
                newPrice = Math.round(currentPrice * (1 + data.adjustmentValue / 100));
              } else if (data.operationType === 'decrease') {
                newPrice = Math.round(currentPrice * (1 - data.adjustmentValue / 100));
              }
              break;
            case 'fixed':
              if (data.operationType === 'increase') {
                newPrice = Math.round(currentPrice + data.adjustmentValue);
              } else if (data.operationType === 'decrease') {
                newPrice = Math.round(Math.max(0, currentPrice - data.adjustmentValue));
              }
              break;
            case 'set':
              newPrice = Math.round(data.adjustmentValue);
              break;
          }

          newRules.push({
            id: `bulk-rule-${Date.now()}-${roomTypeId}-${dateStr}`,
            roomTypeId,
            roomTypeName: roomType.name,
            date: dateStr,
            price: newPrice,
            reason: data.reason || 'Điều chỉnh giá hàng loạt',
            isActive: true,
            createdAt: new Date().toISOString(),
          });
        });
      });

      setPricingRules(prev => [...prev, ...newRules]);
      toast.success(`Áp dụng ${newRules.length} quy tắc giá hàng loạt thành công`);
      setShowBulkPriceDialog(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi áp dụng giá hàng loạt');
    }
  };

  const handleSeasonalPricingSave = (data: any) => {
    try {
      // This would typically save to backend and affect future price calculations
      // For now, we'll show a success message
      toast.success('Cấu hình giá theo mùa đã được lưu thành công');
      toast.success(`Đã thiết lập ${data.seasons.length} mùa và ${data.specialEvents.length} sự kiện đặc biệt`);
      setShowSeasonalPricingDialog(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu cấu hình giá theo mùa');
    }
  };

  const handleAdvancedEdit = (rule: PricingRule) => {
    setEditingPriceRule(rule);
    setShowPriceEditDialog(true);
  };

  const getCalendarData = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthData: DailyPricing[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayRules = pricingRules.filter(rule => rule.date === dateStr && rule.isActive);
      
      const roomPrices: { [roomTypeId: string]: number } = {};
      roomTypes.forEach(roomType => {
        const rule = dayRules.find(r => r.roomTypeId === roomType.id);
        roomPrices[roomType.id] = rule ? rule.price : roomType.basePrice;
      });

      monthData.push({
        date: dateStr,
        roomPrices
      });
    }

    return monthData;
  };
  const tableColumns = [
    {
      key: 'date',
      title: 'Ngày',
      sortable: true,
      render: (rule: PricingRule) => (
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-ocean-blue" />
          <span className="font-medium">{new Date(rule.date).toLocaleDateString('vi-VN')}</span>
        </div>
      )
    },
    {
      key: 'roomTypeName',
      title: 'Loại phòng',
      sortable: true,
      render: (rule: PricingRule) => (
        <div className="flex items-center space-x-2">
          <BedIcon className="w-4 h-4 text-seafoam-green" />
          <span>{rule.roomTypeName}</span>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Giá (VNĐ)',
      sortable: true,      render: (rule: PricingRule) => (
        <div className="flex items-center space-x-2">
          <CurrencyIcon className="w-4 h-4 text-sunset-orange" />
          <span className="font-semibold text-deep-navy">
            {typeof rule.price === 'number' ? rule.price.toLocaleString('vi-VN') : '0'}
          </span>
        </div>
      )
    },
    {
      key: 'reason',
      title: 'Lý do',
      sortable: false,
      render: (rule: PricingRule) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ocean-blue/10 text-ocean-blue">
          {rule.reason}
        </span>
      )
    },
    {
      key: 'isActive',
      title: 'Trạng thái',
      sortable: true,
      render: (rule: PricingRule) => (
        <button
          onClick={() => toggleRuleStatus(rule.id)}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
            rule.isActive
              ? 'bg-seafoam-green/10 text-seafoam-green hover:bg-seafoam-green/20'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {rule.isActive ? 'Hoạt động' : 'Tạm dừng'}
        </button>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      sortable: false,
      render: (rule: PricingRule) => (        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleAdvancedEdit(rule)}
            className="p-1 text-ocean-blue hover:bg-ocean-blue/10 rounded transition-colors"
            title="Chỉnh sửa nâng cao"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedRule(rule);
              setShowDeleteConfirm(true);
            }}
            className="p-1 text-coral-pink hover:bg-coral-pink/10 rounded transition-colors"
            title="Xóa"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const renderModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
        <h3 className="text-lg font-semibold text-deep-navy mb-4">
          {showEditModal ? 'Chỉnh sửa quy tắc giá' : 'Thêm quy tắc giá mới'}
        </h3>
        
        <div className="space-y-4">
          <FormField
            label="Loại phòng"
            name="roomTypeId"
            type="select"
            value={formData.roomTypeId}
            onChange={handleFormChange}
            required
            options={roomTypes.map(rt => ({ value: rt.id, label: rt.name }))}
            icon={<BedIcon className="w-4 h-4" />}
          />
          
          <FormField
            label="Ngày áp dụng"
            name="date"
            type="text"
            value={formData.date}
            onChange={handleFormChange}
            required
            placeholder="YYYY-MM-DD"
            icon={<CalendarIcon className="w-4 h-4" />}
            hint="Định dạng: YYYY-MM-DD (ví dụ: 2024-01-15)"
          />
          
          <FormField
            label="Giá (VNĐ)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleFormChange}
            required
            placeholder="Nhập giá phòng"
            icon={<CurrencyIcon className="w-4 h-4" />}
          />
          
          <FormField
            label="Lý do điều chỉnh"
            name="reason"
            type="text"
            value={formData.reason}
            onChange={handleFormChange}
            placeholder="Ví dụ: Cuối tuần, Lễ hội, Cao điểm..."
            hint="Mô tả ngắn gọn lý do thay đổi giá"
          />
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
              setFormData({ roomTypeId: '', date: '', price: '', reason: '' });
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-ocean-blue text-white hover:bg-ocean-blue/90 rounded-lg transition-colors"
          >
            {showEditModal ? 'Cập nhật' : 'Thêm'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderCalendarView = () => {
    const calendarData = getCalendarData();

    return (        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-deep-navy">Lịch giá phòng</h3>
          <div className="flex flex-col">
            <label htmlFor="month-picker" className="text-sm text-gray-600 mb-1">Chọn tháng</label>
            <input
              id="month-picker"
              type="date"
              value={selectedMonth + '-01'}
              onChange={(e) => setSelectedMonth(e.target.value.slice(0, 7))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
              title="Chọn tháng để xem lịch giá"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-ocean-blue to-seafoam-green text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Ngày</th>
                  {roomTypes.map(roomType => (
                    <th key={roomType.id} className="px-4 py-3 text-left text-sm font-medium">
                      {roomType.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {calendarData.map((day, index) => (
                  <tr key={day.date} className={index % 2 === 0 ? 'bg-white' : 'bg-pearl-white'}>
                    <td className="px-4 py-3 text-sm font-medium text-deep-navy">
                      {new Date(day.date).toLocaleDateString('vi-VN', { 
                        weekday: 'short',
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </td>
                    {roomTypes.map(roomType => {
                      const price = day.roomPrices[roomType.id];
                      const hasSpecialPrice = price !== roomType.basePrice;
                      
                      return (
                        <td key={roomType.id} className="px-4 py-3 text-sm">                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            hasSpecialPrice 
                              ? 'bg-sunset-orange/10 text-sunset-orange'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {typeof price === 'number' ? price.toLocaleString('vi-VN') : '0'} VNĐ
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <HotelLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-deep-navy">
              Quản lý giá phòng
            </h2>
            <p className="text-gray-600 mt-2">
              Thiết lập và quản lý giá phòng theo từng ngày cụ thể
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-pearl-white rounded-lg p-1">
              <button
                onClick={() => setCurrentView('rules')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'rules'
                    ? 'bg-white text-ocean-blue shadow-sm'
                    : 'text-gray-600 hover:text-ocean-blue'
                }`}
              >
                Quy tắc giá
              </button>
              <button
                onClick={() => setCurrentView('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'calendar'
                    ? 'bg-white text-ocean-blue shadow-sm'
                    : 'text-gray-600 hover:text-ocean-blue'
                }`}
              >
                Lịch giá
              </button>
            </div>            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setEditingPriceRule(null);
                  setShowPriceEditDialog(true);
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-ocean-blue to-seafoam-green text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Thêm quy tắc</span>
              </button>

              <button
                onClick={() => setShowBulkPriceDialog(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                <CogIcon className="w-4 h-4" />
                <span>Điều chỉnh hàng loạt</span>
              </button>

              <button
                onClick={() => setShowSeasonalPricingDialog(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                <ChartLineIcon className="w-4 h-4" />
                <span>Giá theo mùa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <DashboardStatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-pearl-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng quy tắc</p>
                  <p className="text-2xl font-bold text-deep-navy mt-1">
                    {pricingRules.length}
                  </p>
                </div>
                <div className="p-3 bg-ocean-blue/10 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-ocean-blue" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-pearl-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-deep-navy mt-1">
                    {pricingRules.filter(rule => rule.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-seafoam-green/10 rounded-lg">
                  <ChartLineIcon className="w-6 h-6 text-seafoam-green" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-pearl-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Loại phòng</p>
                  <p className="text-2xl font-bold text-deep-navy mt-1">
                    {roomTypes.length}
                  </p>
                </div>
                <div className="p-3 bg-coral-pink/10 rounded-lg">
                  <BedIcon className="w-6 h-6 text-coral-pink" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-pearl-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Giá trung bình</p>                  <p className="text-2xl font-bold text-deep-navy mt-1">
                    {pricingRules.length > 0 
                      ? Math.round(pricingRules.reduce((sum, rule) => sum + (typeof rule.price === 'number' ? rule.price : 0), 0) / pricingRules.length).toLocaleString('vi-VN')
                      : '0'
                    }
                  </p>
                </div>
                <div className="p-3 bg-sunset-orange/10 rounded-lg">
                  <CurrencyIcon className="w-6 h-6 text-sunset-orange" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : currentView === 'rules' ? (
          pricingRules.length === 0 ? (            <EmptyState
              icon={<CurrencyIcon className="w-12 h-12" />}
              title="Chưa có quy tắc giá nào"
              description="Thêm quy tắc giá đầu tiên để bắt đầu quản lý giá phòng theo ngày"
              action={{
                label: "Thêm quy tắc đầu tiên",
                onClick: () => {
                  setEditingPriceRule(null);
                  setShowPriceEditDialog(true);
                }
              }}
            />
          ) : (            <div className="bg-white rounded-lg shadow-lg">
              <EnhancedTable
                data={pricingRules}
                columns={tableColumns}
                searchPlaceholder="Tìm kiếm theo loại phòng, ngày..."
              />
            </div>
          )
        ) : (
          renderCalendarView()
        )}        {/* Modals */}
        {(showAddModal || showEditModal) && renderModal()}

        {/* Advanced Pricing Dialogs */}
        <PriceEditDialog
          isOpen={showPriceEditDialog}
          onClose={() => {
            setShowPriceEditDialog(false);
            setEditingPriceRule(null);
          }}
          onSave={handlePriceEditSave}
          roomTypes={roomTypes}
          editingRule={editingPriceRule}
        />

        <BulkPriceDialog
          isOpen={showBulkPriceDialog}
          onClose={() => setShowBulkPriceDialog(false)}
          onSave={handleBulkPriceSave}
          roomTypes={roomTypes}
        />

        <SeasonalPricingDialog
          isOpen={showSeasonalPricingDialog}
          onClose={() => setShowSeasonalPricingDialog(false)}
          onSave={handleSeasonalPricingSave}
          roomTypes={roomTypes}
        />

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title="Xóa quy tắc giá"
          message={`Bạn có chắc chắn muốn xóa quy tắc giá cho ${selectedRule?.roomTypeName} ngày ${selectedRule?.date}?`}
          type="danger"
        />
      </div>
    </HotelLayout>
  );
}
