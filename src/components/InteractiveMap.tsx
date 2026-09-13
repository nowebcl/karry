import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Coordinates for Salamanca, Chile (Plaza de Armas)
const SALAMANCA_CENTER: [number, number] = [-31.7804674, -70.9649896];
const HOSPITAL_COORDS: [number, number] = [-31.7779000, -70.9675000];

interface TaxiSimulator {
  id: string;
  name: string;
  plate: string;
  lat: number;
  lng: number;
  heading: number;
}

// 5 Taxis strictly positioned on Salamanca streets
const INITIAL_TAXIS: TaxiSimulator[] = [
  { id: '1', name: 'Don Juan', plate: 'XY-12-34', lat: -31.7802000, lng: -70.9644000, heading: 90 },
  { id: '2', name: 'Don Luis', plate: 'AB-56-CD', lat: -31.7792000, lng: -70.9625000, heading: 135 },
  { id: '3', name: 'Don Pedro', plate: 'ZZ-99-AA', lat: -31.7818000, lng: -70.9672000, heading: 270 },
  { id: '4', name: 'Don Carlos', plate: 'HC-44-GG', lat: -31.7788000, lng: -70.9654000, heading: 180 },
  { id: '5', name: 'Don Miguel', plate: 'JK-88-PL', lat: -31.7822000, lng: -70.9652000, heading: 0 }
];

interface InteractiveMapProps {
  height?: string;
  onSelectLocation?: (lat: number, lng: number) => void;
  showNearbyTaxis?: boolean;
  showRoute?: boolean;
  originCoords?: [number, number];
  destinationCoords?: [number, number];
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  height = '240px',
  onSelectLocation,
  showNearbyTaxis = true,
  showRoute = false,
  originCoords = SALAMANCA_CENTER,
  destinationCoords = HOSPITAL_COORDS
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const [taxis] = useState<TaxiSimulator[]>(INITIAL_TAXIS);

  // 1. Initialize Leaflet Map safely
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent duplicate map initialization if container already has _leaflet_id
    if ((mapContainerRef.current as any)._leaflet_id) {
      return;
    }

    // Fix default Leaflet icon paths safely
    try {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    } catch (err) {
      console.warn('Leaflet icon config error ignored:', err);
    }

    const activeMap = L.map(mapContainerRef.current, {
      center: showRoute ? originCoords : SALAMANCA_CENTER,
      zoom: showRoute ? 15 : 16,
      zoomControl: false,
      attributionControl: false
    });

    // Clean, modern bright map tiles for Karry Salamanca
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(activeMap);

    mapInstanceRef.current = activeMap;

    // Click listener
    if (onSelectLocation) {
      activeMap.on('click', (e) => {
        onSelectLocation(e.latlng.lat, e.latlng.lng);
      });
    }

    // Force size invalidation safely across transitions
    const timer = setTimeout(() => {
      if (activeMap && (activeMap as any)._loaded) {
        activeMap.invalidateSize();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      // Clean up markers
      Object.values(markersRef.current).forEach((m) => {
        try { m.remove(); } catch (_) {}
      });
      markersRef.current = {};
      
      if (routePolylineRef.current) {
        try { routePolylineRef.current.remove(); } catch (_) {}
        routePolylineRef.current = null;
      }

      try {
        activeMap.off();
        activeMap.remove();
      } catch (e) {
        console.warn('Map cleanup error:', e);
      }
      mapInstanceRef.current = null;
    };
  }, [onSelectLocation, showRoute, originCoords]);

  // 2. Render Taxi Markers Safely
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !showNearbyTaxis) return;

    const createTaxiIcon = (heading: number) => {
      return L.divIcon({
        className: 'custom-taxi-marker',
        html: `<div style="
          transform: rotate(${heading}deg); 
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
        ">
          <svg viewBox="0 0 24 24" width="24" height="24" style="
            filter: drop-shadow(0 2px 6px rgba(29, 65, 51, 0.4));
          ">
            <path 
              d="M6 4C6 2.34315 7.34315 1 9 1H15C16.6569 1 18 2.34315 18 4V20C18 21.6569 16.6569 23 15 23H9C7.34315 23 6 21.6569 6 20V4Z" 
              fill="#1D4133" 
              stroke="#8EDF6F" 
              stroke-width="2" 
              stroke-linejoin="round"
            />
            <path 
              d="M8 8H16V13C16 14.1046 15.1046 15 14 15H10C8.89543 15 8 14.1046 8 13V8Z" 
              fill="#8EDF6F" 
              opacity="0.9" 
            />
            <rect x="7.5" y="1.5" width="2" height="1.2" rx="0.4" fill="#FFFFFF" />
            <rect x="14.5" y="1.5" width="2" height="1.2" rx="0.4" fill="#FFFFFF" />
          </svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    taxis.forEach((taxi) => {
      const position: [number, number] = [taxi.lat, taxi.lng];

      try {
        if (markersRef.current[taxi.id]) {
          markersRef.current[taxi.id].setLatLng(position);
          markersRef.current[taxi.id].setIcon(createTaxiIcon(taxi.heading));
        } else if (map && (map as any)._loaded && (map as any)._container) {
          const marker = L.marker(position, {
            icon: createTaxiIcon(taxi.heading)
          }).addTo(map);

          marker.bindTooltip(`<strong>${taxi.name}</strong><br/>Radiotaxi: ${taxi.plate}`, {
            permanent: false,
            direction: 'top'
          });

          markersRef.current[taxi.id] = marker;
        }
      } catch (err) {
        console.warn('Error adding taxi marker:', err);
      }
    });
  }, [mapInstanceRef.current, taxis, showNearbyTaxis]);

  // 3. Draw Route Polyline when showRoute is enabled
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !showRoute) return;

    const routeWaypoints: [number, number][] = [
      originCoords,
      [-31.7798, -70.9655],
      [-31.7788, -70.9666],
      destinationCoords
    ];

    try {
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
      }

      const polyline = L.polyline(routeWaypoints, {
        color: '#22C55E',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routePolylineRef.current = polyline;

      // Add Origin Marker (Green Circle)
      L.circleMarker(originCoords, {
        radius: 8,
        fillColor: '#1D4133',
        color: '#FFFFFF',
        weight: 3,
        fillOpacity: 1
      }).addTo(map);

      // Add Destination Marker (Red Pin)
      L.circleMarker(destinationCoords, {
        radius: 8,
        fillColor: '#EF4444',
        color: '#FFFFFF',
        weight: 3,
        fillOpacity: 1
      }).addTo(map);

      map.fitBounds(polyline.getBounds(), { padding: [30, 30] });
    } catch (err) {
      console.warn('Error drawing route polyline:', err);
    }
  }, [mapInstanceRef.current, showRoute, originCoords, destinationCoords]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: height === '100%' ? '100%' : height,
      minHeight: height === '100%' ? '100%' : height,
      borderRadius: '16px',
      overflow: 'hidden',
      backgroundColor: '#EBF2ED'
    }}>
      <div 
        ref={mapContainerRef} 
        style={{ 
          height: '100%', 
          width: '100%', 
          backgroundColor: '#EBF2ED'
        }} 
      />

      {/* Dynamic Overlay HUD Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        zIndex: 500,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #E2ECE7',
        borderRadius: '20px',
        padding: '5px 12px',
        fontSize: '0.68rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 700,
        color: '#1D4133',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        pointerEvents: 'none'
      }}>
        <span style={{
          display: 'inline-block',
          width: '7px',
          height: '7px',
          backgroundColor: '#22C55E',
          borderRadius: '50%'
        }} />
        <span>Karry Salamanca · 5 conductores en línea</span>
      </div>
    </div>
  );
};
