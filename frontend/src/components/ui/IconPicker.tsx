'use client';

import { useState } from 'react';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

// Danh sách icon phổ biến cho amenities khách sạn
const AMENITY_ICONS = [
  // Technology
  { name: 'wifi', emoji: '📶', label: 'WiFi', category: 'Technology' },
  { name: 'tv', emoji: '📺', label: 'TV', category: 'Technology' },
  { name: 'computer', emoji: '💻', label: 'Computer', category: 'Technology' },
  { name: 'phone', emoji: '📞', label: 'Phone', category: 'Technology' },
  { name: 'printer', emoji: '🖨️', label: 'Printer', category: 'Technology' },
  
  // Bathroom
  { name: 'shower', emoji: '🚿', label: 'Shower', category: 'Bathroom' },
  { name: 'bathtub', emoji: '🛁', label: 'Bathtub', category: 'Bathroom' },
  { name: 'toilet', emoji: '🚽', label: 'Toilet', category: 'Bathroom' },
  { name: 'towel', emoji: '🧴', label: 'Toiletries', category: 'Bathroom' },
  
  // Comfort
  { name: 'bed', emoji: '🛏️', label: 'Bed', category: 'Comfort' },
  { name: 'pillow', emoji: '🛌', label: 'Pillow', category: 'Comfort' },
  { name: 'air-conditioning', emoji: '❄️', label: 'Air Conditioning', category: 'Comfort' },
  { name: 'heating', emoji: '🔥', label: 'Heating', category: 'Comfort' },
  { name: 'fan', emoji: '💨', label: 'Fan', category: 'Comfort' },
  
  // Food & Beverage  
  { name: 'coffee', emoji: '☕', label: 'Coffee', category: 'Food & Beverage' },
  { name: 'minibar', emoji: '🍷', label: 'Minibar', category: 'Food & Beverage' },
  { name: 'restaurant', emoji: '🍽️', label: 'Restaurant', category: 'Food & Beverage' },
  { name: 'room-service', emoji: '🛎️', label: 'Room Service', category: 'Food & Beverage' },
  { name: 'kettle', emoji: '🫖', label: 'Kettle', category: 'Food & Beverage' },
  
  // Recreation
  { name: 'swimming-pool', emoji: '🏊', label: 'Swimming Pool', category: 'Recreation' },
  { name: 'gym', emoji: '💪', label: 'Gym', category: 'Recreation' },
  { name: 'spa', emoji: '🧘', label: 'Spa', category: 'Recreation' },
  { name: 'games', emoji: '🎮', label: 'Games', category: 'Recreation' },
  { name: 'library', emoji: '📚', label: 'Library', category: 'Recreation' },
  
  // Safety & Security
  { name: 'safe', emoji: '🔒', label: 'Safe', category: 'Safety & Security' },
  { name: 'security', emoji: '🛡️', label: 'Security', category: 'Safety & Security' },
  { name: 'fire-safety', emoji: '🚨', label: 'Fire Safety', category: 'Safety & Security' },
  { name: 'cctv', emoji: '📹', label: 'CCTV', category: 'Safety & Security' },
  
  // Transportation
  { name: 'parking', emoji: '🅿️', label: 'Parking', category: 'Transportation' },
  { name: 'valet', emoji: '🔑', label: 'Valet', category: 'Transportation' },
  { name: 'shuttle', emoji: '🚐', label: 'Shuttle', category: 'Transportation' },
  { name: 'taxi', emoji: '🚕', label: 'Taxi', category: 'Transportation' },
  
  // General
  { name: 'concierge', emoji: '🤵', label: 'Concierge', category: 'General' },
  { name: 'cleaning', emoji: '🧹', label: 'Cleaning', category: 'General' },
  { name: 'laundry', emoji: '👕', label: 'Laundry', category: 'General' },
  { name: 'balcony', emoji: '🏙️', label: 'Balcony', category: 'General' },
  { name: 'garden', emoji: '🌳', label: 'Garden', category: 'General' },
  { name: 'business', emoji: '💼', label: 'Business Center', category: 'General' },
  { name: 'elevator', emoji: '🛗', label: 'Elevator', category: 'General' },
  { name: 'reception', emoji: '🏨', label: 'Reception', category: 'General' },
  { name: 'luggage', emoji: '🧳', label: 'Luggage Service', category: 'General' },
  { name: 'pet-friendly', emoji: '🐕', label: 'Pet Friendly', category: 'General' },
  { name: 'non-smoking', emoji: '🚭', label: 'Non Smoking', category: 'General' },
];

const CATEGORIES = [
  'All',
  'Technology',
  'Bathroom', 
  'Comfort',
  'Food & Beverage',
  'Recreation',
  'Safety & Security',
  'Transportation',
  'General'
];

export const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  label,
  error,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = AMENITY_ICONS.filter(icon => {
    const matchesCategory = selectedCategory === 'All' || icon.category === selectedCategory;
    const matchesSearch = icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         icon.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedIcon = AMENITY_ICONS.find(icon => icon.name === value);

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Selected Icon Display */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full p-3 border rounded-lg flex items-center space-x-3 bg-white hover:bg-gray-50 transition-colors
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
          `}
        >
          {selectedIcon ? (
            <>
              <span className="text-2xl">{selectedIcon.emoji}</span>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{selectedIcon.label}</div>
                <div className="text-sm text-gray-500">{selectedIcon.name}</div>
              </div>
            </>
          ) : (
            <div className="flex-1 text-left text-gray-500">
              Chọn icon cho tiện ích
            </div>
          )}
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Icon Picker Dropdown */}
        {isOpen && (
          <div className="absolute z-[9999] mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Tìm kiếm icon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
              />
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-1">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-2 py-1 text-xs rounded-full transition-colors
                      ${selectedCategory === category 
                        ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Grid */}
            <div className="max-h-64 overflow-y-auto p-2">
              <div className="grid grid-cols-6 gap-1">
                {filteredIcons.map(icon => (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => handleIconSelect(icon.name)}
                    className={`
                      p-3 rounded-lg hover:bg-gray-100 transition-colors text-center group
                      ${value === icon.name ? 'bg-blue-100 border-2 border-blue-500' : 'border border-transparent'}
                    `}
                    title={icon.label}
                  >
                    <div className="text-2xl mb-1">{icon.emoji}</div>
                    <div className="text-xs text-gray-600 group-hover:text-gray-900 truncate">
                      {icon.label}
                    </div>
                  </button>
                ))}
              </div>
              
              {filteredIcons.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Không tìm thấy icon phù hợp
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Tìm thấy {filteredIcons.length} icon</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
