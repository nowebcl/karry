import React, { useState } from 'react';
import type { Trip } from '../types';
import { 
  Send, 
  Check, 
  AlertTriangle, 
  MessageSquare,
  CheckCircle,
  Star,
  FileText,
  AlertCircle,
  User,
  Compass,
  MapPin,
  Target
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';

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
  cancelTrip,
  sendChatMessage,
}) => {
  // Registration States
  const [name, setName] = useState(driverName);
  const [phone, setPhone] = useState(driverPhone);
  const [plate, setPlate] = useState(driverPlate);
  const [licenseUploaded, setLicenseUploaded] = useState(false);

  // Chat Input State
  const [chatInput, setChatInput] = useState('');

  // Active Trip handled by THIS driver
  const activeTrip = trips.find(
    t => t.driverPlate === driverPlate && 
    ['accepted', 'arrived', 'in_progress'].includes(t.status)
  );

  // List of pending trips in Salamanca
  const pendingTrips = trips.filter(t => t.status === 'pending');

  // Recommendation: The oldest pending trip is recommended to avoid waiting times
  const recommendedTrip = pendingTrips.length > 0 ? pendingTrips[pendingTrips.length - 1] : null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim() && plate.trim() && licenseUploaded) {
      saveDriverProfile(name.trim(), phone.trim(), plate.trim());
    } else if (!licenseUploaded) {
      alert('Por favor, sube una foto de tu Licencia Clase A para continuar.');
    }
  };

  const handleSendQuickMessage = (text: string) => {
    if (activeTrip) {
      sendChatMessage(activeTrip.id, 'driver', text);
    }
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() && activeTrip) {
      sendChatMessage(activeTrip.id, 'driver', chatInput.trim());
      setChatInput('');
    }
  };

  // Helper to determine passenger reputation style
  const getPassengerReputation = (pPhone: string) => {
    if (pPhone.endsWith('9') || pPhone.endsWith('3')) {
      return {
        label: 'Pasajero Recurrente - Confiable',
        badgeClass: 'var(--color-success-bg)',
        textColor: 'var(--color-success)',
        icon: CheckCircle
      };
    }
    if (pPhone.endsWith('7') || pPhone.endsWith('4')) {
      return {
        label: 'Alerta: Canceló su último viaje',
        badgeClass: 'var(--color-danger-bg)',
        textColor: 'var(--color-danger)',
        icon: AlertTriangle
      };
    }
    return {
      label: 'Pasajero de Salamanca',
      badgeClass: 'var(--bg-secondary)',
      textColor: 'var(--text-secondary)',
      icon: User
    };
  };

  // 1. Step 1: Registration Form
  if (!driverName || !driverPlate) {
    return (
      <div className="container animate-fade-in" style={{ justifyContent: 'center', height: '100%' }}>
        <div className="card-glass">
          <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <Compass className="animate-logo-hologram" size={36} style={{ color: 'var(--brand-purple)' }} />
          </div>
          <h2 style={{ marginBottom: '10px', fontSize: '1.2rem', textAlign: 'center', fontFamily: 'var(--font-mono)', letterSpacing: '1.5px' }}>
            REGISTRO // DRIVER
          </h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px', fontSize: '0.8rem', lineHeight: '1.5' }}>
            Únete a la red de radiotaxis de Salamanca. Ingresa tus datos básicos para validación.
          </p>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="driver-name-input">Nombre Completo</label>
              <input 
                id="driver-name-input"
                type="text" 
                className="form-input" 
                placeholder="Ej. Luis González" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="driver-phone-input">Número de Teléfono (Conductor)</label>
              <input 
                id="driver-phone-input"
                type="tel" 
                className="form-input" 
                placeholder="Ej. +56998765432" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="driver-plate-input">Patente del Vehículo (Chile)</label>
              <input 
                id="driver-plate-input"
                type="text" 
                className="form-input" 
                placeholder="Ej. AB-CD-12" 
                value={plate}
                onChange={e => setPlate(e.target.value)}
                style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                required
              />
            </div>

            {/* License Upload Simulation */}
            <div className="form-group" style={{ border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <label htmlFor="license-file-input" style={{ cursor: 'pointer', display: 'block' }}>
                <FileText size={20} style={{ color: 'var(--brand-purple)', margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Foto de Licencia Clase A (Profesional)</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {licenseUploaded ? '✓ Licencia Clase A cargada' : 'Subir archivo de validación'}
                </div>
              </label>
              <input 
                id="license-file-input"
                type="file" 
                style={{ display: 'none' }} 
                onChange={() => setLicenseUploaded(true)}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              [ SOLICITAR REGISTRO ] →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Step 2: Driver Approval Screen (Waiting for Admin approval)
  if (!driverIsApproved) {
    return (
      <div className="container animate-fade-in" style={{ justifyContent: 'center', height: '100%' }}>
        <div className="card-glass" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Compass className="animate-logo-hologram" size={40} style={{ color: 'var(--brand-purple)' }} />
          </div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '8px', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>VALIDANDO REGISTRO</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '16px', lineHeight: '1.5' }}>
            Hola <strong style={{ color: 'var(--text-primary)' }}>Don {driverName}</strong>, tu solicitud está en cola de revisión de la base de radiotaxis de Salamanca.
          </p>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', fontSize: '0.75rem', textAlign: 'left', marginBottom: '24px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            <strong>Validación de seguridad:</strong> Se está corroborando la vigencia de tu Licencia Clase A profesional y la patente de tu auto <strong>{driverPlate}</strong>.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={() => approveDriver(true)} 
              className="btn-primary" 
              style={{ width: '100%', backgroundColor: 'var(--color-success)', color: '#000', border: 'none' }}
            >
              [ APROBACIÓN INSTANTÁNEA WHATSAPP ]
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }} 
              className="btn-secondary"
            >
              Cancelar y Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Active Trip Panel (Trip is accepted or arrived)
  if (activeTrip) {
    const isArrived = activeTrip.status === 'arrived';
    const isInProgress = activeTrip.status === 'in_progress';
    const rep = getPassengerReputation(activeTrip.passengerPhone);
    const RepIcon = rep.icon;

    return (
      <div className="container animate-fade-in" style={{ gap: '16px' }}>
        {/* Active Trip Details */}
        <div className="card-glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
            <div>
              <span style={{ 
                fontSize: '0.7rem', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                padding: '3px 8px', 
                borderRadius: '4px',
                backgroundColor: isInProgress ? 'var(--accent-glow)' : (isArrived ? 'var(--color-success-bg)' : 'var(--accent-glow)'),
                color: isInProgress ? 'var(--accent-color)' : (isArrived ? 'var(--color-success)' : 'var(--accent-color)'),
                fontFamily: 'var(--font-mono)'
              }}>
                {isInProgress ? 'Viaje en Progreso' : (isArrived ? 'Esperando al Pasajero' : 'Viaje Aceptado')}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              ID: {activeTrip.id}
            </div>
          </div>

          {/* Passenger details with Reputation Badge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} style={{ color: 'var(--brand-purple)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{activeTrip.passengerName}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {activeTrip.passengerPhone}
              </div>
            </div>
            
            {/* Reputation alert block */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              backgroundColor: rep.badgeClass, 
              color: rep.textColor,
              padding: '6px 10px', 
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontWeight: 500
            }}>
              <RepIcon size={12} />
              <span>{rep.label}</span>
            </div>
          </div>

          {/* Active Trip Map Display */}
          <div style={{ marginBottom: '14px', borderRadius: '8px', overflow: 'hidden' }}>
            <InteractiveMap height="160px" showNearbyTaxis={false} />
          </div>

          {/* Route details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
              <div><strong>Recoger en:</strong> {activeTrip.origin}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={14} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
              <div><strong>Llevar a:</strong> {activeTrip.destination}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', backgroundColor: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tarifa a Cobrar:</span>
              <strong style={{ color: 'var(--brand-magenta)', fontSize: '0.95rem' }}>${activeTrip.price.toLocaleString('es-CL')}</strong>
            </div>
          </div>

          {/* Action buttons for status change */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {!isArrived && !isInProgress ? (
              <button 
                onClick={() => driverArrived(activeTrip.id)} 
                className="btn-primary" 
                style={{ width: '100%', backgroundColor: 'var(--color-info)', color: '#fff', border: 'none' }}
              >
                <Check size={16} /> Llegué a la Ubicación (Avisar)
              </button>
            ) : isArrived ? (
              <button 
                onClick={() => startTrip(activeTrip.id)} 
                className="btn-primary" 
                style={{ width: '100%', backgroundColor: 'var(--accent-color)', color: '#000', border: 'none' }}
              >
                <Check size={16} /> Comenzar Viaje (Pasajero a bordo)
              </button>
            ) : (
              <button 
                onClick={() => completeTrip(activeTrip.id)} 
                className="btn-primary" 
                style={{ width: '100%', backgroundColor: 'var(--color-success)', color: '#000', border: 'none' }}
              >
                <CheckCircle size={16} /> Finalizar Viaje (Cobrado)
              </button>
            )}

            {/* Inasistencia / No-Show button (Silent Flagging) */}
            <button 
              onClick={() => {
                const ok = window.confirm('¿El pasajero no se presentó? Esto cancelará el viaje y marcará una advertencia de inasistencia en su número.');
                if (ok) cancelTrip(activeTrip.id, 'driver', 'El pasajero no se presentó a la hora coordinada');
              }} 
              className="btn-secondary" 
              style={{ width: '100%', borderColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)' }}
            >
              <AlertCircle size={14} /> Pasajero no se presentó
            </button>
          </div>
        </div>

        {/* Chat window */}
        <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', height: '280px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', marginBottom: '8px' }}>
            <MessageSquare size={14} style={{ color: 'var(--brand-purple)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>CHAT CON EL PASAJERO "{activeTrip.passengerName}"</span>
          </div>

          {/* Messages box */}
          <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
            {activeTrip.messages.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', margin: 'auto' }}>
                No hay mensajes todavía. Avísale al pasajero que vas en camino.
              </div>
            ) : (
              activeTrip.messages.map(m => {
                const isMe = m.sender === 'driver';
                return (
                  <div 
                    key={m.id} 
                    style={{ 
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      backgroundColor: isMe ? 'var(--brand-purple)' : 'var(--bg-tertiary)',
                      color: isMe ? '#000' : 'var(--text-primary)',
                      padding: '6px 10px',
                      borderRadius: isMe ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                      maxWidth: '85%',
                      fontSize: '0.8rem',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                  >
                    <div>{m.text}</div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick replies for driver */}
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '4px 0', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '6px', marginBottom: '6px', flexShrink: 0 }}>
            {['Voy en camino!', 'Estoy afuera!', 'Taco, llego en 2 min', '¿Dónde está parado exactamente?'].map((text, idx) => (
              <button 
                key={idx} 
                onClick={() => handleSendQuickMessage(text)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-secondary)',
                  borderRadius: '12px',
                  padding: '3px 8px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {text}
              </button>
            ))}
          </div>

          {/* Custom chat form */}
          <form onSubmit={handleSendCustomMessage} style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enviar mensaje..." 
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              style={{ flexGrow: 1, padding: '6px 10px', fontSize: '0.8rem', borderRadius: '6px' }}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ padding: '6px 10px', borderRadius: '6px' }}
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 4. Driver Dashboard (Trips queue view)
  return (
    <div className="container animate-fade-in" style={{ gap: '16px' }}>
      {/* Hello stats header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>SESIÓN: DRIVER</span>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Don {driverName}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', alignItems: 'center' }}>
          <div className="chilean-plate">{driverPlate}</div>
          <span style={{ color: 'var(--brand-purple)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Star size={12} fill="var(--brand-purple)" /> 4.9
          </span>
        </div>
      </div>

      {/* Recommended Trip Card */}
      {recommendedTrip ? (
        <div className="card-glass animate-fade-in" style={{ border: '1px solid var(--brand-purple)', boxShadow: '0 0 15px rgba(168, 85, 247, 0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ 
              fontSize: '0.65rem', 
              fontWeight: 700, 
              backgroundColor: 'var(--accent-glow)', 
              color: 'var(--brand-purple)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)'
            }}>
              RECOMENDADO
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SISTEMA ACTIVO</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <User size={14} style={{ color: 'var(--brand-purple)' }} />
              <span>{recommendedTrip.passengerName}</span>
              <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', padding: '2px 4px', borderRadius: '4px' }}>Confiable</span>
            </div>
            <strong style={{ color: 'var(--brand-magenta)', fontSize: '1rem' }}>
              ${recommendedTrip.price.toLocaleString('es-CL')}
            </strong>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', gap: '6px' }}><MapPin size={12} style={{ color: 'var(--color-success)' }} /> <span><strong>De:</strong> {recommendedTrip.origin}</span></div>
            <div style={{ display: 'flex', gap: '6px' }}><Target size={12} style={{ color: 'var(--color-danger)' }} /> <span><strong>A:</strong> {recommendedTrip.destination}</span></div>
          </div>

          <button 
            onClick={() => acceptTrip(recommendedTrip.id)} 
            className="btn-primary" 
            style={{ width: '100%', padding: '12px' }}
          >
            [ ACEPTAR VIAJE ] →
          </button>
        </div>
      ) : (
        <div className="card-glass" style={{ textAlign: 'center', padding: '30px 0' }}>
          <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <Compass className="pulse-loader" size={32} style={{ color: 'var(--brand-purple)' }} />
          </div>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '4px', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>BUSCANDO VIAJES</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: '1.4' }}>
            Mantén esta página abierta. Sonará una bocina apenas un vecino de Salamanca solicite un radiotaxi.
          </p>
        </div>
      )}

      {/* Available Trips List */}
      <div>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
          OTROS VIAJES EN COLA ({pendingTrips.length})
        </h3>
        {pendingTrips.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '16px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px' }}>
            No hay otros viajes pendientes en este momento.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pendingTrips.map(t => {
              if (recommendedTrip && t.id === recommendedTrip.id) return null;
              return (
                <div 
                  key={t.id} 
                  className="card-glass animate-fade-in" 
                  style={{ 
                    padding: '16px', 
                    backgroundColor: 'var(--bg-secondary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '0.8rem' }}>{t.passengerName}</strong>
                      <span style={{ color: 'var(--brand-magenta)', fontWeight: 600, fontSize: '0.8rem' }}>
                        ${t.price.toLocaleString('es-CL')}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div>De: {t.origin}</div>
                      <div>A: {t.destination}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => acceptTrip(t.id)} 
                    className="btn-primary" 
                    style={{ padding: '8px 12px', fontSize: '0.7rem', borderRadius: '6px' }}
                  >
                    Aceptar
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <button 
          onClick={() => {
            if (window.confirm('¿Quieres cerrar sesión de conductor?')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Cerrar sesión de conductor
        </button>
      </div>
    </div>
  );
};
