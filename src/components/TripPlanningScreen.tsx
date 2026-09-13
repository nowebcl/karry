import React, { useState } from 'react';
import { KarryIsotype } from './KarryHeaderLogo';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Plus, 
  ChevronRight, 
  Building2, 
  GraduationCap, 
  Trees, 
  Search, 
  MapPin,
  Trophy
} from 'lucide-react';

interface TripPlanningScreenProps {
  onBack: () => void;
  onSelectDestination: (destination: string, address: string) => void;
  initialOrigin?: string;
}

export const LOCAL_SALAMANCA_POIS = [
  {
    id: 'hospital',
    name: 'Hospital de Salamanca',
    address: 'Av. José Manuel Infante 891',
    iconType: 'hospital',
    category: 'Salud'
  },
  {
    id: 'muni',
    name: 'Municipalidad de Salamanca',
    address: 'Manuel Bulnes 599',
    iconType: 'muni',
    category: 'Gobierno'
  },
  {
    id: 'liceo',
    name: 'Liceo Municipal de Salamanca',
    address: 'Av. José Manuel Infante 517',
    iconType: 'liceo',
    category: 'Educación'
  },
  {
    id: 'estadio',
    name: 'Estadio Municipal N°1',
    address: 'Av. José Manuel Infante 461',
    iconType: 'estadio',
    category: 'Deportes'
  },
  {
    id: 'plaza',
    name: 'Plaza de Armas Salamanca',
    address: 'Centro de Salamanca',
    iconType: 'plaza',
    category: 'Centro'
  }
];

export const TripPlanningScreen: React.FC<TripPlanningScreenProps> = ({
  onBack,
  onSelectDestination,
  initialOrigin = 'Plaza de Armas Salamanca'
}) => {
  const [origin, setOrigin] = useState(initialOrigin);
  const [destinationSearch, setDestinationSearch] = useState('');

  const renderIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#EAF5EF',
            color: '#1D4133',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>+</span>
          </div>
        );
      case 'muni':
        return (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#EAF5EF',
            color: '#1D4133',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building2 size={20} />
          </div>
        );
      case 'liceo':
        return (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#EAF5EF',
            color: '#1D4133',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GraduationCap size={20} />
          </div>
        );
      case 'estadio':
        return (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#EAF5EF',
            color: '#1D4133',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trophy size={20} />
          </div>
        );
      case 'plaza':
        return (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#EAF5EF',
            color: '#1D4133',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trees size={20} />
          </div>
        );
      case 'search':
        return (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#EAF5EF',
            color: '#1D4133',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Search size={20} />
          </div>
        );
      case 'pin':
        return (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#EAF5EF',
            color: '#1D4133',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={20} />
          </div>
        );
      default:
        return null;
    }
  };

  const filteredPois = LOCAL_SALAMANCA_POIS.filter(poi => 
    poi.name.toLowerCase().includes(destinationSearch.toLowerCase()) ||
    poi.address.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#F6FAF6',
      position: 'relative',
      overflowY: 'auto'
    }}>
      {/* Header Bar */}
      <div style={{
        padding: '16px 20px 8px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F6FAF6'
      }}>
        <button 
          onClick={onBack}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#EBF2ED',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1D4133',
            cursor: 'pointer'
          }}
          title="Volver"
        >
          <ArrowLeft size={22} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#1D4133',
            letterSpacing: '-0.02em'
          }}>
            Planifica tu viaje
          </h2>
          <p style={{
            fontSize: '0.78rem',
            fontWeight: 500,
            color: '#576E64'
          }}>
            Salamanca se mueve
          </p>
        </div>

        <KarryIsotype size={36} />
      </div>

      {/* Dropdown Filters (Iniciar viaje / Para mí) */}
      <div style={{
        padding: '12px 20px 16px 20px',
        display: 'flex',
        gap: '12px'
      }}>
        <button style={{
          backgroundColor: '#EBF2ED',
          border: 'none',
          borderRadius: '20px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#1D4133',
          cursor: 'pointer'
        }}>
          <Clock size={16} />
          <span>Iniciar viaje</span>
          <span style={{ fontSize: '0.7rem' }}>▼</span>
        </button>

        <button style={{
          backgroundColor: '#EBF2ED',
          border: 'none',
          borderRadius: '20px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#1D4133',
          cursor: 'pointer'
        }}>
          <User size={16} />
          <span>Para mí</span>
          <span style={{ fontSize: '0.7rem' }}>▼</span>
        </button>
      </div>

      {/* Address Timeline Input Card (image_2.png) */}
      <div style={{ padding: '0 20px 20px 20px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '18px 20px',
          boxShadow: '0 8px 24px rgba(29, 65, 51, 0.06)',
          border: '1px solid #E2ECE7',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          position: 'relative'
        }}>
          {/* Vertical Timeline Graphics */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '64px',
            justifyContent: 'space-between',
            padding: '4px 0'
          }}>
            {/* Origin Green Ring Dot */}
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#1D4133',
              border: '3px solid #1D4133'
            }} />

            {/* Connecting Vertical Line */}
            <div style={{
              width: '2px',
              flex: 1,
              backgroundColor: '#C5D8CE',
              margin: '3px 0'
            }} />

            {/* Destination Green Square Dot */}
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '3px',
              backgroundColor: '#1D4133'
            }} />
          </div>

          {/* Input Fields Stack */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Punto de origen"
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '0.96rem',
                fontWeight: 600,
                color: '#1D4133',
                backgroundColor: 'transparent',
                width: '100%'
              }}
            />

            <div style={{ height: '1px', backgroundColor: '#E2ECE7', width: '100%' }} />

            <input 
              type="text"
              value={destinationSearch}
              onChange={(e) => setDestinationSearch(e.target.value)}
              placeholder="¿A dónde vas?"
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '0.96rem',
                fontWeight: 500,
                color: '#1D4133',
                backgroundColor: 'transparent',
                width: '100%'
              }}
              autoFocus
            />
          </div>

          {/* Plus Add Stop Button */}
          <button style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#EBF5EF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1D4133',
            cursor: 'pointer'
          }}>
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* POI Destination List (image_2.png) */}
      <div style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: '28px',
        borderTopRightRadius: '28px',
        padding: '20px',
        boxShadow: '0 -6px 20px rgba(29, 65, 51, 0.04)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredPois.map((poi) => (
            <div 
              key={poi.id}
              onClick={() => onSelectDestination(poi.name, poi.address)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F6FAF6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {renderIcon(poi.iconType)}
                <div>
                  <h4 style={{
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    color: '#1D4133',
                    lineHeight: 1.2
                  }}>
                    {poi.name}
                  </h4>
                  <p style={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: '#889B92',
                    marginTop: '2px'
                  }}>
                    {poi.address}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} style={{ color: '#889B92' }} />
            </div>
          ))}

          <div style={{ height: '1px', backgroundColor: '#E2ECE7', margin: '4px 0' }} />

          {/* Buscar en otra comuna */}
          <div 
            onClick={() => onSelectDestination('Terminal de Buses Salamanca', 'Av. Providencia 300')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '16px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {renderIcon('search')}
              <span style={{
                fontSize: '0.98rem',
                fontWeight: 700,
                color: '#1D4133'
              }}>
                Buscar en otra comuna
              </span>
            </div>
            <ChevronRight size={18} style={{ color: '#889B92' }} />
          </div>

          {/* Establece la ubicación en el mapa */}
          <div 
            onClick={() => onSelectDestination('Ubicación seleccionada en mapa', 'Salamanca, Chile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '16px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {renderIcon('pin')}
              <span style={{
                fontSize: '0.98rem',
                fontWeight: 700,
                color: '#1D4133'
              }}>
                Establece la ubicación en el mapa
              </span>
            </div>
            <ChevronRight size={18} style={{ color: '#889B92' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
