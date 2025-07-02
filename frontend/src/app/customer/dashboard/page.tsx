'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts';
import { RoleBasedRoute } from '@/components/guards';
import { Card, Button } from '@/components/ui';

// Mock data for customer dashboard
const mockBookings = [
  {
    id: 1,
    roomNumber: '301',
    roomType: 'Deluxe',
    checkIn: '2025-01-15',
    checkOut: '2025-01-18',
    status: 'confirmed',
    price: 2500000
  },
  {
    id: 2,
    roomNumber: '205',
    roomType: 'Standard',
    checkIn: '2025-02-20',
    checkOut: '2025-02-23',
    status: 'pending',
    price: 1800000
  }
];

const mockServices = [
  { id: 1, name: 'Spa & Massage', price: 500000, available: true },
  { id: 2, name: 'Airport Transfer', price: 300000, available: true },
  { id: 3, name: 'Room Service', price: 150000, available: true },
  { id: 4, name: 'Laundry Service', price: 100000, available: true }
];

interface Booking {
  id: number;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: string;
  price: number;
}

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  // Using selectedBooking for future modal implementation
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <RoleBasedRoute allowedRoles={['customer']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Khách Hàng
                </h1>
                <p className="text-gray-600 mt-2">
                  Chào mừng {user?.fullName} đến với hệ thống quản lý đặt phòng
                </p>
              </div>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Đặt phòng mới
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {mockBookings.length}
              </div>
              <div className="text-sm text-gray-600">Tổng số đặt phòng</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {mockBookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Đặt phòng đã xác nhận</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {mockBookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Chờ xác nhận</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Bookings */}
            <Card title="Đặt phòng của tôi" subtitle="Quản lý các đặt phòng hiện tại">
              <div className="space-y-4">
                {mockBookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Phòng {booking.roomNumber} - {booking.roomType}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {booking.checkIn} đến {booking.checkOut}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-600">
                        {booking.price.toLocaleString()} VNĐ
                      </span>
                      <Button variant="outline" size="sm">
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Available Services */}
            <Card title="Dịch vụ khả dụng" subtitle="Các dịch vụ bổ sung cho kỳ nghỉ của bạn">
              <div className="space-y-3">
                {mockServices.map((service) => (
                  <div key={service.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600">
                        {service.price.toLocaleString()} VNĐ
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!service.available}
                    >
                      {service.available ? 'Đặt dịch vụ' : 'Hết chỗ'}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card title="Thao tác nhanh" className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center bg-blue-600 text-white hover:bg-blue-700">
                  <span className="text-lg mb-1">🏨</span>
                  <span className="text-sm">Đặt phòng</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center bg-green-600 text-white hover:bg-green-700">
                  <span className="text-lg mb-1">💰</span>
                  <span className="text-sm">Thanh toán</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center bg-purple-600 text-white hover:bg-purple-700">
                  <span className="text-lg mb-1">🛎️</span>
                  <span className="text-sm">Dịch vụ</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center bg-orange-600 text-white hover:bg-orange-700">
                  <span className="text-lg mb-1">📞</span>
                  <span className="text-sm">Hỗ trợ</span>
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card title="Hoạt động gần đây" className="lg:col-span-2">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Đặt phòng #12345 đã được xác nhận</p>
                    <p className="text-xs text-gray-500">2 giờ trước</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Thanh toán thành công</p>
                    <p className="text-xs text-gray-500">1 ngày trước</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Yêu cầu dịch vụ Spa đang chờ xử lý</p>
                    <p className="text-xs text-gray-500">2 ngày trước</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </RoleBasedRoute>
  );
}