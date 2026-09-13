import React, { useState } from 'react';
import type { Trip } from '../types';
import { KarryLogo, KarryIsotype } from './KarryHeaderLogo';
import { InteractiveMap } from './InteractiveMap';
import { 
  User, 
  Phone, 
  Car, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Navigation
} from 'lucide-react';

interface DriverViewProps {
  driverName: string;
  driverPhone: string;
  driverPlate: string;
  driverIsApproved: boolean;
  saveDriverProfile: (name: string, phone: string, plate: string) => void;
  approveDriver: (approved: boolean) => void;
  trips: Trip[];
  acceptTrip: (tripId: string) => void;
  driverArrived: (tripId: string) => void;
  startTrip: (tripId: string) => void;
  completeTrip: (tripId: string) => void;
  cancelTrip: (tripId: string, cancelledBy: 'passenger' | 'driver', reason?: string) => void;
  sendChatMessage: (tripId: string, sender: 'passenger' | 'driver', text: string) => void;
}

export const DriverView: React.FC<DriverViewProps> = ({
  driverName,
  driverPhone,
  driverPlate,
  driverIsApproved,
  saveDriverProfile,
  approveDriver,
  trips,
  acceptTrip,
  driverArrived,
  startTrip,
  completeTrip,
}) => {
  // Registration Form States
  const [name, setName] = useState(driverName || '');
  const [phone, setPhone] = useState(driverPhone || '');
  const [plate, setPlate] = useState(driverPlate || '');
  const [licenseUploaded, setLicenseUploaded] = useState(true);

  const [isOnline, setIsOnline] = useState(true);

  // Active Trip handled by THIS driver
  const activeTrip = trips.find(
    t => t.driverPlate === driverPlate && 
    ['accepted', 'arrived', 'in_progress'].includes(t.status)
  );

  // Pending trips available in Salamanca
  const pendingTrips = trips.filter(t => t.status === 'pending');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim() && plate.trim() && licenseUploaded) {
      saveDriverProfile(name.trim(), phone.trim(), plate.trim().toUpperCase());
    } else if (!licenseUploaded) {
      alert('Por favor, sube una foto de tu Licencia Clase A para continuar.');
    }
  };

  // 1. STEP 1: DRIVER REGISTRATION FORM (Redesigned matching Karry identity)
  if (!driverName || !driverPlate) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F6FAF6',
        padding: '24px 20px',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <KarryLogo size="md" showSlogan={true} />
          <KarryIsotype size={38} />
        </div>

        {/* Form Card Container */}
        <div className="karry-card animate-fade-in" style={{ flex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '20px',
              backgroundColor: '#EAF5EF',
              color: '#1D4133',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <Car size={28} />
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#1D4133',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Registro de Conductor
            </h2>
            <p style={{
              fontSize: '0.86rem',
              fontWeight: 500,
              color: '#576E64',
              marginTop: '4px'
            }}>
              Únete a la red oficial de transporte local de Salamanca, Chile
            </p>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Nombre Completo */}
            <div className="karry-form-group">
              <label className="karry-form-label">Nombre Completo</label>
              <div className="karry-input-wrapper">
                <User size={18} style={{ color: '#1D4133' }} />
                <input 
                  type="text" 
                  className="karry-input-field" 
                  placeholder="Ej. Luis González" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Número de Teléfono */}
            <div className="karry-form-group">
              <label className="karry-form-label">Teléfono de Contacto</label>
              <div className="karry-input-wrapper">
                <Phone size={18} style={{ color: '#1D4133' }} />
                <input 
                  type="tel" 
                  className="karry-input-field" 
                  placeholder="+56 9 1234 5678" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Patente del Vehículo */}
            <div className="karry-form-group">
              <label className="karry-form-label">Patente del Vehículo</label>
              <div className="karry-input-wrapper">
                <Car size={18} style={{ color: '#1D4133' }} />
                <input 
                  type="text" 
                  className="karry-input-field" 
                  placeholder="Ej. XY-12-34" 
                  value={plate}
                  onChange={e => setPlate(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>

            {/* Licencia Clase A Upload Simulator */}
            <div className="karry-form-group">
              <label className="karry-form-label">Licencia Clase A (Documentación)</label>
              <div 
                onClick={() => setLicenseUploaded(true)}
                style={{
                  border: '2px dashed #C5D8CE',
                  borderRadius: '16px',
                  padding: '16px',
                  backgroundColor: licenseUploaded ? '#EAF5EF' : '#FFFFFF',
                  borderColor: licenseUploaded ? '#22C55E' : '#C5D8CE',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: licenseUploaded ? '#22C55E' : '#EAF5EF',
                  color: licenseUploaded ? '#FFFFFF' : '#1D4133',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {licenseUploaded ? <CheckCircle2 size={22} /> : <Upload size={20} />}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1D4133' }}>
                    {licenseUploaded ? 'Licencia de Conducir Adjunta ✓' : 'Subir Foto de Licencia'}
                  </h4>
                  <p style={{ fontSize: '0.76rem', color: '#576E64' }}>
                    {licenseUploaded ? 'Clase A autorizada para radiotaxis y transporte' : 'Toca para cargar documento oficial'}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="karry-primary-btn" style={{ marginTop: '8px' }}>
              Solicitar Registro como Conductor
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. STEP 2: PENDING APPROVAL SCREEN
  if (!driverIsApproved) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F6FAF6',
        padding: '24px 20px',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <KarryLogo size="md" showSlogan={true} />
          <KarryIsotype size={38} />
        </div>

        <div className="karry-card animate-fade-in" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#FEF3C7',
            color: '#D97706',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <ShieldCheck size={36} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1D4133' }}>
            Solicitud en Revisión
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#576E64', marginTop: '6px', marginBottom: '24px', lineHeight: 1.4 }}>
            Hola <strong>{driverName}</strong>, tus antecedentes están siendo validados para operar en la comuna de Salamanca.
          </p>

          <div style={{
            backgroundColor: '#F6FAF6',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'left',
            marginBottom: '24px',
            border: '1px solid #E2ECE7'
          }}>
            <p style={{ fontSize: '0.82rem', color: '#576E64', marginBottom: '4px' }}>
              <strong>Conductor:</strong> {driverName}
            </p>
            <p style={{ fontSize: '0.82rem', color: '#576E64', marginBottom: '4px' }}>
              <strong>Patente:</strong> {driverPlate}
            </p>
            <p style={{ fontSize: '0.82rem', color: '#576E64' }}>
              <strong>Teléfono:</strong> {driverPhone}
            </p>
          </div>

          {/* Admin Simulator Approval Button */}
          <button 
            onClick={() => approveDriver(true)}
            className="karry-primary-btn"
            style={{ backgroundColor: '#1D4133' }}
          >
            Aprobar Conductor (Simulación Admin)
          </button>
        </div>
      </div>
    );
  }

  // 3. STEP 3: ACTIVE DRIVER DASHBOARD
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
      {/* Top Driver Header Bar */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#1D4133',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#8EDF6F',
            color: '#1D4133',
            fontSize: '1.1rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {driverName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
              {driverName}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#8EDF6F', fontWeight: 600 }}>
              Patente: {driverPlate}
            </span>
          </div>
        </div>

        {/* Online Toggle Switch */}
        <button 
          onClick={() => setIsOnline(!isOnline)}
          style={{
            backgroundColor: isOnline ? '#22C55E' : 'rgba(255,255,255,0.2)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
          {isOnline ? 'EN LÍNEA' : 'OFFLINE'}
        </button>
      </div>

      {/* Driver Daily Earnings Summary */}
      <div style={{
        backgroundColor: '#143026',
        padding: '12px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        color: '#FFFFFF'
      }}>
        <div>
          <span style={{ fontSize: '0.68rem', color: '#A0B8AD', display: 'block' }}>GANADO HOY</span>
          <strong style={{ fontSize: '0.98rem', color: '#8EDF6F' }}>CLP 42.500</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.68rem', color: '#A0B8AD', display: 'block' }}>VIAJES</span>
          <strong style={{ fontSize: '0.98rem' }}>8</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.68rem', color: '#A0B8AD', display: 'block' }}>CALIFICACIÓN</span>
          <strong style={{ fontSize: '0.98rem', color: '#F59E0B' }}>⭐ 4.9</strong>
        </div>
      </div>

      {/* Main Driver Content Area */}
      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Active Trip Mode */}
        {activeTrip ? (
          <div className="karry-card animate-fade-in" style={{ border: '2px solid #22C55E' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              paddingBottom: '10px',
              borderBottom: '1px solid #E2ECE7'
            }}>
              <span style={{
                backgroundColor: '#22C55E',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '12px',
                textTransform: 'uppercase'
              }}>
                {activeTrip.status === 'accepted' && 'En camino al pasajero'}
                {activeTrip.status === 'arrived' && 'Llegaste al punto de recogida'}
                {activeTrip.status === 'in_progress' && 'Viaje en curso a destino'}
              </span>

              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1D4133' }}>
                CLP {activeTrip.price.toLocaleString('es-CL')}
              </span>
            </div>

            {/* Trip Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} style={{ color: '#1D4133' }} />
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#889B92', display: 'block' }}>ORIGEN</span>
                  <strong style={{ fontSize: '0.92rem', color: '#1D4133' }}>{activeTrip.origin}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Navigation size={18} style={{ color: '#22C55E' }} />
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#889B92', display: 'block' }}>DESTINO</span>
                  <strong style={{ fontSize: '0.92rem', color: '#1D4133' }}>{activeTrip.destination}</strong>
                </div>
              </div>
            </div>

            {/* Passenger Info */}
            <div style={{
              backgroundColor: '#F6FAF6',
              borderRadius: '14px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#1D4133',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activeTrip.passengerName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1D4133' }}>
                    {activeTrip.passengerName}
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: '#576E64' }}>
                    {activeTrip.passengerPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Workflow Action Buttons */}
            {activeTrip.status === 'accepted' && (
              <button 
                onClick={() => driverArrived(activeTrip.id)}
                className="karry-primary-btn"
              >
                ¡Llegué al lugar de origen!
              </button>
            )}

            {activeTrip.status === 'arrived' && (
              <button 
                onClick={() => startTrip(activeTrip.id)}
                className="karry-primary-btn"
                style={{ backgroundColor: '#1D4133' }}
              >
                Iniciar Viaje con Pasajero
              </button>
            )}

            {activeTrip.status === 'in_progress' && (
              <button 
                onClick={() => completeTrip(activeTrip.id)}
                className="karry-primary-btn"
                style={{ backgroundColor: '#22C55E' }}
              >
                Finalizar Viaje y Cobrar CLP {activeTrip.price.toLocaleString('es-CL')}
              </button>
            )}
          </div>
        ) : (
          /* Available Pending Trips List */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1D4133' }}>
              Solicitudes de Viaje en Salamanca ({pendingTrips.length})
            </h3>

            {pendingTrips.length === 0 ? (
              <div className="karry-card" style={{ textAlign: 'center', padding: '32px 20px' }}>
                <p style={{ color: '#576E64', fontSize: '0.9rem' }}>
                  No hay solicitudes de viajes pendientes en Salamanca en este momento.
                </p>
                <p style={{ color: '#889B92', fontSize: '0.78rem', marginTop: '6px' }}>
                  Mantén la app abierta. Te avisaremos cuando un vecino solicite un viaje.
                </p>
              </div>
            ) : (
              pendingTrips.map(trip => (
                <div key={trip.id} className="karry-card animate-fade-in" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span style={{
                        backgroundColor: '#EAF5EF',
                        color: '#1D4133',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '8px',
                        textTransform: 'uppercase'
                      }}>
                        NUEVA SOLICITUD
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1D4133', marginTop: '6px' }}>
                        {trip.passengerName}
                      </h4>
                    </div>

                    <strong style={{ fontSize: '1.2rem', color: '#22C55E', fontWeight: 800 }}>
                      CLP {trip.price.toLocaleString('es-CL')}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                    <p style={{ fontSize: '0.84rem', color: '#576E64' }}>
                      📍 <strong>Origen:</strong> {trip.origin}
                    </p>
                    <p style={{ fontSize: '0.84rem', color: '#576E64' }}>
                      🏁 <strong>Destino:</strong> {trip.destination}
                    </p>
                  </div>

                  <button 
                    onClick={() => acceptTrip(trip.id)}
                    className="karry-primary-btn"
                  >
                    Aceptar Viaje
                  </button>
                </div>
              ))
            )}

            {/* Salamanca Interactive Map */}
            <div style={{ height: '220px', marginTop: '8px' }}>
              <InteractiveMap height="100%" showNearbyTaxis={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
