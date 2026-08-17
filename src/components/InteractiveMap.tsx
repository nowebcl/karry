import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Coordinates for Salamanca, Chile (Plaza de Armas - Exact center provided by user)
const SALAMANCA_CENTER: [number, number] = [-31.7804674, -70.9649896];

interface TaxiSimulator {
  id: string;
  name: string;
  plate: string;
  lat: number;
  lng: number;
  heading: number; // angle for car icon orientation
}

// 5 Taxis strictly positioned on Salamanca streets (not in the center of the Plaza)
const INITIAL_TAXIS: TaxiSimulator[] = [
  { id: '1', name: 'Don Juan', plate: 'XY-12-34', lat: -31.7802000, lng: -70.9644000, heading: 90 },     // Calle Bulnes (Side of Plaza)
  { id: '2', name: 'Don Luis', plate: 'AB-56-CD', lat: -31.7792000, lng: -70.9625000, heading: 135 },    // Near Hospital / Unimarc Area (Calle Prat)
  { id: '3', name: 'Don Pedro', plate: 'ZZ-99-AA', lat: -31.7818000, lng: -70.9672000, heading: 270 },   // Near Terminal Area (Calle Providencia)
  { id: '4', name: 'Don Carlos', plate: 'HC-44-GG', lat: -31.7788000, lng: -70.9654000, heading: 180 },   // Calle Blas Vial (North)
  { id: '5', name: 'Don Miguel', plate: 'JK-88-PL', lat: -31.7822000, lng: -70.9652000, heading: 0 }     // Calle Matilde Salamanca (South)
];

interface InteractiveMapProps {
  height?: string;
  onSelectLocation?: (lat: number, lng: number) => void;
  showNearbyTaxis?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  height = '240px',
  onSelectLocation,
  showNearbyTaxis = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMapInstance] = useState<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [taxis] = useState<TaxiSimulator[]>(INITIAL_TAXIS);

  // 1. Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current || map) return;

    // Fix default Leaflet icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    const activeMap = L.map(mapContainerRef.current, {
      center: SALAMANCA_CENTER,
      zoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    // Dark-mode OSM Tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(activeMap);

    setMapInstance(activeMap);

    // Click handler to select coordinates
    if (onSelectLocation) {
      activeMap.on('click', (e) => {
        onSelectLocation(e.latlng.lat, e.latlng.lng);
      });
    }

    // Force exact dimensions and centering on Plaza de Armas Salamanca across different transition speeds
    const timers = [
      setTimeout(() => { activeMap.invalidateSize(); activeMap.setView(SALAMANCA_CENTER, 16); }, 50),
      setTimeout(() => { activeMap.invalidateSize(); activeMap.setView(SALAMANCA_CENTER, 16); }, 200),
      setTimeout(() => { activeMap.invalidateSize(); activeMap.setView(SALAMANCA_CENTER, 16); }, 500),
      setTimeout(() => { activeMap.invalidateSize(); activeMap.setView(SALAMANCA_CENTER, 16); }, 1000),
      setTimeout(() => { activeMap.invalidateSize(); activeMap.setView(SALAMANCA_CENTER, 16); }, 2000),
    ];

    return () => {
      timers.forEach(t => clearTimeout(t));
      activeMap.remove();
    };
  }, [onSelectLocation]);

  // 2. Render and Update Taxi Markers on Leaflet map (Reactively triggers when map state is ready!)
  useEffect(() => {
    if (!map || !showNearbyTaxis) return;

    // Create a beautiful premium minimalist flat top-down car icon matching Kuve theme colors!
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
          transition: transform 0.8s ease;
        ">
          <svg viewBox="0 0 24 24" width="22" height="22" style="
            filter: drop-shadow(0 0 6px var(--brand-purple)) drop-shadow(0 0 2px #A855F7);
          ">
            <!-- Minimalist sleek flat car shape top-down -->
            <path 
              d="M6 4C6 2.34315 7.34315 1 9 1H15C16.6569 1 18 2.34315 18 4V20C18 21.6569 16.6569 23 15 23H9C7.34315 23 6 21.6569 6 20V4Z" 
              fill="var(--brand-purple)" 
              stroke="#000000" 
              stroke-width="1.8" 
              stroke-linejoin="round"
            />
            <!-- Windows cabin -->
            <path 
              d="M8 8H16V13C16 14.1046 15.1046 15 14 15H10C8.89543 15 8 14.1046 8 13V8Z" 
              fill="#000000" 
              opacity="0.35" 
            />
            <!-- Windshield -->
            <path 
              d="M9 5.5H15V7H9V5.5Z" 
              fill="#ffffff" 
              opacity="0.6" 
            />
            <!-- Headlights -->
            <rect x="7.2" y="1.2" width="1.5" height="1" rx="0.3" fill="#ffffea" />
            <rect x="15.3" y="1.2" width="1.5" height="1" rx="0.3" fill="#ffffea" />
          </svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    taxis.forEach((taxi) => {
      const position: [number, number] = [taxi.lat, taxi.lng];

      if (markersRef.current[taxi.id]) {
        // Update existing marker position & icon rotation
        markersRef.current[taxi.id].setLatLng(position);
        markersRef.current[taxi.id].setIcon(createTaxiIcon(taxi.heading));
      } else {
        // Create new marker
        const marker = L.marker(position, {
          icon: createTaxiIcon(taxi.heading)
        })
          .addTo(map)
          .bindTooltip(`<strong>${taxi.name}</strong><br/>Radiotaxi: ${taxi.plate}`, {
            permanent: false,
            direction: 'top',
            className: 'taxi-tooltip'
          });

        markersRef.current[taxi.id] = marker;
      }
    });

    return () => {
      // Keep persistent
    };
  }, [map, taxis, showNearbyTaxis]);

  return (
    <div style={{ position: 'relative', width: '100%', height: height === '100%' ? '100%' : height, minHeight: height === '100%' ? '100%' : height, borderRadius: '10px', overflow: 'hidden' }}>
      {/* Dark mode filter applied directly to Leaflet Map container to perfectly match Kuve styles! */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          height: '100%', 
          width: '100%', 
          backgroundColor: '#0A0A0A',
          filter: 'invert(100%) hue-rotate(180deg) brightness(85%) contrast(95%) blur(0.3px)'
        }} 
      />
      {/* Dynamic Overlay HUD Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        zIndex: 500,
        backgroundColor: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '6px',
        padding: '6px 10px',
        fontSize: '0.65rem',
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
        color: 'var(--brand-purple)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        pointerEvents: 'none'
      }}>
        <span className="pulse-loader" style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--color-success)', borderRadius: '50%' }} />
        SIM: 5 TAXIS ACTIVOS EN SALAMANCA
      </div>
    </div>
  );
};
