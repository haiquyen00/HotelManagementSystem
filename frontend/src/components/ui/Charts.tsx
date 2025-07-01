// Data visualization charts with coastal theme
'use client';

import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface LineChartProps {
  data: ChartData[];
  title?: string;
  height?: number;
  className?: string;
}

interface BarChartProps {
  data: ChartData[];
  title?: string;
  height?: number;
  className?: string;
}

interface DonutChartProps {
  data: ChartData[];
  title?: string;
  centerText?: string;
  className?: string;
}

// Simple Line Chart
export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  title, 
  height = 200, 
  className = '' 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={`bg-white rounded-xl p-6 border border-[#E5F3FF] shadow-sm ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-[#1A365D] font-rubik mb-4">{title}</h3>
      )}
      
      <div className="relative">
        <svg 
          width="100%" 
          height={height} 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          className="border border-[#E5F3FF] rounded-lg"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5F3FF" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Area under line */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill="url(#gradient)"
            opacity="0.3"
          />
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#2B5797"
            strokeWidth="0.8"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.value - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill="#2B5797"
              />
            );
          })}
          
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2B5797" />
              <stop offset="100%" stopColor="#4A9B8E" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Labels */}
        <div className="flex justify-between mt-2 text-xs text-[#64748B] font-roboto">
          {data.map((item, index) => (
            <span key={index} className="truncate max-w-[60px]">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple Bar Chart
export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  height = 300, 
  className = '' 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = ['#2B5797', '#4A9B8E', '#FF6B8A', '#FF8C42', '#8FD3C7'];

  return (
    <div className={`bg-white rounded-xl p-6 border border-[#E5F3FF] shadow-sm ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-[#1A365D] font-rubik mb-4">{title}</h3>
      )}
      
      <div className="flex items-end justify-between space-x-2" style={{ height }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          const color = item.color || colors[index % colors.length];
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative group">
                <div
                  className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: color,
                    minHeight: '4px'
                  }}
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#1A365D] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {item.value.toLocaleString()}
                </div>
              </div>
              
              <span className="mt-2 text-xs text-[#64748B] font-roboto text-center max-w-full truncate">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Simple Donut Chart
export const DonutChart: React.FC<DonutChartProps> = ({ 
  data, 
  title, 
  centerText, 
  className = '' 
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#2B5797', '#4A9B8E', '#FF6B8A', '#FF8C42', '#8FD3C7'];
  
  let cumulativePercentage = 0;

  return (
    <div className={`bg-white rounded-xl p-6 border border-[#E5F3FF] shadow-sm ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-[#1A365D] font-rubik mb-4">{title}</h3>
      )}
      
      <div className="flex items-center space-x-6">
        {/* Chart */}
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 42 42" className="transform -rotate-90">
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#E5F3FF"
              strokeWidth="3"
            />
            
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -cumulativePercentage;
              const color = item.color || colors[index % colors.length];
              
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke={color}
                  strokeWidth="3"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
          
          {/* Center text */}
          {centerText && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1A365D] font-rubik">
                  {centerText}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="flex-1 space-y-2">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            const color = item.color || colors[index % colors.length];
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#1A365D] font-roboto truncate">
                      {item.label}
                    </span>
                    <span className="text-sm text-[#64748B] font-roboto ml-2">
                      {percentage}%
                    </span>
                  </div>
                  <div className="text-xs text-[#64748B] font-roboto">
                    {item.value.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Stats Card with trend
interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  trend,
  icon,
  color = '#2B5797',
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-xl p-6 border-l-4 shadow-sm ${className}`} style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#64748B] font-roboto mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-[#1A365D] font-rubik mb-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center space-x-1">
              <svg 
                className={`w-4 h-4 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {trend.isPositive ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                )}
              </svg>
              <span className={`text-sm font-roboto ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(trend.value)}% {trend.label}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div 
            className="p-3 rounded-full"
            style={{ 
              backgroundColor: `${color}20`,
              color: color
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
