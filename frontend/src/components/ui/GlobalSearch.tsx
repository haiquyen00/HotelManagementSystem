// Global search component with coastal theme
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  type: 'room' | 'guest' | 'booking' | 'amenity' | 'page';
  icon?: React.ReactNode;
}

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ 
  className = '', 
  placeholder = 'Tìm kiếm phòng, khách hàng, đặt phòng...' 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search data - In real app, this would come from API
  const mockData: SearchResult[] = [
    {
      id: '1',
      title: 'Phòng 101 - Deluxe Ocean View',
      subtitle: 'Trạng thái: Có sẵn • 2 giường đôi',
      href: '/hotel/rooms/101',
      type: 'room',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      )
    },
    {
      id: '2',
      title: 'Nguyễn Văn An',
      subtitle: 'Khách VIP • SĐT: 0987654321',
      href: '/hotel/guests/1',
      type: 'guest',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: '3',
      title: 'Đặt phòng #BK001',
      subtitle: 'Nguyễn Văn An • 15/12/2024 - 20/12/2024',
      href: '/hotel/bookings/BK001',
      type: 'booking',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: '4',
      title: 'Spa & Wellness Center',
      subtitle: 'Tiện ích • Giá: 500,000 VNĐ',
      href: '/hotel/amenities/spa',
      type: 'amenity',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ];

  // Simulate search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const filtered = mockData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const getTypeStyles = (type: SearchResult['type']) => {
    switch (type) {
      case 'room':
        return 'bg-blue-100 text-blue-700';
      case 'guest':
        return 'bg-green-100 text-green-700';
      case 'booking':
        return 'bg-purple-100 text-purple-700';
      case 'amenity':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'room': return 'Phòng';
      case 'guest': return 'Khách';
      case 'booking': return 'Đặt phòng';
      case 'amenity': return 'Tiện ích';
      default: return 'Trang';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-[#E5F3FF] rounded-lg focus:ring-2 focus:ring-[#2B5797] focus:border-[#2B5797] bg-white font-roboto text-sm transition-all duration-200"
        />
        
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="animate-spin w-4 h-4 text-[#64748B]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.trim() || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5F3FF] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto content-scroll">
          {!query.trim() ? (
            <div className="p-4 text-center text-[#64748B] font-roboto">
              <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>Nhập từ khóa để tìm kiếm</p>
            </div>
          ) : results.length === 0 && !isLoading ? (
            <div className="p-4 text-center text-[#64748B] font-roboto">
              <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0120 12a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
              <p>Không tìm thấy kết quả nào</p>
            </div>
          ) : (
            <div>
              {results.map((result, index) => (
                <Link
                  key={result.id}
                  href={result.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 hover:bg-[#F8FBFF] transition-colors duration-150 ${
                    index !== results.length - 1 ? 'border-b border-[#E5F3FF]' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 text-[#2B5797]">
                      {result.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-[#1A365D] font-rubik truncate">
                          {result.title}
                        </p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeStyles(result.type)}`}>
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      {result.subtitle && (
                        <p className="text-xs text-[#64748B] font-roboto mt-1 truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
