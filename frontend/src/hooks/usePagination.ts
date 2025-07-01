'use client';

import { useState } from 'react';
import { PaginationParams } from '@/types';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export const usePagination = (options: UsePaginationOptions = {}) => {
  const { initialPage = 1, initialLimit = 10 } = options;

  const [pagination, setPagination] = useState<PaginationParams>({
    page: initialPage,
    limit: initialLimit,
  });

  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const setLimit = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 })); // Reset về trang 1 khi thay đổi limit
  };

  const setSearch = (search: string) => {
    setPagination(prev => ({ ...prev, search, page: 1 })); // Reset về trang 1 khi search
  };

  const setSortBy = (sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
    setPagination(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const nextPage = () => {
    if (pagination.page < totalPages) {
      setPage(pagination.page + 1);
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      setPage(pagination.page - 1);
    }
  };

  const updatePaginationInfo = (info: { totalPages: number; totalCount: number }) => {
    setTotalPages(info.totalPages);
    setTotalCount(info.totalCount);
  };

  const reset = () => {
    setPagination({
      page: initialPage,
      limit: initialLimit,
    });
    setTotalPages(0);
    setTotalCount(0);
  };

  return {
    pagination,
    totalPages,
    totalCount,
    setPage,
    setLimit,
    setSearch,
    setSortBy,
    nextPage,
    prevPage,
    updatePaginationInfo,
    reset,
    hasNextPage: pagination.page < totalPages,
    hasPrevPage: pagination.page > 1,
  };
};
