// Enhanced table component with sorting, pagination, and filtering
'use client';

import React, { useState, useMemo } from 'react';
import { Button } from './Button';

export interface Column<T = any> {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface EnhancedTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  showPagination?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  onRowClick?: (record: T, index: number) => void;
}

type SortOrder = 'asc' | 'desc' | null;

export const EnhancedTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'Không có dữ liệu',
  pageSize = 10,
  showPagination = true,
  searchable = true,
  searchPlaceholder = 'Tìm kiếm...',
  className = '',
  onRowClick
}: EnhancedTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Get unique values for filterable columns
  const getFilterOptions = (columnKey: string) => {
    const values = data.map(item => item[columnKey]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(query)
        )
      );
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => 
          String(item[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    return result;
  }, [data, searchQuery, columnFilters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortOrder) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (columnKey: string) => {
    if (sortKey === columnKey) {
      setSortOrder(current => {
        if (current === 'asc') return 'desc';
        if (current === 'desc') return null;
        return 'asc';
      });
    } else {
      setSortKey(columnKey);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (columnKey: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setColumnFilters({});
    setSearchQuery('');
    setSortKey('');
    setSortOrder(null);
    setCurrentPage(1);
  };

  const getSortIcon = (columnKey: string) => {
    if (sortKey !== columnKey) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    if (sortOrder === 'asc') {
      return (
        <svg className="w-4 h-4 text-[#2B5797]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }

    if (sortOrder === 'desc') {
      return (
        <svg className="w-4 h-4 text-[#2B5797]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }

    return null;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-[#E5F3FF] overflow-hidden ${className}`}>
      {/* Table Header Controls */}
      <div className="bg-[#F8FBFF] p-4 border-b border-[#E5F3FF]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {searchable && (
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="pl-10 pr-4 py-2 border border-[#E5F3FF] rounded-lg text-sm font-roboto focus:outline-none focus:ring-2 focus:ring-[#2B5797]/20 focus:border-[#2B5797] transition-all duration-200"
                />
              </div>
            )}

            {(Object.values(columnFilters).some(v => v) || searchQuery || sortKey) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-[#64748B] border-[#E5F3FF] hover:bg-[#F8FBFF]"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Xóa bộ lọc
              </Button>
            )}
          </div>

          <div className="text-sm text-[#64748B] font-roboto">
            Hiển thị {paginatedData.length} / {sortedData.length} kết quả
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#F8FBFF]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-[#1A365D] uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-[#EEF5FF] transition-colors duration-150' : ''
                  }`}
                  style={{ 
                    width: column.width,
                    textAlign: column.align || 'left'
                  }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
            
            {/* Filter Row */}
            <tr className="bg-[#F8FBFF] border-t border-[#E5F3FF]">
              {columns.map((column) => (
                <th key={`filter-${column.key}`} className="px-6 py-2">
                  {column.filterable && (
                    <select
                      value={columnFilters[column.key] || ''}
                      onChange={(e) => handleFilterChange(column.key, e.target.value)}
                      className="w-full text-xs border border-[#E5F3FF] rounded px-2 py-1 font-roboto focus:outline-none focus:ring-1 focus:ring-[#2B5797]/20"
                    >
                      <option value="">Tất cả</option>
                      {getFilterOptions(column.key).map((option) => (
                        <option key={option} value={option}>
                          {String(option)}
                        </option>
                      ))}
                    </select>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-[#E5F3FF]">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <svg className="w-5 h-5 animate-spin text-[#2B5797]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-[#64748B] font-roboto">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="text-[#64748B] font-roboto">
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((record, index) => (
                <tr
                  key={index}
                  className={`hover:bg-[#F8FBFF] transition-colors duration-150 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(record, index)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm font-roboto"
                      style={{ textAlign: column.align || 'left' }}
                    >
                      {column.render ? 
                        column.render(record[column.key], record, index) : 
                        String(record[column.key] || '')
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="bg-[#F8FBFF] px-6 py-3 border-t border-[#E5F3FF]">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#64748B] font-roboto">
              Trang {currentPage} / {totalPages}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="border-[#E5F3FF]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={isActive ? 
                      "bg-[#2B5797] text-white" : 
                      "border-[#E5F3FF] text-[#64748B] hover:bg-[#F8FBFF]"
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="border-[#E5F3FF]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTable;
