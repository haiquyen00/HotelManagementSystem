'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { Card, Button, Table, Modal } from '@/components/ui';
import { useAuth } from '@/contexts';
import { ProtectedRoute } from '@/components/guards';

// Mock data cho demo
const mockUsers = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', role: 'user', createdAt: '2025-01-01' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', role: 'admin', createdAt: '2025-01-02' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', role: 'user', createdAt: '2025-01-03' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const tableColumns = [
    {
      key: 'name' as const,
      label: 'Tên',
    },
    {
      key: 'email' as const,
      label: 'Email',
    },
    {
      key: 'role' as const,
      label: 'Vai trò',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value === 'admin' ? 'Quản trị' : 'Người dùng'}
        </span>
      ),
    },
    {
      key: 'createdAt' as const,
      label: 'Ngày tạo',
    },
  ];

  const handleRowClick = (row: any) => {
    setSelectedUser(row);
    setIsModalOpen(true);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Chào mừng {user?.fullName || 'bạn'} quay trải!
            </p>
            <p className="text-sm text-gray-500">
              Vai trò: {user?.role?.displayName || 'Người dùng'}
            </p>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">150</div>
            <div className="text-sm text-gray-600">Tổng người dùng</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">89</div>
            <div className="text-sm text-gray-600">Hoạt động</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">24</div>
            <div className="text-sm text-gray-600">Chờ duyệt</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">12</div>
            <div className="text-sm text-gray-600">Báo lỗi</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Thao tác nhanh" className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Button>Thêm người dùng</Button>
            <Button variant="outline">Xuất báo cáo</Button>
            <Button variant="ghost">Cài đặt</Button>
            <Button 
              variant="secondary"
              onClick={() => setIsModalOpen(true)}
            >
              Mở Modal Demo
            </Button>
          </div>
        </Card>

        {/* Users Table */}
        <Card title="Danh sách người dùng" subtitle="Quản lý người dùng trong hệ thống">
          <Table 
            data={mockUsers}
            columns={tableColumns}
            onRowClick={handleRowClick}
          />
        </Card>

        {/* Demo Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedUser ? `Thông tin: ${selectedUser.name}` : 'Demo Modal'}
          size="md"
        >
          {selectedUser ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên:</label>
                <p className="text-gray-900">{selectedUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email:</label>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vai trò:</label>
                <p className="text-gray-900">{selectedUser.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày tạo:</label>
                <p className="text-gray-900">{selectedUser.createdAt}</p>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Đóng
                </Button>
                <Button>Chỉnh sửa</Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">
                Đây là một modal demo để showcase component Modal.
              </p>
              <p className="text-gray-600 mb-6">
                Bạn có thể sử dụng modal này để hiển thị form, thông tin chi tiết, 
                hoặc xác nhận các hành động.
              </p>
              <div className="flex justify-end">
                <Button onClick={() => setIsModalOpen(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
    </ProtectedRoute>
  );
}
