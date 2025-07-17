// Hotel Management Types
export interface Room {
  id: string;
  number: string;
  type: 'standard' | 'deluxe' | 'suite' | 'presidential';
  capacity: number;
  price: number;
  description: string;
  amenities: string[];
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  createdAt: Date;
  updatedAt: Date;
}

export interface Amenity {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  description: string;
  icon: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HotelStats {
  totalRooms: number;
  bookedRooms: number;
  occupancyRate: number;
  monthlyRevenue: number;
  availableRooms: number;
  maintenanceRooms: number;
}

export interface Booking {
  id: string;
  roomId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';
  totalAmount: number;
}
