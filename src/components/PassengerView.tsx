import React, { useState, useEffect } from 'react';
import type { Trip } from '../types';
import { KarryLogo, KarryIsotype } from './KarryHeaderLogo';
import { InteractiveMap } from './InteractiveMap';
import {
  Send,
  Share2,
  MessageSquare,
  X,
  Star,
  Clock,
  MapPin,
  Target,
  User,
  CheckCircle2
} from 'lucide-react';

interface PassengerViewProps {
  passengerName: string;
  passengerPhone: string;
  savePassengerProfile: (name: string, phone: string) => void;
  trips: Trip[];
  requestTrip: (origin: string, destination: string, price: number) => Trip;
  cancelTrip: (tripId: string, cancelledBy: 'passenger' | 'driver', reason?: string) => void;
  sendChatMessage: (tripId: string, sender: 'passenger' | 'driver', text: string) => void;
}

export const PassengerView: React.FC<PassengerViewProps> = ({
  passengerName,
  passengerPhone,
  savePassengerProfile,
  trips,
  cancelTrip,
  sendChatMessage,
}) => {
  // Profile Form States
  const [profileName, setProfileName] = useState(passengerName);
  const [profilePhone, setProfilePhone] = useState(passengerPhone);

  // Custom chat message input
  const [chatInput, setChatInput] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // History Drawer State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [tripHistory, setTripHistory] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('karry_passenger_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Active Trip (pending, accepted, arrived, in_progress)
  const activeTrip = trips.find(
    t => t.passengerPhone === passengerPhone &&
      ['pending', 'accepted', 'arrived', 'in_progress'].includes(t.status)
  );

  // Completed or cancelled trip
  const postTrip = !activeTrip && trips.find(
    t => t.passengerPhone === passengerPhone &&
      ['completed', 'cancelled'].includes(t.status)
  );

  // Archive finished trip to history
  const archiveFinishedTrip = (tripId: string) => {
    const tripToArchive = trips.find(t => t.id === tripId);
    if (tripToArchive) {
      const updatedHistory = [tripToArchive, ...tripHistory.filter(h => h.id !== tripId)];
      setTripHistory(updatedHistory);
      localStorage.setItem('karry_passenger_history', JSON.stringify(updatedHistory));
      localStorage.removeItem('karry_trips');
      window.location.reload();
    }
  };

  // Auto-clear post-trip display after 30 seconds
  useEffect(() => {
    if (postTrip) {
      const timer = setTimeout(() => {
        archiveFinishedTrip(postTrip.id);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [postTrip]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileName.trim() && profilePhone.trim()) {
      savePassengerProfile(profileName.trim(), profilePhone.trim());
    }
  };

  const handleSendQuickMessage = (text: string) => {
    if (activeTrip) {
      sendChatMessage(activeTrip.id, 'passenger', text);
    }
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() && activeTrip) {
      sendChatMessage(activeTrip.id, 'passenger', chatInput.trim());
      setChatInput('');
    }
  };

  const handleCopyShareLink = () => {
    if (activeTrip) {
      const shareUrl = `${window.location.origin}/viaje/${activeTrip.id}`;
      navigator.clipboard.writeText(shareUrl);
      alert('¡Enlace de seguimiento copiado al portapapeles! Envíalo por WhatsApp.');
      setShowShareModal(false);
    }
  };

  const isRegistered = passengerName.trim().length > 0 && passengerPhone.trim().length > 0;

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
      {/* Top Header Bar */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2ECE7'
      }}>
        <KarryLogo size="md" showSlogan={true} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsHistoryOpen(true)}
            style={{
              backgroundColor: '#EAF5EF',
              color: '#1D4133',
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
            <Clock size={15} style={{ color: '#1D4133' }} />
            <span>Historial ({tripHistory.length})</span>
          </button>

          {isRegistered && (
            <div className="user-avatar-badge" title={passengerName}>
              {passengerName.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* PROFILE UNREGISTERED VIEW */}
        {!isRegistered ? (
          <div className="karry-card animate-fade-in" style={{ margin: 'auto 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <KarryIsotype size={48} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1D4133', marginTop: '12px' }}>
                Bienvenido a Karry Salamanca
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#576E64', marginTop: '4px' }}>
                Tu alternativa local de transporte seguro. Ingresa tus datos para pedir tu viaje.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="karry-form-group">
                <label className="karry-form-label">Nombre Completo</label>
                <div className="karry-input-wrapper">
                  <User size={18} style={{ color: '#1D4133' }} />
                  <input
                    type="text"
                    className="karry-input-field"
                    placeholder="Ej. Juan Pérez"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="karry-form-group">
                <label className="karry-form-label">Teléfono Móvil</label>
                <div className="karry-input-wrapper">
                  <User size={18} style={{ color: '#1D4133' }} />
                  <input
                    type="tel"
                    className="karry-input-field"
                    placeholder="Ej. +56912345678"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="karry-primary-btn">
                Comenzar en Salamanca
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* ACTIVE TRIP CARD */}
            {activeTrip ? (
              <div className="karry-card animate-fade-in" style={{ border: '2px solid #22C55E' }}>
                {/* Status Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #E2ECE7'
                }}>
                  <span style={{
                    backgroundColor: activeTrip.status === 'in_progress' ? '#1D4133' : '#22C55E',
                    color: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '5px 12px',
                    borderRadius: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    {activeTrip.status === 'pending' && 'Buscando Conductor en Salamanca...'}
                    {activeTrip.status === 'accepted' && '¡Conductor en Camino!'}
                    {activeTrip.status === 'arrived' && '¡Tu Conductor ha Llegado!'}
                    {activeTrip.status === 'in_progress' && 'Viaje en Curso a Destino'}
                  </span>

                  <button
                    onClick={() => setShowShareModal(true)}
                    style={{
                      backgroundColor: '#EAF5EF',
                      color: '#1D4133',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '12px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <Share2 size={13} />
                    <span>Compartir</span>
                  </button>
                </div>

                {/* Driver Info Summary */}
                {(activeTrip.status === 'accepted' || activeTrip.status === 'arrived' || activeTrip.status === 'in_progress') && (
                  <div style={{
                    backgroundColor: '#F6FAF6',
                    borderRadius: '16px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    border: '1px solid #E2ECE7'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: '#1D4133',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800
                      }}>
                        {activeTrip.driverName ? activeTrip.driverName.substring(0, 2).toUpperCase() : 'DR'}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1D4133' }}>
                            {activeTrip.driverName || 'Don Juan'}
                          </h4>
                          <span style={{ fontSize: '0.74rem', color: '#F59E0B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Star size={12} fill="#F59E0B" /> 4.9
                          </span>
                        </div>

                        <p style={{ fontSize: '0.78rem', color: '#576E64', fontWeight: 500, marginTop: '2px' }}>
                          {activeTrip.status === 'in_progress' ? 'Viajando con seguridad' : (activeTrip.status === 'arrived' ? 'Esperándote afuera' : 'Llega en 3 minutos')}
                        </p>
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #1D4133',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#1D4133',
                      letterSpacing: '0.08em'
                    }}>
                      {activeTrip.driverPlate || 'XY-12-34'}
                    </div>
                  </div>
                )}

                {/* Route Details */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '14px',
                  border: '1px solid #E2ECE7',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={18} style={{ color: '#1D4133' }} />
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#889B92', fontWeight: 600 }}>ORIGEN</span>
                      <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1D4133' }}>{activeTrip.origin}</p>
                    </div>
                  </div>

                  <div style={{ height: '1px', backgroundColor: '#E2ECE7' }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Target size={18} style={{ color: '#22C55E' }} />
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#889B92', fontWeight: 600 }}>DESTINO</span>
                      <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1D4133' }}>{activeTrip.destination}</p>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '4px',
                    paddingTop: '8px',
                    borderTop: '1px dashed #E2ECE7',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: '#576E64', fontWeight: 600 }}>Tarifa total:</span>
                    <strong style={{ fontSize: '1.15rem', color: '#1D4133', fontWeight: 800 }}>
                      CLP {activeTrip.price.toLocaleString('es-CL')}
                    </strong>
                  </div>
                </div>

                {/* Interactive Map */}
                <div style={{ height: '220px', marginBottom: '16px', borderRadius: '16px', overflow: 'hidden' }}>
                  <InteractiveMap height="100%" showRoute={true} />
                </div>

                {/* Chat Simulator */}
                {(activeTrip.status === 'accepted' || activeTrip.status === 'arrived' || activeTrip.status === 'in_progress') && (
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2ECE7',
                    padding: '14px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <MessageSquare size={16} style={{ color: '#1D4133' }} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1D4133' }}>
                        Chat con Conductor
                      </span>
                    </div>

                    {/* Messages Container */}
                    <div style={{
                      maxHeight: '130px',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      padding: '8px',
                      backgroundColor: '#F6FAF6',
                      borderRadius: '12px',
                      marginBottom: '10px'
                    }}>
                      {activeTrip.messages.map(m => {
                        const isMe = m.sender === 'passenger';
                        return (
                          <div
                            key={m.id}
                            style={{
                              alignSelf: isMe ? 'flex-end' : 'flex-start',
                              backgroundColor: isMe ? '#1D4133' : '#FFFFFF',
                              color: isMe ? '#FFFFFF' : '#1D4133',
                              padding: '8px 12px',
                              borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                              maxWidth: '85%',
                              fontSize: '0.82rem',
                              fontWeight: 500,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                              border: isMe ? 'none' : '1px solid #E2ECE7'
                            }}
                          >
                            {m.text}
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick message options */}
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '8px' }}>
                      {['¡Ya voy saliendo!', 'Estoy en la puerta', 'Voy de polera verde', 'Por favor espere 2 min'].map((text, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendQuickMessage(text)}
                          style={{
                            backgroundColor: '#EAF5EF',
                            border: '1px solid #C5D8CE',
                            color: '#1D4133',
                            borderRadius: '14px',
                            padding: '4px 10px',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {text}
                        </button>
                      ))}
                    </div>

                    {/* Chat input */}
                    <form onSubmit={handleSendCustomMessage} style={{ display: 'flex', gap: '8px' }}>
                      <div className="karry-input-wrapper" style={{ flex: 1, padding: '8px 14px' }}>
                        <input
                          type="text"
                          className="karry-input-field"
                          placeholder="Escribe un mensaje..."
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                        />
                      </div>
                      <button 
                        type="submit" 
                        style={{
                          backgroundColor: '#22C55E',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '0 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  </div>
                )}

                {/* Cancel Trip Button */}
                {activeTrip.status !== 'in_progress' && (
                  <button
                    onClick={() => {
                      if (window.confirm('¿Quieres cancelar tu viaje?')) {
                        cancelTrip(activeTrip.id, 'passenger', 'Cancelado por el pasajero');
                      }
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '14px',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar Viaje
                  </button>
                )}
              </div>
            ) : (
              /* NO ACTIVE TRIP - SHOW STATUS & RECENT HISTORY */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="karry-card" style={{ textAlign: 'center', padding: '32px 20px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#EAF5EF',
                    color: '#22C55E',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px'
                  }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D4133' }}>
                    Sin Viajes Activos
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#576E64', marginTop: '4px' }}>
                    Estás listo para solicitar tu próximo traslado en Salamanca.
                  </p>
                </div>

                <div style={{ height: '240px', borderRadius: '20px', overflow: 'hidden' }}>
                  <InteractiveMap height="100%" showNearbyTaxis={true} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Share Trip Modal */}
      {showShareModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div className="karry-card animate-fade-in" style={{ width: '100%', maxWidth: '380px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1D4133' }}>
                Compartir Mi Viaje
              </h3>
              <button 
                onClick={() => setShowShareModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#576E64' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#576E64', marginBottom: '16px' }}>
              Comparte el enlace en tiempo real de tu trayecto por Salamanca para que tus familiares o amigos vean tu ruta.
            </p>

            <button 
              onClick={handleCopyShareLink}
              className="karry-primary-btn"
            >
              Copiar Enlace de Seguimiento
            </button>
          </div>
        </div>
      )}

      {/* History Drawer Modal */}
      {isHistoryOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div className="karry-card animate-fade-in" style={{ width: '100%', maxWidth: '420px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1D4133' }}>
                Historial de Viajes ({tripHistory.length})
              </h3>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#576E64' }}
              >
                <X size={20} />
              </button>
            </div>

            {tripHistory.length === 0 ? (
              <p style={{ color: '#576E64', fontSize: '0.86rem', textAlign: 'center', padding: '20px 0' }}>
                Aún no tienes viajes completados en Salamanca.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tripHistory.map(h => (
                  <div key={h.id} style={{
                    backgroundColor: '#F6FAF6',
                    border: '1px solid #E2ECE7',
                    borderRadius: '14px',
                    padding: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#1D4133' }}>{h.destination}</strong>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#22C55E' }}>CLP {h.price}</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#889B92' }}>Origen: {h.origin}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
