'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { UploadIcon, DownloadIcon, CalendarIcon } from '@/components/icons/HotelIcons';

interface SeasonalPricing {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  priceMultiplier: number;
  description: string;
  color: string;
}

interface ImportExportToolsProps {
  roomTypes: any[];
  onImportComplete: (data: any[]) => void;
}

const SEASONAL_PRESETS: Omit<SeasonalPricing, 'id'>[] = [
  {
    name: 'Mùa cao điểm (Tết)',
    startDate: '2024-02-08',
    endDate: '2024-02-18',
    priceMultiplier: 2.5,
    description: 'Dịp Tết Nguyên Đán - Giá tăng cao',
    color: '#FF6B8A'
  },
  {
    name: 'Mùa hè (Du lịch)',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    priceMultiplier: 1.5,
    description: 'Mùa du lịch hè - Giá tăng vừa',
    color: '#FF8C42'
  },
  {
    name: 'Cuối tuần',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    priceMultiplier: 1.3,
    description: 'Giá cuối tuần (Thứ 6, 7, CN)',
    color: '#4A9B8E'
  },
  {
    name: 'Mùa thấp điểm',
    startDate: '2024-01-15',
    endDate: '2024-02-07',
    priceMultiplier: 0.8,
    description: 'Sau Tết - Giá giảm để kích cầu',
    color: '#2B5797'
  },
];

export const ImportExportTools: React.FC<ImportExportToolsProps> = ({
  roomTypes,
  onImportComplete
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showSeasonalModal, setShowSeasonalModal] = useState(false);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  
  const { showToast } = useToast();

  const generateCSVTemplate = () => {
    const headers = ['Date', 'RoomTypeId', 'RoomTypeName', 'Price', 'Reason'];
    const sampleData = [
      ['2024-01-15', '1', 'Standard Room', '800000', 'Giá thường ngày'],
      ['2024-01-15', '2', 'Deluxe Room', '1200000', 'Giá thường ngày'],
      ['2024-01-20', '1', 'Standard Room', '1000000', 'Cuối tuần'],
      ['2024-01-20', '2', 'Deluxe Room', '1500000', 'Cuối tuần'],
    ];
    
    return [headers, ...sampleData].map(row => row.join(',')).join('\n');
  };

  const downloadTemplate = () => {
    const csvContent = generateCSVTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'pricing_template.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    showToast('Đã tải xuống template CSV', 'success');
  };

  const exportCurrentPricing = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const headers = ['Date', 'RoomTypeId', 'RoomTypeName', 'BasePrice', 'CurrentPrice', 'Reason'];
      const exportData = [headers];
      
      // Generate export data for next 30 days
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
        const dateStr = date.toISOString().split('T')[0];
        
        roomTypes.forEach(roomType => {
          exportData.push([
            dateStr,
            roomType.id,
            roomType.name,
            roomType.basePrice.toString(),
            (roomType.basePrice * (1 + Math.random() * 0.3)).toFixed(0),
            i % 7 >= 5 ? 'Cuối tuần' : 'Ngày thường'
          ]);
        });
      }
      
      const csvContent = exportData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `pricing_export_${today.toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      showToast('Xuất dữ liệu thành công', 'success');
    } catch (error) {
      showToast('Có lỗi xảy ra khi xuất dữ liệu', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      if (!headers.includes('Date') || !headers.includes('RoomTypeId') || !headers.includes('Price')) {
        throw new Error('File CSV không đúng định dạng. Vui lòng sử dụng template.');
      }

      const importedData = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 3) {
          const dateIndex = headers.indexOf('Date');
          const roomTypeIdIndex = headers.indexOf('RoomTypeId');
          const priceIndex = headers.indexOf('Price');
          const reasonIndex = headers.indexOf('Reason');
          
          importedData.push({
            date: values[dateIndex],
            roomTypeId: values[roomTypeIdIndex],
            price: parseFloat(values[priceIndex]),
            reason: values[reasonIndex] || 'Import từ CSV'
          });
        }
      }

      onImportComplete(importedData);
      showToast(`Đã import ${importedData.length} bản ghi thành công`, 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Có lỗi xảy ra khi import', 'error');
    } finally {
      setIsImporting(false);
      // Reset input
      event.target.value = '';
    }
  };

  const applySeasonalPricing = () => {
    const seasonalRules = selectedSeasons.map(seasonId => {
      const season = SEASONAL_PRESETS.find(s => s.name === seasonId);
      return season;
    }).filter(Boolean);

    const generatedRules: any[] = [];
    
    seasonalRules.forEach(season => {
      if (!season) return;
      
      const startDate = new Date(season.startDate);
      const endDate = new Date(season.endDate);
      
      // Generate rules for each day in the season
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        
        roomTypes.forEach(roomType => {
          generatedRules.push({
            date: dateStr,
            roomTypeId: roomType.id,
            price: Math.round(roomType.basePrice * season.priceMultiplier),
            reason: season.name
          });
        });
      }
    });

    onImportComplete(generatedRules);
    setShowSeasonalModal(false);
    setSelectedSeasons([]);
    showToast(`Đã áp dụng ${generatedRules.length} quy tắc giá theo mùa`, 'success');
  };

  const toggleSeason = (seasonName: string) => {
    setSelectedSeasons(prev => 
      prev.includes(seasonName)
        ? prev.filter(s => s !== seasonName)
        : [...prev, seasonName]
    );
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={downloadTemplate}
          className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-ocean-blue text-ocean-blue rounded-lg hover:bg-ocean-blue/5 transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          <span className="font-medium">Tải template CSV</span>
        </button>

        <label className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-seafoam-green text-seafoam-green rounded-lg hover:bg-seafoam-green/5 transition-colors cursor-pointer">
          <UploadIcon className="w-5 h-5" />
          <span className="font-medium">
            {isImporting ? 'Đang import...' : 'Import CSV'}
          </span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileImport}
            className="hidden"
            disabled={isImporting}
          />
        </label>

        <button
          onClick={exportCurrentPricing}
          disabled={isExporting}
          className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-sunset-orange text-sunset-orange rounded-lg hover:bg-sunset-orange/5 transition-colors disabled:opacity-50"
        >
          <DownloadIcon className="w-5 h-5" />
          <span className="font-medium">
            {isExporting ? 'Đang xuất...' : 'Xuất dữ liệu'}
          </span>
        </button>
      </div>

      {/* Seasonal Pricing */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-pearl-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-deep-navy">Thiết lập giá theo mùa</h3>
            <p className="text-sm text-gray-600">Áp dụng nhanh giá cho các mùa và sự kiện đặc biệt</p>
          </div>
          <button
            onClick={() => setShowSeasonalModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-coral-pink to-sunset-orange text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Thiết lập mùa</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SEASONAL_PRESETS.map(season => (
            <div
              key={season.name}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              style={{ borderColor: season.color + '40' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: season.color }}
                />
                <span className="text-xs text-gray-500">
                  x{season.priceMultiplier}
                </span>
              </div>
              <h4 className="font-medium text-deep-navy text-sm">{season.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{season.description}</p>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(season.startDate).toLocaleDateString('vi-VN')} - {new Date(season.endDate).toLocaleDateString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Modal */}
      {showSeasonalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 m-4 max-h-[80vh] overflow-y-auto dialog-scroll">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-deep-navy">Chọn mùa áp dụng</h3>
              <button
                onClick={() => setShowSeasonalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {SEASONAL_PRESETS.map(season => (
                <label
                  key={season.name}
                  className="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer hover:bg-pearl-white transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedSeasons.includes(season.name)}
                    onChange={() => toggleSeason(season.name)}
                    className="text-ocean-blue focus:ring-ocean-blue"
                  />
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: season.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-deep-navy">{season.name}</h4>
                      <span className="text-sm font-semibold text-coral-pink">
                        x{season.priceMultiplier}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{season.description}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(season.startDate).toLocaleDateString('vi-VN')} - {new Date(season.endDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowSeasonalModal(false);
                  setSelectedSeasons([]);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={applySeasonalPricing}
                disabled={selectedSeasons.length === 0}
                className="px-4 py-2 bg-ocean-blue text-white hover:bg-ocean-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Áp dụng ({selectedSeasons.length} mùa)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-pearl-white p-4 rounded-lg">
        <h4 className="text-sm font-medium text-deep-navy mb-2">Hướng dẫn sử dụng</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• <strong>Template CSV:</strong> Tải về file mẫu để biết định dạng dữ liệu</li>
          <li>• <strong>Import CSV:</strong> Tải lên file CSV với dữ liệu giá phòng theo ngày</li>
          <li>• <strong>Xuất dữ liệu:</strong> Tải về toàn bộ giá phòng hiện tại</li>
          <li>• <strong>Giá theo mùa:</strong> Áp dụng nhanh giá cho các khoảng thời gian đặc biệt</li>
        </ul>
      </div>
    </div>
  );
};
