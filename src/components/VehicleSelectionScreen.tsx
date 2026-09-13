import React, { useState } from 'react';
import { InteractiveMap } from './InteractiveMap';
import { 
  ArrowLeft, 
  Users, 
  Check, 
  Banknote, 
  ChevronRight
} from 'lucide-react';

interface VehicleSelectionScreenProps {
  origin?: string;
  destination: string;
  onBack: () => void;
  onConfirmTrip: (price: number) => void;
}

export const VehicleSelectionScreen: React.FC<VehicleSelectionScreenProps> = ({
  destination = 'Hospital de Salamanca',
  onBack,
  onConfirmTrip
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<'karry' | 'karry_xl'>('karry');
  const priceKarry = 3800;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#F6FAF6',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Map View with Route Overlay (image_3.png) */}
      <div style={{
        height: '46%',
        width: '100%',
        position: 'relative'
      }}>
        <InteractiveMap 
          height="100%" 
          showNearbyTaxis={true}
          showRoute={true}
        />

        {/* Back Button */}
        <button 
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1D4133',
            cursor: 'pointer',
            zIndex: 600
          }}
          title="Volver"
        >
          <ArrowLeft size={22} />
        </button>

        {/* Destination Floating Badge */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '70px',
          backgroundColor: '#FFFFFF',
          padding: '8px 14px',
          borderRadius: '20px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 600,
          fontSize: '0.82rem',
          fontWeight: 700,
          color: '#1D4133'
        }}>
          <span style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontSize: '0.68rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            H
          </span>
          <span>{destination}</span>
          <ChevronRight size={14} style={{ color: '#889B92' }} />
        </div>
      </div>

      {/* Bottom Sliding Panel matching Elige tu viaje in image_3.png */}
      <div style={{
        height: '54%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        boxShadow: '0 -8px 30px rgba(29, 65, 51, 0.12)',
        padding: '12px 20px 24px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 700,
        overflowY: 'auto'
      }}>
        <div>
          {/* Top Handle Indicator */}
          <div style={{
            width: '42px',
            height: '5px',
            backgroundColor: '#D2ECE0',
            borderRadius: '10px',
            margin: '0 auto 14px auto'
          }} />

          {/* Section Titles */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h3 style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#1D4133',
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}>
              Elige tu viaje
            </h3>
            <p style={{
              fontSize: '0.86rem',
              fontWeight: 500,
              color: '#576E64',
              marginTop: '4px'
            }}>
              Un viaje seguro por Salamanca
            </p>
          </div>

          {/* Vehicle Option Card (Selected State matching image_3.png) */}
          <div 
            onClick={() => setSelectedVehicle('karry')}
            style={{
              backgroundColor: '#F6FAF6',
              border: selectedVehicle === 'karry' ? '2px solid #22C55E' : '1px solid #E2ECE7',
              borderRadius: '20px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              cursor: 'pointer',
              boxShadow: selectedVehicle === 'karry' ? '0 4px 16px rgba(34, 197, 94, 0.12)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {/* White Sedan Graphic Car Image */}
            <div style={{ width: '85px', height: '54px', display: 'flex', alignItems: 'center' }}>
              <img 
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80" 
                alt="Karry Sedan"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
                }} 
              />
            </div>

            {/* Vehicle Details */}
            <div style={{ flex: 1, paddingLeft: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h4 style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#1D4133'
                }}>
                  Karry
                </h4>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  color: '#576E64',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}>
                  <Users size={14} />
                  <span>4</span>
                </div>
              </div>

              <p style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#1D4133',
                marginTop: '2px'
              }}>
                Llegada en 6 min
              </p>

              <p style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#576E64',
                marginTop: '1px'
              }}>
                Cómodo · Seguro · Local
              </p>
            </div>

            {/* Price & Checkmark Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#1D4133'
              }}>
                CLP 3.800
              </span>

              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#22C55E',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Check size={16} strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Payment Method Selector Section (image_3.png) */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              color: '#1D4133',
              display: 'block',
              marginBottom: '8px'
            }}>
              Método de pago
            </label>

            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2ECE7',
              borderRadius: '16px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  backgroundColor: '#EAF5EF',
                  color: '#22C55E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Banknote size={22} />
                </div>
                <div>
                  <h5 style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: '#1D4133'
                  }}>
                    Efectivo o transferencia
                  </h5>
                  <p style={{
                    fontSize: '0.76rem',
                    fontWeight: 500,
                    color: '#889B92'
                  }}>
                    Pagas al finalizar el viaje
                  </p>
                </div>
              </div>
              <ChevronRight size={18} style={{ color: '#889B92' }} />
            </div>
          </div>
        </div>

        {/* Action Button: Confirmar viaje (image_3.png) */}
        <button 
          onClick={() => onConfirmTrip(priceKarry)}
          style={{
            width: '100%',
            backgroundColor: '#22C55E',
            color: '#FFFFFF',
            border: 'none',
            padding: '16px',
            borderRadius: '20px',
            fontSize: '1.15rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(34, 197, 94, 0.3)',
            transition: 'transform 0.2s ease, background-color 0.2s ease',
            marginTop: '8px'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Confirmar viaje
        </button>
      </div>
    </div>
  );
};
