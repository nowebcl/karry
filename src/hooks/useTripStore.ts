import { useState, useEffect, useCallback } from 'react';
import type { Trip, Message, TripStatus } from '../types';

const CHANNEL_NAME = 'karry_trips_channel';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useTripStore = () => {
  // Current user details
  const [role, setRoleState] = useState<'passenger' | 'driver' | 'admin'>(() => {
    return (localStorage.getItem('karry_user_role') as 'passenger' | 'driver' | 'admin') || 'passenger';
  });

  const [passengerName, setPassengerName] = useState(() => localStorage.getItem('karry_passenger_name') || '');
  const [passengerPhone, setPassengerPhone] = useState(() => localStorage.getItem('karry_passenger_phone') || '');

  // Driver details
  const [driverName, setDriverName] = useState(() => localStorage.getItem('karry_driver_name') || '');
  const [driverPhone, setDriverPhone] = useState(() => localStorage.getItem('karry_driver_phone') || '');
  const [driverPlate, setDriverPlate] = useState(() => localStorage.getItem('karry_driver_plate') || '');
  const [driverIsApproved, setDriverIsApproved] = useState(() => localStorage.getItem('karry_driver_approved') === 'true');

  // Trips list
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('karry_trips');
    return saved ? JSON.parse(saved) : [];
  });

  // Broadcast Channel for real-time synchronization between tabs
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  useEffect(() => {
    const bc = new BroadcastChannel(CHANNEL_NAME);
    setChannel(bc);

    bc.onmessage = (event) => {
      if (event.data?.type === 'UPDATE_TRIPS') {
        setTrips(event.data.trips);
        localStorage.setItem('karry_trips', JSON.stringify(event.data.trips));
      }
    };

    return () => {
      bc.close();
    };
  }, []);

  // Set role and persist
  const setRole = (newRole: 'passenger' | 'driver' | 'admin') => {
    setRoleState(newRole);
    localStorage.setItem('karry_user_role', newRole);
  };

  // Sync trips across all instances and save locally
  const syncTrips = useCallback((updatedTrips: Trip[]) => {
    setTrips(updatedTrips);
    localStorage.setItem('karry_trips', JSON.stringify(updatedTrips));
    if (channel) {
      channel.postMessage({ type: 'UPDATE_TRIPS', trips: updatedTrips });
    }
  }, [channel]);

  // Helper to save passenger profile
  const savePassengerProfile = (name: string, phone: string) => {
    setPassengerName(name);
    setPassengerPhone(phone);
    localStorage.setItem('karry_passenger_name', name);
    localStorage.setItem('karry_passenger_phone', phone);
  };

  // Helper to save driver profile
  const saveDriverProfile = (name: string, phone: string, plate: string) => {
    setDriverName(name);
    setDriverPhone(phone);
    setDriverPlate(plate);
    localStorage.setItem('karry_driver_name', name);
    localStorage.setItem('karry_driver_phone', phone);
    localStorage.setItem('karry_driver_plate', plate);
  };

  // Set driver approved status
  const approveDriver = (approved: boolean) => {
    setDriverIsApproved(approved);
    localStorage.setItem('karry_driver_approved', approved ? 'true' : 'false');
  };

  // Passenger requests a new trip
  const requestTrip = (origin: string, destination: string, estimatedPrice: number) => {
    const newTrip: Trip = {
      id: generateId(),
      passengerName,
      passengerPhone,
      origin,
      destination,
      price: estimatedPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
      messages: [],
    };

    const updated = [newTrip, ...trips];
    syncTrips(updated);
    return newTrip;
  };

  // Driver accepts a trip
  const acceptTrip = (tripId: string) => {
    const updated = trips.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          status: 'accepted' as TripStatus,
          driverId: 'drv_' + driverPlate,
          driverName,
          driverPhone,
          driverPlate,
          eta: '3-5 min',
        };
      }
      return t;
    });
    syncTrips(updated);
  };

  // Driver signals arrival
  const driverArrived = (tripId: string) => {
    const updated = trips.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          status: 'arrived' as TripStatus,
        };
      }
      return t;
    });
    syncTrips(updated);
  };

  // Driver starts the trip (passenger gets in)
  const startTrip = (tripId: string) => {
    const updated = trips.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          status: 'in_progress' as TripStatus,
        };
      }
      return t;
    });
    syncTrips(updated);
  };

  // Driver completes trip
  const completeTrip = (tripId: string) => {
    const updated = trips.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          status: 'completed' as TripStatus,
        };
      }
      return t;
    });
    syncTrips(updated);
  };

  // Cancel trip (either by passenger or driver)
  const cancelTrip = (tripId: string, cancelledBy: 'passenger' | 'driver', reason?: string) => {
    const updated = trips.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          status: 'cancelled' as TripStatus,
          cancelledBy,
          cancellationReason: reason,
        };
      }
      return t;
    });
    syncTrips(updated);
  };

  // Send a message in a trip session
  const sendChatMessage = (tripId: string, sender: 'passenger' | 'driver', text: string) => {
    const updated = trips.map(t => {
      if (t.id === tripId) {
        const newMessage: Message = {
          id: generateId(),
          sender,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        return {
          ...t,
          messages: [...t.messages, newMessage],
        };
      }
      return t;
    });
    syncTrips(updated);
  };

  // Reset demo storage to clear state
  const resetDemo = () => {
    localStorage.clear();
    setPassengerName('');
    setPassengerPhone('');
    setDriverName('');
    setDriverPhone('');
    setDriverPlate('');
    setDriverIsApproved(false);
    setTrips([]);
    setRoleState('passenger');
  };

  return {
    role,
    setRole,
    passengerName,
    passengerPhone,
    savePassengerProfile,
    driverName,
    driverPhone,
    driverPlate,
    driverIsApproved,
    saveDriverProfile,
    approveDriver,
    trips,
    requestTrip,
    acceptTrip,
    driverArrived,
    startTrip,
    completeTrip,
    cancelTrip,
    sendChatMessage,
    resetDemo,
  };
};
