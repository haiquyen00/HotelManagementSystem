// Breadcrumbs navigation component with coastal theme
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Trang chủ', href: '/hotel/dashboard', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )}
    ];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip the first 'hotel' segment as it's not user-facing
      if (segment === 'hotel') return;
      
      const isLast = index === pathSegments.length - 1;
      const label = getSegmentLabel(segment);
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  };

  const getSegmentLabel = (segment: string): string => {
    const labelMap: Record<string, string> = {
      dashboard: 'Tổng quan',
      rooms: 'Quản lý phòng',
      amenities: 'Tiện ích',
      bookings: 'Đặt phòng',
      guests: 'Khách hàng',
      reports: 'Báo cáo',
      settings: 'Cài đặt',
      profile: 'Hồ sơ',
      add: 'Thêm mới',
      edit: 'Chỉnh sửa',
      view: 'Xem chi tiết'
    };

    return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg 
                className="w-4 h-4 text-[#64748B] mx-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center space-x-1 text-[#2B5797] hover:text-[#1E3A8A] font-roboto transition-colors duration-200"
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="flex items-center space-x-1 text-[#64748B] font-roboto font-medium">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
