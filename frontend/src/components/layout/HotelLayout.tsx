'use client';

import { useState } from 'react';
import { HotelSidebar } from './HotelSidebar';
import Breadcrumbs from '../ui/Breadcrumbs';
import GlobalSearch from '../ui/GlobalSearch';

interface HotelLayoutProps {
  children: React.ReactNode;
}

export const HotelLayout: React.FC<HotelLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-pearl-white">
      {/* Sidebar */}
      <HotelSidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Toggle Button */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md bg-[#2B5797]/10 hover:bg-[#2B5797]/20 transition-all duration-200"
                title="Toggle Menu"
              >
                <div className="relative w-5 h-4 flex flex-col justify-between">
                  <span 
                    className={`
                      block h-0.5 bg-[#2B5797] rounded-full transition-all duration-300 transform origin-center
                      ${isSidebarCollapsed 
                        ? 'rotate-0 translate-y-0' 
                        : 'rotate-45 translate-y-1.5'
                      }
                    `}
                  />
                  <span 
                    className={`
                      block h-0.5 bg-[#2B5797] rounded-full transition-all duration-200
                      ${isSidebarCollapsed ? 'opacity-100' : 'opacity-0'}
                    `}
                  />
                  <span 
                    className={`
                      block h-0.5 bg-[#2B5797] rounded-full transition-all duration-300 transform origin-center
                      ${isSidebarCollapsed 
                        ? 'rotate-0 translate-y-0' 
                        : '-rotate-45 -translate-y-1.5'
                      }
                    `}
                  />
                </div>
              </button>
              
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-deep-navy font-rubik">Dashboard</h1>
                <p className="text-sm text-gray-600">Quản lý khách sạn hiệu quả</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Global Search */}
              <div className="hidden md:block">
                <GlobalSearch className="w-64" />
              </div>
              
              {/* Notifications */}
              <button 
                className="relative p-2 text-gray-400 hover:text-ocean-blue transition-colors"
                title="Thông báo"
                aria-label="Xem thông báo"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5a8.38 8.38 0 0 0 0-11.84L19 1l-3 3.5V17z" />
                </svg>
                <span className="absolute top-0 right-0 w-3 h-3 bg-coral-pink rounded-full"></span>
              </button>
              
              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-seafoam-green to-soft-mint rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AU</span>
                </div>
                <span className="text-sm font-medium text-deep-navy">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-100 px-6 py-3">
          <Breadcrumbs />
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-pearl-white content-scroll">
          {children}
        </main>
      </div>
    </div>
  );
};
