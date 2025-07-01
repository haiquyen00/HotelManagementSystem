// Quick actions workflow component
'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import FormField from './FormField';
import { useToast } from '@/hooks/useToast';

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, title, description, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group p-6 bg-white rounded-xl border border-[#E5F3FF] hover:border-[#2B5797] shadow-sm hover:shadow-lg transition-all duration-200 text-left w-full"
    >
      <div className="flex items-start space-x-4">
        <div 
          className="p-3 rounded-lg group-hover:scale-110 transition-transform duration-200"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[#1A365D] font-rubik mb-1">
            {title}
          </h3>
          <p className="text-sm text-[#64748B] font-roboto">
            {description}
          </p>
        </div>
        <div className="text-[#64748B] group-hover:text-[#2B5797] transition-colors duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
};

// Quick Book Room Modal
interface QuickBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickBookModal: React.FC<QuickBookModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: '',
    checkOut: '',
    roomType: '',
    guests: '2'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      success('Đặt phòng thành công', `Đã tạo đặt phòng cho ${formData.guestName}`);
      onClose();
      setFormData({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        checkIn: '',
        checkOut: '',
        roomType: '',
        guests: '2'
      });
    } catch (err) {
      error('Có lỗi xảy ra', 'Vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  const emailValidation = {
    test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Email không hợp lệ'
  };

  const phoneValidation = {
    test: (value: string) => /^[0-9]{10,11}$/.test(value),
    message: 'Số điện thoại phải có 10-11 chữ số'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto dialog-scroll">
        <div className="p-6 border-b border-[#E5F3FF]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#1A365D] font-rubik">
              Đặt phòng nhanh
            </h3>
            <button
              onClick={onClose}
              className="text-[#64748B] hover:text-[#1A365D] transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField
            label="Tên khách hàng"
            name="guestName"
            value={formData.guestName}
            onChange={handleChange}
            required
            placeholder="Nhập tên khách hàng"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          <FormField
            label="Email"
            name="guestEmail"
            type="email"
            value={formData.guestEmail}
            onChange={handleChange}
            required
            placeholder="example@email.com"
            validationRules={[emailValidation]}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />

          <FormField
            label="Số điện thoại"
            name="guestPhone"
            type="tel"
            value={formData.guestPhone}
            onChange={handleChange}
            required
            placeholder="0123456789"
            validationRules={[phoneValidation]}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Ngày nhận phòng"
              name="checkIn"
              type="date"
              value={formData.checkIn}
              onChange={handleChange}
              required
            />

            <FormField
              label="Ngày trả phòng"
              name="checkOut"
              type="date"
              value={formData.checkOut}
              onChange={handleChange}
              required
            />
          </div>

          <FormField
            label="Loại phòng"
            name="roomType"
            type="select"
            value={formData.roomType}
            onChange={handleChange}
            required
            options={[
              { value: 'standard', label: 'Standard - 1,500,000 VNĐ' },
              { value: 'deluxe', label: 'Deluxe - 2,500,000 VNĐ' },
              { value: 'suite', label: 'Suite - 4,500,000 VNĐ' },
              { value: 'presidential', label: 'Presidential - 8,000,000 VNĐ' }
            ]}
          />

          <FormField
            label="Số khách"
            name="guests"
            type="select"
            value={formData.guests}
            onChange={handleChange}
            required
            options={[
              { value: '1', label: '1 người' },
              { value: '2', label: '2 người' },
              { value: '3', label: '3 người' },
              { value: '4', label: '4 người' },
              { value: '5', label: '5 người' },
              { value: '6', label: '6 người' }
            ]}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#E5F3FF]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#2B5797] to-[#4A9B8E]"
            >
              {isLoading ? 'Đang xử lý...' : 'Đặt phòng'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Quick Actions Grid
interface QuickActionsGridProps {
  className?: string;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ className = '' }) => {
  const [showBookModal, setShowBookModal] = useState(false);
  const { success, info } = useToast();

  const actions = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Đặt phòng nhanh',
      description: 'Tạo đặt phòng mới cho khách hàng',
      color: '#2B5797',
      onClick: () => setShowBookModal(true)
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: 'Check-in nhanh',
      description: 'Thực hiện check-in cho khách đã đặt',
      color: '#4A9B8E',
      onClick: () => info('Tính năng check-in', 'Chức năng này sẽ được phát triển')
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      title: 'Check-out nhanh',
      description: 'Hoàn tất check-out và thanh toán',
      color: '#FF6B8A',
      onClick: () => info('Tính năng check-out', 'Chức năng này sẽ được phát triển')
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V9a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Báo cáo nhanh',
      description: 'Xem báo cáo doanh thu và thống kê',
      color: '#FF8C42',
      onClick: () => info('Tính năng báo cáo', 'Chức năng này sẽ được phát triển')
    }
  ];

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
        {actions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </div>

      <QuickBookModal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
      />
    </>
  );
};

export default QuickActionsGrid;
