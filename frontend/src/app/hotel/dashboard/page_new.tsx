'use client';

import { useState, useEffect } from 'react';
import { HotelLayout } from '@/components/layout';
import { DashboardStatsSkeleton, TableSkeleton } from '@/components/ui/Skeleton';
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
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <DashboardStatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-ocean-blue">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Tổng số phòng</p>
                  <p className="text-3xl font-bold text-deep-navy">124</p>
                  <p className="text-xs text-gray-500">So với tháng trước</p>
                </div>
                <div className="text-ocean-blue bg-ocean-blue/10 p-3 rounded-full">
                  <BedIcon />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-seafoam-green">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Phòng đã đặt</p>
                  <p className="text-3xl font-bold text-deep-navy">90</p>
                  <p className="text-xs text-seafoam-green">↗ +12% so với tháng trước</p>
                </div>
                <div className="text-seafoam-green bg-seafoam-green/10 p-3 rounded-full">
                  <CalendarIcon />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-coral-pink">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Tỷ lệ lấp đầy</p>
                  <p className="text-3xl font-bold text-deep-navy">73.4%</p>
                  <p className="text-xs text-coral-pink">↗ Tỷ lệ tốt</p>
                </div>
                <div className="text-coral-pink bg-coral-pink/10 p-3 rounded-full">
                  <ChartBarIcon />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-sunset-orange">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Doanh thu tháng</p>
                  <p className="text-3xl font-bold text-deep-navy">45.2M</p>
                  <p className="text-xs text-gray-500">VNĐ</p>
                </div>
                <div className="text-sunset-orange bg-sunset-orange/10 p-3 rounded-full">
                  <CurrencyIcon />
                </div>
              </div>
            </div>
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
