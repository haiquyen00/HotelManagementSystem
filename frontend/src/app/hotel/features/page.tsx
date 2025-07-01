'use client';

import { useState, useEffect } from 'react';
import { HotelLayout } from '@/components/layout';
import { useToast } from '@/hooks/useToast';
import FormField from '@/components/ui/FormField';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { DashboardStatsSkeleton, TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { EnhancedTable } from '@/components/ui/EnhancedTable';
import { FeatureConfigDialog } from '@/components/ui/FeatureConfigDialog';
import { 
  CogIcon, 
  CalendarIcon, 
  BedIcon,
  ChartBarIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XIcon,
  UsersIcon,
  CurrencyIcon
} from '@/components/icons/HotelIcons';

// Types
interface Feature {
  id: string;
  name: string;
  description: string;
  category: 'booking' | 'pricing' | 'guest' | 'admin' | 'integration' | 'security';
  isEnabled: boolean;
  isRequired: boolean;
  config: Record<string, any>;
  lastModified: string;
  modifiedBy: string;
}

interface FeatureCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'booking',
    name: 'Đặt phòng',
    description: 'Quản lý tính năng đặt phòng và booking',
    icon: CalendarIcon,
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 'pricing',
    name: 'Định giá',
    description: 'Quản lý hệ thống định giá và khuyến mãi',
    icon: CurrencyIcon,
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    id: 'guest',
    name: 'Khách hàng',
    description: 'Quản lý trải nghiệm khách hàng',
    icon: UsersIcon,
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    id: 'admin',
    name: 'Quản trị',
    description: 'Công cụ quản trị hệ thống',
    icon: CogIcon,
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    id: 'integration',
    name: 'Tích hợp',
    description: 'Tích hợp với hệ thống bên ngoài',
    icon: ChartBarIcon,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  {
    id: 'security',
    name: 'Bảo mật',
    description: 'Bảo mật và kiểm soát truy cập',
    icon: CheckIcon,
    color: 'bg-red-100 text-red-800 border-red-200'
  }
];

const MOCK_FEATURES: Feature[] = [
  {
    id: 'online-booking',
    name: 'Đặt phòng trực tuyến',
    description: 'Cho phép khách hàng đặt phòng trực tuyến qua website',
    category: 'booking',
    isEnabled: true,
    isRequired: true,
    config: {
      allowCancellation: true,
      cancellationPeriod: 24,
      requireDeposit: true,
      depositPercentage: 20
    },
    lastModified: '2024-06-13T10:30:00Z',
    modifiedBy: 'Admin'
  },
  {
    id: 'dynamic-pricing',
    name: 'Định giá động',
    description: 'Tự động điều chỉnh giá phòng theo nhu cầu và thời gian',
    category: 'pricing',
    isEnabled: false,
    isRequired: false,
    config: {
      maxIncrease: 50,
      maxDecrease: 20,
      seasonalAdjustment: true,
      demandBasedPricing: false
    },
    lastModified: '2024-06-12T15:45:00Z',
    modifiedBy: 'Admin'
  },
  {
    id: 'loyalty-program',
    name: 'Chương trình khách hàng thân thiết',
    description: 'Hệ thống tích điểm và ưu đãi cho khách hàng thường xuyên',
    category: 'guest',
    isEnabled: true,
    isRequired: false,
    config: {
      pointsPerBooking: 100,
      redemptionRate: 0.01,
      tierLevels: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      tierBenefits: true
    },
    lastModified: '2024-06-11T09:15:00Z',
    modifiedBy: 'Manager'
  },
  {
    id: 'automated-emails',
    name: 'Email tự động',
    description: 'Gửi email xác nhận, nhắc nhở và chăm sóc khách hàng tự động',
    category: 'guest',
    isEnabled: true,
    isRequired: false,
    config: {
      bookingConfirmation: true,
      reminderEmails: true,
      reminderDays: 3,
      thankYouEmails: true,
      promotionalEmails: false
    },
    lastModified: '2024-06-10T14:20:00Z',
    modifiedBy: 'Admin'
  },
  {
    id: 'room-upgrade',
    name: 'Nâng cấp phòng tự động',
    description: 'Tự động đề xuất nâng cấp phòng khi có sẵn',
    category: 'booking',
    isEnabled: false,
    isRequired: false,
    config: {
      upgradeThreshold: 80,
      maxUpgradePrice: 500000,
      notifyGuest: true,
      autoApprove: false
    },
    lastModified: '2024-06-09T11:30:00Z',
    modifiedBy: 'Manager'
  },
  {
    id: 'mobile-checkin',
    name: 'Check-in di động',
    description: 'Cho phép khách hàng check-in qua ứng dụng di động',
    category: 'guest',
    isEnabled: true,
    isRequired: false,
    config: {
      qrCodeCheckin: true,
      digitalKey: false,
      earlyCheckin: true,
      earlyCheckinFee: 200000
    },
    lastModified: '2024-06-08T16:45:00Z',
    modifiedBy: 'IT Team'
  },
  {
    id: 'revenue-analytics',
    name: 'Phân tích doanh thu',
    description: 'Báo cáo và phân tích chi tiết về doanh thu khách sạn',
    category: 'admin',
    isEnabled: true,
    isRequired: false,
    config: {
      dailyReports: true,
      weeklyReports: true,
      monthlyReports: true,
      predictiveAnalytics: false,
      exportFormats: ['PDF', 'Excel']
    },
    lastModified: '2024-06-07T13:15:00Z',
    modifiedBy: 'Finance'
  },
  {
    id: 'two-factor-auth',
    name: 'Xác thực hai yếu tố',
    description: 'Bảo mật tài khoản với xác thực hai yếu tố',
    category: 'security',
    isEnabled: false,
    isRequired: false,
    config: {
      smsVerification: true,
      emailVerification: true,
      authenticatorApp: false,
      mandatoryForAdmin: true
    },
    lastModified: '2024-06-06T08:30:00Z',
    modifiedBy: 'Security Team'
  }
];

export default function HotelFeaturesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [configForm, setConfigForm] = useState<Record<string, any>>({});

  const toast = useToast();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setFeatures(MOCK_FEATURES);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleFeature = async (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    if (feature.isRequired && feature.isEnabled) {
      toast.error('Không thể tắt tính năng bắt buộc này');
      return;
    }

    try {
      setFeatures(prev => prev.map(f => 
        f.id === featureId 
          ? { 
              ...f, 
              isEnabled: !f.isEnabled,
              lastModified: new Date().toISOString(),
              modifiedBy: 'Current User'
            }
          : f
      ));
      
      toast.success(
        feature.isEnabled 
          ? `Đã tắt tính năng: ${feature.name}` 
          : `Đã bật tính năng: ${feature.name}`
      );
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật tính năng');
    }
  };

  const openConfigDialog = (feature: Feature) => {
    setSelectedFeature(feature);
    setConfigForm(feature.config || {});
    setShowConfigDialog(true);
  };
  const handleConfigChange = (key: string, value: any) => {
    setConfigForm(prev => ({ ...prev, [key]: value }));
  };

  const saveConfiguration = (newConfig: any) => {
    if (!selectedFeature) return;

    try {
      setFeatures(prev => prev.map(f => 
        f.id === selectedFeature.id 
          ? { 
              ...f, 
              config: newConfig,
              lastModified: new Date().toISOString(),
              modifiedBy: 'Current User'
            }
          : f
      ));

      toast.success(`Đã lưu cấu hình cho: ${selectedFeature.name}`);
      setShowConfigDialog(false);
      setSelectedFeature(null);
      setConfigForm({});
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu cấu hình');
    }
  };

  const getFilteredFeatures = () => {
    if (selectedCategory === 'all') {
      return features;
    }
    return features.filter(f => f.category === selectedCategory);
  };

  const getCategoryStats = () => {
    const stats = FEATURE_CATEGORIES.map(category => ({
      ...category,
      total: features.filter(f => f.category === category.id).length,
      enabled: features.filter(f => f.category === category.id && f.isEnabled).length
    }));

    return [
      {
        id: 'all',
        name: 'Tất cả',
        description: 'Tổng quan tất cả tính năng',
        icon: CogIcon,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        total: features.length,
        enabled: features.filter(f => f.isEnabled).length
      },
      ...stats
    ];
  };

  const tableColumns = [
    {
      key: 'name',
      title: 'Tính năng',
      sortable: true,
      render: (feature: Feature) => {
        const category = FEATURE_CATEGORIES.find(c => c.id === feature.category);
        return (
          <div className="flex items-center space-x-3">
            {category && <category.icon className="w-5 h-5 text-blue-600" />}
            <div>
              <div className="font-medium text-gray-900">{feature.name}</div>
              <div className="text-sm text-gray-500">{feature.description}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'category',
      title: 'Danh mục',
      sortable: true,
      render: (feature: Feature) => {
        const category = FEATURE_CATEGORIES.find(c => c.id === feature.category);
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category?.color}`}>
            {category?.name}
          </span>
        );
      }
    },
    {
      key: 'isEnabled',
      title: 'Trạng thái',
      sortable: true,
      render: (feature: Feature) => (
        <div className="flex items-center space-x-2">          <button
            onClick={() => toggleFeature(feature.id)}
            disabled={feature.isRequired && feature.isEnabled}
            title={feature.isEnabled ? 'Tắt tính năng' : 'Bật tính năng'}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              feature.isEnabled 
                ? 'bg-blue-600' 
                : 'bg-gray-200'
            } ${feature.isRequired && feature.isEnabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                feature.isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${
            feature.isEnabled ? 'text-green-600' : 'text-gray-500'
          }`}>
            {feature.isEnabled ? 'Bật' : 'Tắt'}
          </span>
          {feature.isRequired && (
            <span className="text-xs text-orange-600 font-medium">(Bắt buộc)</span>
          )}
        </div>
      )
    },
    {
      key: 'lastModified',
      title: 'Cập nhật cuối',
      sortable: true,
      render: (feature: Feature) => (
        <div className="text-sm">
          <div className="text-gray-900">
            {new Date(feature.lastModified).toLocaleDateString('vi-VN')}
          </div>
          <div className="text-gray-500">bởi {feature.modifiedBy}</div>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      sortable: false,
      render: (feature: Feature) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openConfigDialog(feature)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Cấu hình"
          >
            <CogIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];
  const filteredFeatures = getFilteredFeatures();
  const categoryStats = getCategoryStats();

  return (
    <HotelLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý tính năng</h1>
            <p className="text-gray-600 mt-1">
              Bật/tắt và cấu hình các tính năng của hệ thống khách sạn
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Danh mục tính năng</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryStats.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <category.icon className="w-6 h-6 text-blue-600" />
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {category.enabled}/{category.total} đang bật
                  </span>                  <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-blue-500 transition-all ${
                        category.total > 0 
                          ? category.enabled === category.total 
                            ? 'w-full' 
                            : category.enabled > category.total * 0.75 
                            ? 'w-3/4' 
                            : category.enabled > category.total * 0.5 
                            ? 'w-1/2' 
                            : category.enabled > category.total * 0.25 
                            ? 'w-1/4' 
                            : 'w-1'
                          : 'w-0'
                      }`}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features Table */}
        <div className="bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <TableSkeleton rows={8} />
          ) : filteredFeatures.length === 0 ? (
            <EmptyState
              icon={<CogIcon className="w-12 h-12" />}
              title="Không có tính năng nào"
              description="Không tìm thấy tính năng nào trong danh mục này"
            />
          ) : (
            <EnhancedTable
              data={filteredFeatures}
              columns={tableColumns}
              searchPlaceholder="Tìm kiếm tính năng..."
            />
          )}
        </div>        {/* Advanced Configuration Dialog */}
        <FeatureConfigDialog
          isOpen={showConfigDialog}
          onClose={() => {
            setShowConfigDialog(false);
            setSelectedFeature(null);
            setConfigForm({});
          }}
          onSave={saveConfiguration}
          feature={selectedFeature}
        />
      </div>
    </HotelLayout>
  );
}
