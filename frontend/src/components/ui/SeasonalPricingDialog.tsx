'use client';

import { useState, useEffect } from 'react';
import FormField from '@/components/ui/FormField';
import { 
  CurrencyIcon, 
  CalendarIcon, 
  BedIcon,
  ChartLineIcon,
  CogIcon,
  XIcon,
  CheckIcon,
  PlusIcon,
  EditIcon,
  TrashIcon
} from '@/components/icons/HotelIcons';

interface RoomType {
  id: string;
  name: string;
  basePrice: number;
  description: string;
}

interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  multiplier: number;
  color: string;
  icon: string;
  description: string;
  isActive: boolean;
}

interface SpecialEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  multiplier: number;
  priority: number;
  roomTypeIds: string[];
  description: string;
  type: 'holiday' | 'festival' | 'peak' | 'promotion';
  isActive: boolean;
}

interface SeasonalPricingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  roomTypes: RoomType[];
}

const DEFAULT_SEASONS: Season[] = [
  {
    id: 'spring',
    name: 'Mùa xuân',
    startDate: '03-01',
    endDate: '05-31',
    multiplier: 1.1,
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '🌸',
    description: 'Thời tiết dễ chịu, du lịch tăng nhẹ',
    isActive: true
  },
  {
    id: 'summer',
    name: 'Mùa hè',
    startDate: '06-01',
    endDate: '08-31',
    multiplier: 1.3,
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: '☀️',
    description: 'Cao điểm du lịch biển',
    isActive: true
  },
  {
    id: 'autumn',
    name: 'Mùa thu',
    startDate: '09-01',
    endDate: '11-30',
    multiplier: 1.15,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '🍂',
    description: 'Thời tiết mát mẻ, phù hợp du lịch',
    isActive: true
  },
  {
    id: 'winter',
    name: 'Mùa đông',
    startDate: '12-01',
    endDate: '02-28',
    multiplier: 0.9,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '❄️',
    description: 'Thấp điểm, giá ưu đãi',
    isActive: true
  }
];

const EVENT_TYPES = [
  { value: 'holiday', label: 'Ngày lễ', color: 'bg-red-100 text-red-800', icon: '🎊' },
  { value: 'festival', label: 'Lễ hội', color: 'bg-purple-100 text-purple-800', icon: '🎭' },
  { value: 'peak', label: 'Cao điểm', color: 'bg-orange-100 text-orange-800', icon: '📈' },
  { value: 'promotion', label: 'Khuyến mãi', color: 'bg-green-100 text-green-800', icon: '🎁' }
];

export function SeasonalPricingDialog({ isOpen, onClose, onSave, roomTypes }: SeasonalPricingDialogProps) {
  const [seasons, setSeasons] = useState<Season[]>(DEFAULT_SEASONS);
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'seasons' | 'events' | 'preview'>('seasons');
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [editingEvent, setEditingEvent] = useState<SpecialEvent | null>(null);
  const [showSeasonForm, setShowSeasonForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);

  const [seasonForm, setSeasonForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    multiplier: '1.0',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '🌟',
    description: ''
  });
  const [eventForm, setEventForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    multiplier: '1.0',
    priority: '1',
    roomTypeIds: [] as string[],
    description: '',
    type: 'holiday' as 'holiday' | 'festival' | 'peak' | 'promotion'
  });

  const resetSeasonForm = () => {
    setSeasonForm({
      name: '',
      startDate: '',
      endDate: '',
      multiplier: '1.0',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '🌟',
      description: ''
    });
  };

  const resetEventForm = () => {
    setEventForm({
      name: '',
      startDate: '',
      endDate: '',
      multiplier: '1.0',
      priority: '1',
      roomTypeIds: [],
      description: '',
      type: 'holiday'
    });
  };

  const handleSeasonFormChange = (name: string, value: any) => {
    setSeasonForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEventFormChange = (name: string, value: any) => {
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSeason = (season: Season) => {
    setEditingSeason(season);
    setSeasonForm({
      name: season.name,
      startDate: season.startDate,
      endDate: season.endDate,
      multiplier: season.multiplier.toString(),
      color: season.color,
      icon: season.icon,
      description: season.description
    });
    setShowSeasonForm(true);
  };

  const handleEditEvent = (event: SpecialEvent) => {
    setEditingEvent(event);
    setEventForm({
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      multiplier: event.multiplier.toString(),
      priority: event.priority.toString(),
      roomTypeIds: event.roomTypeIds,
      description: event.description,
      type: event.type
    });
    setShowEventForm(true);
  };

  const saveSeason = () => {
    if (!seasonForm.name || !seasonForm.startDate || !seasonForm.endDate) return;

    const seasonData: Season = {
      id: editingSeason?.id || `season-${Date.now()}`,
      name: seasonForm.name,
      startDate: seasonForm.startDate,
      endDate: seasonForm.endDate,
      multiplier: parseFloat(seasonForm.multiplier),
      color: seasonForm.color,
      icon: seasonForm.icon,
      description: seasonForm.description,
      isActive: true
    };

    if (editingSeason) {
      setSeasons(prev => prev.map(s => s.id === editingSeason.id ? seasonData : s));
    } else {
      setSeasons(prev => [...prev, seasonData]);
    }

    setShowSeasonForm(false);
    setEditingSeason(null);
    resetSeasonForm();
  };

  const saveEvent = () => {
    if (!eventForm.name || !eventForm.startDate || !eventForm.endDate) return;

    const eventData: SpecialEvent = {
      id: editingEvent?.id || `event-${Date.now()}`,
      name: eventForm.name,
      startDate: eventForm.startDate,
      endDate: eventForm.endDate,
      multiplier: parseFloat(eventForm.multiplier),
      priority: parseInt(eventForm.priority),
      roomTypeIds: eventForm.roomTypeIds,
      description: eventForm.description,
      type: eventForm.type,
      isActive: true
    };

    if (editingEvent) {
      setSpecialEvents(prev => prev.map(e => e.id === editingEvent.id ? eventData : e));
    } else {
      setSpecialEvents(prev => [...prev, eventData]);
    }

    setShowEventForm(false);
    setEditingEvent(null);
    resetEventForm();
  };

  const deleteSeason = (seasonId: string) => {
    setSeasons(prev => prev.filter(s => s.id !== seasonId));
  };

  const deleteEvent = (eventId: string) => {
    setSpecialEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const toggleSeasonStatus = (seasonId: string) => {
    setSeasons(prev => prev.map(s => 
      s.id === seasonId ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const toggleEventStatus = (eventId: string) => {
    setSpecialEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, isActive: !e.isActive } : e
    ));
  };

  const handleRoomTypeToggle = (roomTypeId: string) => {
    const newSelection = eventForm.roomTypeIds.includes(roomTypeId)
      ? eventForm.roomTypeIds.filter(id => id !== roomTypeId)
      : [...eventForm.roomTypeIds, roomTypeId];
    
    handleEventFormChange('roomTypeIds', newSelection);
  };

  const calculateSeasonalPrice = (basePrice: number, roomTypeId: string, date: string) => {
    // Find applicable season
    const dateObj = new Date(date);
    const monthDay = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
    
    const applicableSeason = seasons.find(season => {
      if (!season.isActive) return false;
      return monthDay >= season.startDate && monthDay <= season.endDate;
    });

    // Find applicable events
    const applicableEvents = specialEvents.filter(event => {
      if (!event.isActive) return false;
      if (event.roomTypeIds.length > 0 && !event.roomTypeIds.includes(roomTypeId)) return false;
      return date >= event.startDate && date <= event.endDate;
    }).sort((a, b) => b.priority - a.priority);

    let finalPrice = basePrice;

    // Apply seasonal multiplier
    if (applicableSeason) {
      finalPrice *= applicableSeason.multiplier;
    }

    // Apply highest priority event multiplier
    if (applicableEvents.length > 0) {
      finalPrice *= applicableEvents[0].multiplier;
    }

    return Math.round(finalPrice);
  };

  const getPreviewData = () => {
    const today = new Date();
    const previewDates = [];
    
    // Generate next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const roomPrices = roomTypes.map(roomType => ({
        roomType,
        originalPrice: roomType.basePrice,
        seasonalPrice: calculateSeasonalPrice(roomType.basePrice, roomType.id, dateStr)
      }));

      previewDates.push({
        date: dateStr,
        dateObj: date,
        roomPrices
      });
    }

    return previewDates;
  };

  const handleSave = () => {
    const saveData = {
      seasons: seasons.filter(s => s.isActive),
      specialEvents: specialEvents.filter(e => e.isActive)
    };

    onSave(saveData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ChartLineIcon className="w-5 h-5 text-blue-600" />
            Quản lý giá theo mùa
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
            { id: 'seasons', label: 'Mùa trong năm', icon: CalendarIcon },
            { id: 'events', label: 'Sự kiện đặc biệt', icon: CogIcon },
            { id: 'preview', label: 'Xem trước giá', icon: ChartLineIcon }
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
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] dialog-scroll">
          {activeTab === 'seasons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Cấu hình mùa trong năm</h3>
                <button
                  onClick={() => {
                    resetSeasonForm();
                    setShowSeasonForm(true);
                    setEditingSeason(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Thêm mùa mới
                </button>
              </div>

              {/* Seasons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seasons.map(season => (
                  <div key={season.id} className={`border-2 rounded-lg p-4 ${season.color} ${season.isActive ? '' : 'opacity-50'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{season.icon}</span>
                        <div>
                          <h4 className="font-semibold">{season.name}</h4>
                          <p className="text-sm opacity-80">{season.description}</p>
                        </div>
                      </div>                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditSeason(season)}
                          className="p-1 hover:bg-white hover:bg-opacity-50 rounded"
                          title="Chỉnh sửa mùa"
                          aria-label="Chỉnh sửa mùa"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleSeasonStatus(season.id)}
                          className="p-1 hover:bg-white hover:bg-opacity-50 rounded"
                          title={season.isActive ? "Tắt mùa" : "Bật mùa"}
                          aria-label={season.isActive ? "Tắt mùa" : "Bật mùa"}
                        >
                          <CheckIcon className={`w-4 h-4 ${season.isActive ? '' : 'opacity-50'}`} />
                        </button>
                        <button
                          onClick={() => deleteSeason(season.id)}
                          className="p-1 hover:bg-white hover:bg-opacity-50 rounded text-red-600"
                          title="Xóa mùa"
                          aria-label="Xóa mùa"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="opacity-80">Từ:</span> {season.startDate}
                      </div>
                      <div>
                        <span className="opacity-80">Đến:</span> {season.endDate}
                      </div>
                      <div className="col-span-2">
                        <span className="opacity-80">Hệ số giá:</span> 
                        <span className="font-bold ml-1">
                          {season.multiplier}x 
                          {season.multiplier > 1 ? 
                            ` (+${((season.multiplier - 1) * 100).toFixed(0)}%)` : 
                            ` (${((season.multiplier - 1) * 100).toFixed(0)}%)`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Season Form Modal */}
              {showSeasonForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingSeason ? 'Chỉnh sửa mùa' : 'Thêm mùa mới'}
                    </h3>
                    <div className="space-y-4">
                      <FormField
                        label="Tên mùa"
                        name="name"
                        type="text"
                        value={seasonForm.name}
                        onChange={handleSeasonFormChange}
                        placeholder="VD: Mùa hè"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Từ ngày (MM-DD)"
                          name="startDate"
                          type="text"
                          value={seasonForm.startDate}
                          onChange={handleSeasonFormChange}
                          placeholder="06-01"
                          required
                        />
                        <FormField
                          label="Đến ngày (MM-DD)"
                          name="endDate"
                          type="text"
                          value={seasonForm.endDate}
                          onChange={handleSeasonFormChange}
                          placeholder="08-31"
                          required
                        />
                      </div>                      <FormField
                        label="Hệ số giá"
                        name="multiplier"
                        type="number"
                        value={seasonForm.multiplier}
                        onChange={handleSeasonFormChange}
                        placeholder="1.3"
                        step="0.1"
                        required
                        icon={<CurrencyIcon className="w-4 h-4" />}
                      />
                      <FormField
                        label="Icon"
                        name="icon"
                        type="text"
                        value={seasonForm.icon}
                        onChange={handleSeasonFormChange}
                        placeholder="☀️"
                      />
                      <FormField
                        label="Mô tả"
                        name="description"
                        type="textarea"
                        value={seasonForm.description}
                        onChange={handleSeasonFormChange}
                        placeholder="Mô tả về mùa này..."
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6">
                      <button
                        onClick={() => {
                          setShowSeasonForm(false);
                          setEditingSeason(null);
                          resetSeasonForm();
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={saveSeason}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        {editingSeason ? 'Cập nhật' : 'Thêm'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Sự kiện đặc biệt</h3>
                <button
                  onClick={() => {
                    resetEventForm();
                    setShowEventForm(true);
                    setEditingEvent(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Thêm sự kiện
                </button>
              </div>

              {/* Events List */}
              <div className="space-y-3">
                {specialEvents.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Chưa có sự kiện đặc biệt nào</p>
                  </div>
                ) : (
                  specialEvents.map(event => {
                    const eventType = EVENT_TYPES.find(t => t.value === event.type);
                    return (
                      <div key={event.id} className={`border rounded-lg p-4 ${event.isActive ? '' : 'opacity-50'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${eventType?.color}`}>
                              {eventType?.icon} {eventType?.label}
                            </span>
                            <div>
                              <h4 className="font-semibold">{event.name}</h4>
                              <p className="text-sm text-gray-600">{event.description}</p>
                            </div>
                          </div>                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                              title="Chỉnh sửa sự kiện"
                              aria-label="Chỉnh sửa sự kiện"
                            >
                              <EditIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleEventStatus(event.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                              title={event.isActive ? "Tắt sự kiện" : "Bật sự kiện"}
                              aria-label={event.isActive ? "Tắt sự kiện" : "Bật sự kiện"}
                            >
                              <CheckIcon className={`w-4 h-4 ${event.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                              title="Xóa sự kiện"
                              aria-label="Xóa sự kiện"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Từ ngày:</span>
                            <div className="font-medium">{new Date(event.startDate).toLocaleDateString('vi-VN')}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Đến ngày:</span>
                            <div className="font-medium">{new Date(event.endDate).toLocaleDateString('vi-VN')}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Hệ số giá:</span>
                            <div className="font-medium text-blue-600">{event.multiplier}x</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Ưu tiên:</span>
                            <div className="font-medium">{event.priority}</div>
                          </div>
                        </div>
                        {event.roomTypeIds.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <span className="text-sm text-gray-600">Áp dụng cho: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {event.roomTypeIds.map(roomTypeId => {
                                const roomType = roomTypes.find(rt => rt.id === roomTypeId);
                                return (
                                  <span key={roomTypeId} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                    {roomType?.name}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Event Form Modal */}
              {showEventForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto dialog-scroll">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingEvent ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
                    </h3>
                    <div className="space-y-4">
                      <FormField
                        label="Tên sự kiện"
                        name="name"
                        type="text"
                        value={eventForm.name}
                        onChange={handleEventFormChange}
                        placeholder="VD: Tết Nguyên Đán"
                        required
                      />
                      
                      <FormField
                        label="Loại sự kiện"
                        name="type"
                        type="select"
                        value={eventForm.type}
                        onChange={handleEventFormChange}
                        options={EVENT_TYPES.map(type => ({
                          value: type.value,
                          label: `${type.icon} ${type.label}`
                        }))}
                      />                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Từ ngày"
                          name="startDate"
                          type="date"
                          value={eventForm.startDate}
                          onChange={handleEventFormChange}
                          required
                        />
                        <FormField
                          label="Đến ngày"
                          name="endDate"
                          type="date"
                          value={eventForm.endDate}
                          onChange={handleEventFormChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">                        <FormField
                          label="Hệ số giá"
                          name="multiplier"
                          type="number"
                          value={eventForm.multiplier}
                          onChange={handleEventFormChange}
                          placeholder="1.5"
                          step="0.1"
                          required
                          icon={<CurrencyIcon className="w-4 h-4" />}
                        />
                        <FormField
                          label="Độ ưu tiên (1-10)"
                          name="priority"
                          type="number"
                          value={eventForm.priority}
                          onChange={handleEventFormChange}
                          placeholder="5"
                          min="1"
                          max="10"
                          required
                        />
                      </div>

                      <FormField
                        label="Mô tả"
                        name="description"
                        type="textarea"
                        value={eventForm.description}
                        onChange={handleEventFormChange}
                        placeholder="Mô tả về sự kiện..."
                        rows={3}
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Áp dụng cho loại phòng (để trống = tất cả)
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3 dialog-scroll">
                          {roomTypes.map(roomType => (
                            <label key={roomType.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={eventForm.roomTypeIds.includes(roomType.id)}
                                onChange={() => handleRoomTypeToggle(roomType.id)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{roomType.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6">
                      <button
                        onClick={() => {
                          setShowEventForm(false);
                          setEditingEvent(null);
                          resetEventForm();
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={saveEvent}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        {editingEvent ? 'Cập nhật' : 'Thêm'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ChartLineIcon className="w-5 h-5" />
                Xem trước giá theo mùa (30 ngày tới)
              </h3>

              {/* Price Preview */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">Ngày</th>
                      {roomTypes.map(roomType => (
                        <th key={roomType.id} className="border border-gray-300 p-2 text-center">
                          {roomType.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getPreviewData().map((dayData, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 p-2 font-medium">
                          <div>{dayData.dateObj.toLocaleDateString('vi-VN')}</div>
                          <div className="text-xs text-gray-500">
                            {dayData.dateObj.toLocaleDateString('vi-VN', { weekday: 'short' })}
                          </div>
                        </td>
                        {dayData.roomPrices.map(({ roomType, originalPrice, seasonalPrice }) => (
                          <td key={roomType.id} className="border border-gray-300 p-2 text-center">
                            <div className="font-medium text-blue-600">
                              {seasonalPrice.toLocaleString()} VND
                            </div>
                            {seasonalPrice !== originalPrice && (
                              <div className={`text-xs ${
                                seasonalPrice > originalPrice ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {seasonalPrice > originalPrice ? '+' : ''}
                                {((seasonalPrice - originalPrice) / originalPrice * 100).toFixed(0)}%
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
}
