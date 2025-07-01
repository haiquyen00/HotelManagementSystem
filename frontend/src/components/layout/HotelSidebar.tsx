'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartLineIcon,
  BedIcon,
  CogIcon,
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  ListIcon,
  TagIcon,
  EditIcon,
  BarsIcon,
  TimesIcon,
  ChevronRightIcon,
  HomeIcon,
  UserIcon,
  CurrencyIcon,
  ChatIcon
} from '@/components/icons/HotelIcons';

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Tổng quan',
    href: '/hotel/dashboard',
    icon: ChartLineIcon,
  },  {
    id: 'rooms',
    label: 'Quản lý phòng',
    href: '/hotel/rooms',
    icon: BedIcon,
    children: [
      { id: 'room-list', label: 'Danh sách phòng', href: '/hotel/rooms', icon: ListIcon },
      { id: 'room-types', label: 'Loại phòng', href: '/hotel/room-types', icon: TagIcon },
    ],
  },{
    id: 'amenities',
    label: 'Quản lý tiện nghi',
    href: '/hotel/amenities',
    icon: CogIcon,
  },
  {
    id: 'pricing',
    label: 'Quản lý giá',
    href: '/hotel/pricing',
    icon: CurrencyIcon,
  },
  {
    id: 'coupons',
    label: 'Mã giảm giá',
    href: '/hotel/coupons',
    icon: TagIcon,
  },
  {
    id: 'bookings',
    label: 'Đặt phòng',
    href: '/hotel/bookings',
    icon: CalendarIcon,
    children: [
      { id: 'booking-list', label: 'Danh sách đặt phòng', href: '/hotel/bookings', icon: EditIcon },
      { id: 'booking-calendar', label: 'Lịch đặt phòng', href: '/hotel/bookings/calendar', icon: CalendarIcon },
    ],
  },
  {
    id: 'customers',
    label: 'Khách hàng',
    href: '/hotel/customers',
    icon: UsersIcon,
  },
  {
    id: 'chat',
    label: 'Chat khách hàng',
    href: '/hotel/chat',
    icon: ChatIcon,
  },
  {
    id: 'reports',
    label: 'Báo cáo',
    href: '/hotel/reports',
    icon: ChartBarIcon,
  },
  {
    id: 'features',
    label: 'Quản lý tính năng',
    href: '/hotel/features',
    icon: CogIcon,
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    href: '/hotel/settings',
    icon: CogIcon,
  },
];

interface HotelSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const HotelSidebar: React.FC<HotelSidebarProps> = ({ isCollapsed, onToggle }) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['rooms', 'bookings']);

  const toggleExpanded = (itemId: string) => {
    if (isCollapsed) return;
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };
  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id) && !isCollapsed;
    const active = isActive(item.href);
    const IconComponent = item.icon;

    return (
      <div key={item.id}>        <div
          className={`flex items-center justify-between transition-all duration-200 ${
            level > 0 ? (isCollapsed ? 'pl-2 pr-2' : 'pl-1 pr-2') : 'px-2'
          } py-3 mx-2 text-sm cursor-pointer group relative rounded-lg ${
            active
              ? 'bg-[#4A9B8E] text-white shadow-lg border-r-4 border-[#8FD3C7] font-semibold'
              : 'text-gray-200 hover:bg-[#2B5797]/30 hover:text-white hover:shadow-md'
          }`}
        >
          {active && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8FD3C7] rounded-r-full" />
          )}
          <Link href={item.href} className="flex items-center flex-1 min-w-0">
            <div className={`flex-shrink-0 ${isCollapsed ? 'mr-0' : 'mr-4'} ${active ? 'scale-110' : 'group-hover:scale-105'} transition-transform duration-200`}>
              <IconComponent />
            </div>
            {!isCollapsed && (
              <span className={`truncate font-medium ${active ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            )}
          </Link>
          
          {hasChildren && !isCollapsed && (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleExpanded(item.id);
              }}
              className="p-2 hover:bg-[#2B5797]/40 rounded-md transition-all duration-200"
              title={isExpanded ? 'Thu gọn menu' : 'Mở rộng menu'}
              aria-label={isExpanded ? 'Thu gọn menu' : 'Mở rộng menu'}
            >
              <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                <ChevronRightIcon />
              </div>
            </button>
          )}
        </div>

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="bg-[#1A365D]/50 border-l-2 border-[#4A9B8E]/50 ml-6 space-y-1 py-2">
            {item.children!.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
        {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-gradient-to-b from-[#1A365D] via-[#1e3a72] to-[#2B5797]
        text-[#F8F9FA] shadow-2xl border-r border-[#4A9B8E]/20
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        flex flex-col
      `}>        {/* Header */}
        <div className={`p-4 border-b border-[#4A9B8E]/20 ${isCollapsed ? 'px-2' : ''} bg-[#1A365D]/30`}>
          {isCollapsed ? (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-r from-[#4A9B8E] to-[#8FD3C7] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
                <HomeIcon />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#4A9B8E] to-[#8FD3C7] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
                <HomeIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-lg text-[#F8F9FA] truncate leading-tight">
                  Hotel Manager
                </h2>
                <p className="text-xs text-[#8FD3C7] truncate opacity-90">
                  Hệ thống quản lý khách sạn
                </p>
              </div>
            </div>
          )}
        </div>        {/* Toggle Button */}
        <div className="px-4 py-2">
          <button
            onClick={onToggle}
            className={`
              relative w-full flex items-center justify-center
              h-8 rounded-md transition-all duration-200
              ${isCollapsed 
                ? 'bg-[#4A9B8E]/20 hover:bg-[#4A9B8E]/30' 
                : 'bg-[#2B5797]/30 hover:bg-[#2B5797]/50'
              }
              group overflow-hidden
            `}
            title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {/* Animated Hamburger Icon */}
            <div className="relative w-4 h-3 flex flex-col justify-between">
              <span 
                className={`
                  block h-0.5 bg-white rounded-full transition-all duration-300 transform origin-center
                  ${isCollapsed 
                    ? 'rotate-0 translate-y-0' 
                    : 'rotate-45 translate-y-1'
                  }
                `}
              />
              <span 
                className={`
                  block h-0.5 bg-white rounded-full transition-all duration-200
                  ${isCollapsed ? 'opacity-100' : 'opacity-0'}
                `}
              />
              <span 
                className={`
                  block h-0.5 bg-white rounded-full transition-all duration-300 transform origin-center
                  ${isCollapsed 
                    ? 'rotate-0 translate-y-0' 
                    : '-rotate-45 -translate-y-1'
                  }
                `}
              />
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md" />
          </button>
        </div>        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-1 sidebar-scroll">
          {sidebarItems.map(item => renderSidebarItem(item))}
        </nav>{/* Footer */}
        <div className={`p-4 border-t border-[#4A9B8E]/20 ${isCollapsed ? 'px-2' : ''} bg-[#1A365D]/30`}>
          {isCollapsed ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B8A] to-[#FF8C42] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
                <UserIcon />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B8A] to-[#FF8C42] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
                <UserIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#F8F9FA] truncate">
                  Admin User
                </p>
                <p className="text-xs text-[#8FD3C7] truncate opacity-90">
                  admin@hotel.com
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
