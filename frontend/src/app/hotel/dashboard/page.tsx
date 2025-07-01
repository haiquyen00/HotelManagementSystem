'use client';

import { useState, useEffect } from 'react';
import { HotelLayout } from '@/components/layout';
import { DashboardStatsSkeleton, TableSkeleton } from '@/components/ui/Skeleton';
import { StatsCard, LineChart, BarChart, DonutChart } from '@/components/ui/Charts';
import { 
  BedIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  CurrencyIcon 
} from '@/components/icons/HotelIcons';

export default function HotelDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <HotelLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-deep-navy">
            Hotel Management Dashboard
          </h2>
          <p className="text-gray-600 mt-2">
            Chào mừng bạn đến với hệ thống quản lý khách sạn
          </p>
        </div>        {/* Stats Cards */}
        {isLoading ? (
          <DashboardStatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Tổng số phòng"
              value={124}
              trend={{ value: 5, isPositive: true, label: "so với tháng trước" }}
              icon={<BedIcon />}
              color="#2B5797"
            />
            
            <StatsCard
              title="Phòng đã đặt"
              value={90}
              trend={{ value: 12, isPositive: true, label: "so với tháng trước" }}
              icon={<CalendarIcon />}
              color="#4A9B8E"
            />
            
            <StatsCard
              title="Tỷ lệ lấp đầy"
              value="73.4%"
              trend={{ value: 8, isPositive: true, label: "tỷ lệ tốt" }}
              icon={<ChartBarIcon />}
              color="#FF6B8A"
            />
            
            <StatsCard
              title="Doanh thu tháng"
              value="45.2M VNĐ"
              trend={{ value: 15, isPositive: true, label: "so với tháng trước" }}
              icon={<CurrencyIcon />}
              color="#FF8C42"
            />
          </div>
        )}

        {/* Charts Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TableSkeleton rows={3} />
            <TableSkeleton rows={3} />
            <TableSkeleton rows={3} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LineChart
              title="Doanh thu 7 ngày qua"
              data={[
                { label: 'T2', value: 4200000 },
                { label: 'T3', value: 3800000 },
                { label: 'T4', value: 5100000 },
                { label: 'T5', value: 4900000 },
                { label: 'T6', value: 6200000 },
                { label: 'T7', value: 7400000 },
                { label: 'CN', value: 8100000 }
              ]}
              className="col-span-2"
            />
            
            <DonutChart
              title="Loại phòng"
              centerText="124"
              data={[
                { label: 'Standard', value: 60, color: '#2B5797' },
                { label: 'Deluxe', value: 35, color: '#4A9B8E' },
                { label: 'Suite', value: 20, color: '#FF6B8A' },
                { label: 'Presidential', value: 9, color: '#FF8C42' }
              ]}
            />
          </div>
        )}

        {/* Additional Charts */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              title="Tỷ lệ lấp đầy theo tháng"
              data={[
                { label: 'Jan', value: 75 },
                { label: 'Feb', value: 82 },
                { label: 'Mar', value: 78 },
                { label: 'Apr', value: 85 },
                { label: 'May', value: 92 },
                { label: 'Jun', value: 88 }
              ]}
            />
            
            <BarChart
              title="Doanh thu theo dịch vụ (triệu VNĐ)"
              data={[
                { label: 'Phòng', value: 25.4 },
                { label: 'F&B', value: 12.8 },
                { label: 'Spa', value: 4.2 },
                { label: 'Dịch vụ khác', value: 2.8 }
              ]}
            />
          </div>
        )}

        {/* Recent Activity & Quick Actions */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TableSkeleton rows={3} />
            <TableSkeleton rows={3} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-deep-navy mb-4">
                Hoạt động gần đây
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-pearl-white rounded-lg">
                  <div className="w-2 h-2 bg-seafoam-green rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-deep-navy">Đặt phòng mới #12345</p>
                    <p className="text-xs text-gray-500">5 phút trước</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-pearl-white rounded-lg">
                  <div className="w-2 h-2 bg-coral-pink rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-deep-navy">Check-out phòng 305</p>
                    <p className="text-xs text-gray-500">15 phút trước</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-pearl-white rounded-lg">
                  <div className="w-2 h-2 bg-sunset-orange rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-deep-navy">Thanh toán hóa đơn #9876</p>
                    <p className="text-xs text-gray-500">30 phút trước</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-deep-navy mb-4">
                Thao tác nhanh
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-gradient-to-r from-ocean-blue to-seafoam-green text-white rounded-lg hover:shadow-lg transition-all">
                  <BedIcon />
                  <p className="text-sm font-medium mt-2">Thêm phòng</p>
                </button>
                <button className="p-4 bg-gradient-to-r from-coral-pink to-sunset-orange text-white rounded-lg hover:shadow-lg transition-all">
                  <CalendarIcon />
                  <p className="text-sm font-medium mt-2">Đặt phòng</p>
                </button>
                <button className="p-4 bg-gradient-to-r from-seafoam-green to-soft-mint text-white rounded-lg hover:shadow-lg transition-all">
                  <ChartBarIcon />
                  <p className="text-sm font-medium mt-2">Báo cáo</p>
                </button>
                <button className="p-4 bg-gradient-to-r from-sunset-orange to-coral-pink text-white rounded-lg hover:shadow-lg transition-all">
                  <CurrencyIcon />
                  <p className="text-sm font-medium mt-2">Doanh thu</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </HotelLayout>
  );
}
