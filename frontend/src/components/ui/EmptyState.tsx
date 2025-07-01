// Beautiful empty state components with coastal theme
'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      {icon && (
        <div className="mb-6 text-[#4A9B8E] opacity-60">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-semibold font-rubik text-[#1A365D] mb-2">
        {title}
      </h3>
      
      <p className="text-[#64748B] font-roboto mb-6 max-w-sm leading-relaxed">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-6 py-3 bg-[#2B5797] text-white font-rubik font-medium rounded-lg hover:bg-[#1E3A8A] transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {action.label}
        </button>
      )}
    </div>
  );
};

// Specific Empty States for Hotel Management

export const NoRoomsEmpty: React.FC<{ onAddRoom?: () => void }> = ({ onAddRoom }) => {
  const icon = (
    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
    </svg>
  );

  return (
    <EmptyState
      icon={icon}
      title="Chưa có phòng nào"
      description="Bắt đầu bằng cách thêm phòng đầu tiên vào hệ thống quản lý khách sạn của bạn."
      action={onAddRoom ? { label: "Thêm phòng mới", onClick: onAddRoom } : undefined}
    />
  );
};

export const NoAmenitiesEmpty: React.FC<{ onAddAmenity?: () => void }> = ({ onAddAmenity }) => {
  const icon = (
    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  return (
    <EmptyState
      icon={icon}
      title="Chưa có tiện ích nào"
      description="Thêm các tiện ích và dịch vụ để nâng cao trải nghiệm của khách hàng."
      action={onAddAmenity ? { label: "Thêm tiện ích", onClick: onAddAmenity } : undefined}
    />
  );
};

export const NoBookingsEmpty: React.FC<{ onAddBooking?: () => void }> = ({ onAddBooking }) => {
  const icon = (
    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  return (
    <EmptyState
      icon={icon}
      title="Chưa có đặt phòng nào"
      description="Chưa có khách hàng nào đặt phòng. Hãy bắt đầu tiếp thị để thu hút khách hàng."
      action={onAddBooking ? { label: "Tạo đặt phòng", onClick: onAddBooking } : undefined}
    />
  );
};

export const NoSearchResultsEmpty: React.FC<{ searchQuery?: string; onClearSearch?: () => void }> = ({ 
  searchQuery, 
  onClearSearch 
}) => {
  const icon = (
    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  return (
    <EmptyState
      icon={icon}
      title="Không tìm thấy kết quả"
      description={
        searchQuery 
          ? `Không tìm thấy kết quả nào cho "${searchQuery}". Hãy thử với từ khóa khác.`
          : "Không tìm thấy kết quả nào phù hợp với tìm kiếm của bạn."
      }
      action={onClearSearch ? { label: "Xóa bộ lọc", onClick: onClearSearch } : undefined}
    />
  );
};

export const NoGuestsEmpty: React.FC<{ onAddGuest?: () => void }> = ({ onAddGuest }) => {
  const icon = (
    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  return (
    <EmptyState
      icon={icon}
      title="Chưa có khách hàng nào"
      description="Danh sách khách hàng của bạn còn trống. Hãy thêm thông tin khách hàng đầu tiên."
      action={onAddGuest ? { label: "Thêm khách hàng", onClick: onAddGuest } : undefined}
    />
  );
};

export const ServerErrorEmpty: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  const icon = (
    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );

  return (
    <EmptyState
      icon={icon}
      title="Có lỗi xảy ra"
      description="Không thể tải dữ liệu. Vui lòng thử lại sau hoặc liên hệ hỗ trợ kỹ thuật."
      action={onRetry ? { label: "Thử lại", onClick: onRetry } : undefined}
    />
  );
};
