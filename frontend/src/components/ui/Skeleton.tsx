// Loading skeleton components with coastal theme
'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div 
      className={`animate-pulse bg-gradient-to-r from-[#E5F3FF] via-[#F0F8FF] to-[#E5F3FF] bg-[length:200%_100%] rounded ${className}`}
      style={{
        animation: 'shimmer 2s ease-in-out infinite',
      }}
    />
  );
};

// Stats Card Skeleton
export const StatsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5F3FF] shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
};

// Table Row Skeleton
export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="border-b border-[#E5F3FF]">
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-16" />
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </td>
    </tr>
  );
};

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5F3FF] overflow-hidden">
      {/* Table Header Skeleton */}
      <div className="bg-[#F8FBFF] px-6 py-4 border-b border-[#E5F3FF]">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>
      
      {/* Table Body Skeleton */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#F8FBFF]">
            <tr>
              <th className="px-6 py-3">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="px-6 py-3">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="px-6 py-3">
                <Skeleton className="h-4 w-18" />
              </th>
              <th className="px-6 py-3">
                <Skeleton className="h-4 w-14" />
              </th>
              <th className="px-6 py-3">
                <Skeleton className="h-4 w-16" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <TableRowSkeleton key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Card List Skeleton
export const CardListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl p-6 border border-[#E5F3FF] shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex space-x-2 mt-4">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
            <div className="ml-4 space-y-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Dashboard Stats Grid Skeleton
export const DashboardStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
    </div>
  );
};

// Form Skeleton
export const FormSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5F3FF] shadow-sm space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
      <div className="flex space-x-3">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-20 rounded-lg" />
      </div>
    </div>
  );
};
