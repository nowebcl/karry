export type TripStatus = 'pending' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

export interface Message {
  id: string;
  sender: 'passenger' | 'driver';
  text: string;
  timestamp: string;
}

export interface Trip {
  id: string;
  passengerName: string;
  passengerPhone: string;
  origin: string;
  destination: string;
  price: number;
  status: TripStatus;
  driverId?: string;
  driverName?: string;
  driverPlate?: string;
  driverPhone?: string;
  createdAt: string;
  messages: Message[];
  eta?: string; // Estimated time of arrival (e.g. '3 mins')
  passengerCancellationsCount?: number;
  passengerWarnings?: string[];
  cancelledBy?: 'passenger' | 'driver';
  cancellationReason?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  plate: string;
  rating: number;
  tripsCompleted: number;
  avatarUrl: string;
  isApproved: boolean;
  licensePhotoUrl?: string;
}

export type UserRole = 'passenger' | 'driver' | 'admin';
