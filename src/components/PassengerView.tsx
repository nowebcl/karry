import React, { useState, useEffect } from 'react';
import type { Trip } from '../types';
import {
  Send,
  Navigation,
  AlertTriangle,
  Share2,
  MessageSquare,
  X,
  Check,
  Star,
  Clock,
  BookOpen,
  MapPin,
  Target,
  User,
  Compass
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';

interface PassengerViewProps {
  passengerName: string;
  passengerPhone: string;
  savePassengerProfile: (name: string, phone: string) => void;
  trips: Trip[];
  requestTrip: (origin: string, destination: string, price: number) => Trip;
  cancelTrip: (tripId: string, cancelledBy: 'passenger' | 'driver', reason?: string) => void;
  sendChatMessage: (tripId: string, sender: 'passenger' | 'driver', text: string) => void;
}

const SALAMANCA_LOCATIONS = [
  'Plaza de Armas',
  'Hospital de Salamanca',
  'Terminal de Buses',
  'Supermercado Unimarc',
  'Chalinga',
  'El Tambo',
  'Villa Santa Rosa',
  'Estadio Municipal'
];

const calculateMockPrice = (from: string, to: string): number => {
  if (!from || !to) return 0;
  if (from === to) return 2000;
  const isRural = (loc: string) => ['Chalinga', 'El Tambo'].includes(loc);
  if (isRural(from) || isRural(to)) {
    return 4500;
  }
  return 2500;
};

export const PassengerView: React.FC<PassengerViewProps> = ({
  passengerName,
  passengerPhone,
  savePassengerProfile,
  trips,
  requestTrip,
  cancelTrip,
  sendChatMessage,
}) => {
  // Profile Form States
  const [profileName, setProfileName] = useState(passengerName);
  const [profilePhone, setProfilePhone] = useState(passengerPhone);

  // Trip Form States
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

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
      }, 30000); // 30 seconds
      return () => clearTimeout(timer);
    }
  }, [postTrip]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileName.trim() && profilePhone.trim()) {
      savePassengerProfile(profileName.trim(), profilePhone.trim());
    }
  };

  const handleRequestTrip = () => {
    if (!origin.trim() || !destination.trim()) return;
    const price = calculateMockPrice(origin, destination);
    requestTrip(origin.trim(), destination.trim(), price);
    setIsRequestFormOpen(false); // Close request drawer/state
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

  const clearHistory = () => {
    if (window.confirm('¿Quieres vaciar tu historial de viajes en Salamanca?')) {
      setTripHistory([]);
      localStorage.removeItem('karry_passenger_history');
    }
  };

  const isRegistered = passengerName.trim().length > 0 && passengerPhone.trim().length > 0;

  // Render the responsive Split Layout
  return (
    <div className="app-layout-grid">

      {/* LEFT SIDEBAR: Controls and Interactions */}
      <aside className="sidebar-panel">
        <div className="container animate-fade-in" style={{ padding: '24px 16px', gap: '16px' }}>

          {/* PROFILE UNREGISTERED VIEW */}
          {!isRegistered ? (
            <div className="card-glass" style={{ margin: 'auto 0' }}>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Compass className="animate-logo-hologram" size={36} style={{ color: 'var(--brand-purple)' }} />
              </div>
              <h2 style={{ marginBottom: '10px', fontSize: '1.2rem', textAlign: 'center', fontFamily: 'var(--font-mono)', letterSpacing: '1.5px' }}>
                BIENVENIDO // KARRY
              </h2>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px', fontSize: '0.8rem', lineHeight: '1.5' }}>
                Tu alternativa de Radiotaxi local en Salamanca. Ingresa tus datos para pedir tu primer viaje.
              </p>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="passenger-name">Nombre</label>
                  <input
                    id="passenger-name"
                    type="text"
                    className="form-input"
                    placeholder="Ej. Nicolás"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="passenger-phone">Teléfono Móvil</label>
                  <input
                    id="passenger-phone"
                    type="tel"
                    className="form-input"
                    placeholder="Ej. +56912345678"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                  [ COMENZAR SISTEMA ] →
                </button>
              </form>
            </div>
          ) : (
            /* REGISTERED VIEWS CONTAINER */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>

              {/* Hello User & History Trigger */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>SESIÓN: PASSENGER</span>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{passengerName}</div>
                </div>
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.65rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Clock size={12} style={{ color: 'var(--brand-purple)' }} /> Historial ({tripHistory.length})
                </button>
              </div>

              {/* ACTIVE TRIP PANEL */}
              {activeTrip && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="card-glass" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: activeTrip.status === 'in_progress' ? 'var(--accent-glow)' : (activeTrip.status === 'arrived' ? 'var(--color-success-bg)' : 'var(--accent-glow)'),
                        color: activeTrip.status === 'in_progress' ? 'var(--accent-color)' : (activeTrip.status === 'arrived' ? 'var(--color-success)' : 'var(--accent-color)'),
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {activeTrip.status === 'in_progress' ? 'En Progreso' : (activeTrip.status === 'arrived' ? '¡Llegó tu Taxi!' : 'Buscando Taxi')}
                      </span>

                      {/* Share Trip */}
                      {(activeTrip.status === 'accepted' || activeTrip.status === 'arrived' || activeTrip.status === 'in_progress') && (
                        <button
                          onClick={() => setShowShareModal(true)}
                          className="btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.65rem', borderRadius: '4px' }}
                        >
                          <Share2 size={10} /> Compartir
                        </button>
                      )}
                    </div>

                    {activeTrip.status === 'pending' && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', textAlign: 'center' }}>
                        <div className="pulse-loader" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-glow)', border: '1px solid var(--brand-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                          <Navigation size={18} style={{ color: 'var(--brand-purple)', transform: 'rotate(45deg)' }} />
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>Despachando Solicitud...</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Asignando chofer más cercano en Salamanca.</div>
                      </div>
                    )}

                    {(activeTrip.status === 'accepted' || activeTrip.status === 'arrived' || activeTrip.status === 'in_progress') && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Driver summary card */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.02)', padding: '10px', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-purple)' }}>
                            <User size={18} />
                          </div>
                          <div style={{ flexGrow: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {activeTrip.driverName}
                              <span style={{ fontSize: '0.75rem', color: 'var(--brand-purple)', display: 'flex', alignItems: 'center', fontWeight: 500 }}>
                                <Star size={10} fill="var(--brand-purple)" style={{ marginRight: '1px' }} /> 4.9
                              </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {activeTrip.status === 'in_progress' ? 'A bordo' : (activeTrip.status === 'arrived' ? 'Te espera afuera' : `Llega en aprox: ${activeTrip.eta || '3 min'}`)}
                            </div>
                          </div>
                          <div className="chilean-plate">{activeTrip.driverPlate}</div>
                        </div>
                      </div>
                    )}

                    {/* Route specs */}
                    <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} style={{ color: 'var(--color-success)' }} /> <span><strong>Origen:</strong> {activeTrip.origin}</span></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Target size={14} style={{ color: 'var(--color-danger)' }} /> <span><strong>Destino:</strong> {activeTrip.destination}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '4px', marginTop: '4px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Costo del trayecto:</span>
                        <strong style={{ color: 'var(--brand-magenta)' }}>${activeTrip.price.toLocaleString('es-CL')}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Chat efímero for active trip */}
                  {(activeTrip.status === 'accepted' || activeTrip.status === 'arrived' || activeTrip.status === 'in_progress') && (
                    <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', height: '240px', padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', marginBottom: '8px' }}>
                        <MessageSquare size={14} style={{ color: 'var(--brand-purple)' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>CHAT PROTEGIDO</span>
                      </div>

                      {/* Messages box */}
                      <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                        {activeTrip.messages.map(m => {
                          const isMe = m.sender === 'passenger';
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
                        })}
                      </div>

                      {/* Quick replies */}
                      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '4px 0', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '6px', marginBottom: '6px' }}>
                        {['Ya voy!', 'Estoy en la puerta', 'Voy de polera roja', 'Espere 1 min porfa'].map((text, idx) => (
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

                      {/* Input form */}
                      <form onSubmit={handleSendCustomMessage} style={{ display: 'flex', gap: '4px' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enviar mensaje..."
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          style={{ flexGrow: 1, padding: '6px 10px', fontSize: '0.8rem', borderRadius: '6px' }}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '6px 10px', borderRadius: '6px' }}>
                          <Send size={12} />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Cancel Request (Hide when in progress) */}
                  {activeTrip.status !== 'in_progress' && (
                    <button
                      onClick={() => {
                        if (window.confirm('¿Quieres cancelar tu taxi en Salamanca?')) {
                          cancelTrip(activeTrip.id, 'passenger', 'Cancelado por el usuario');
                        }
                      }}
                      className="btn-danger"
                      style={{ width: '100%', padding: '10px' }}
                    >
                      [ CANCELAR SOLICITUD ]
                    </button>
                  )}
                </div>
              )}

              {/* POST-TRIP SUMMARY VIEW */}
              {postTrip && (
                <div className="card-glass animate-fade-in" style={{ border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: postTrip.status === 'completed' ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                    color: postTrip.status === 'completed' ? 'var(--color-success)' : 'var(--color-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    {postTrip.status === 'completed' ? <Check size={20} /> : <AlertTriangle size={20} />}
                  </div>

                  <h3 style={{ fontSize: '1.1rem', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                    {postTrip.status === 'completed' ? 'LLEGÓ AL DESTINO' : 'VIAJE CANCELADO'}
                  </h3>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '14px', lineHeight: '1.4' }}>
                    {postTrip.status === 'completed'
                      ? `Tu viaje con Don ${postTrip.driverName} ha finalizado con éxito.`
                      : `El viaje fue cancelado por ${postTrip.cancelledBy === 'passenger' ? 'ti' : 'el chofer'}.`
                    }
                  </p>

                  {postTrip.cancellationReason && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239,68,68,0.15)', padding: '8px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--color-danger)', marginBottom: '14px' }}>
                      Motivo: {postTrip.cancellationReason}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => archiveFinishedTrip(postTrip.id)}
                      className="btn-primary"
                      style={{ width: '100%', padding: '10px' }}
                    >
                      [ CERRAR Y VOLVER ] →
                    </button>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Esta pantalla se cerrará sola en 30 segundos...
                    </div>
                  </div>
                </div>
              )}

              {/* CLEAN STATE: Large interactive map and a single button to start request */}
              {!activeTrip && !postTrip && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>

                  {!isRequestFormOpen ? (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: 'auto 0', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center' }}>
                        <Compass className="animate-logo-hologram" size={48} style={{ color: 'var(--brand-purple)' }} />
                      </div>

                      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '1.5px' }}>
                        SISTEMA KARRY ACTIVO
                      </h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.5' }}>
                        Tienes conductores validados listos para llevarte en la comuna de Salamanca. Todo directo en la web y con resguardo de privacidad.
                      </p>

                      <button
                        onClick={() => setIsRequestFormOpen(true)}
                        className="btn-primary gradient-border-glow"
                        style={{
                          padding: '16px 20px',
                          fontSize: '0.8rem',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '10px'
                        }}
                      >
                        [ PEDIR RADIOTAXI ] ➔
                      </button>
                    </div>
                  ) : (
                    /* Interactive Request Form (Origin, Destination, suggest grid) */
                    <div className="card-glass animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>CONFIGURAR VIAJE</h3>
                        <button
                          onClick={() => setIsRequestFormOpen(false)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Origin */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="origin-coord">Origen (Salamanca)</label>
                        <input
                          id="origin-coord"
                          type="text"
                          className="form-input"
                          placeholder="¿Dónde te buscamos?"
                          value={origin}
                          onChange={e => setOrigin(e.target.value)}
                        />
                      </div>

                      {/* Destination */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="dest-coord">Destino</label>
                        <input
                          id="dest-coord"
                          type="text"
                          className="form-input"
                          placeholder="¿A dónde vas?"
                          value={destination}
                          onChange={e => setDestination(e.target.value)}
                        />
                      </div>

                      {/* Popular locations grid */}
                      <div>
                        <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>Destinos Frecuentes:</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                          {SALAMANCA_LOCATIONS.map((loc, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (!origin) {
                                  setOrigin(loc);
                                } else {
                                  setDestination(loc);
                                }
                              }}
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                color: 'var(--text-secondary)',
                                borderRadius: '6px',
                                padding: '6px 8px',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {loc}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pricing feedback */}
                      {origin && destination && (
                        <div className="animate-fade-in" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Tarifa sugerida:</div>
                            <strong style={{ color: 'var(--brand-purple)', fontSize: '0.95rem' }}>
                              ${calculateMockPrice(origin, destination).toLocaleString('es-CL')}
                            </strong>
                          </div>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Pago directo en Efectivo</span>
                        </div>
                      )}

                      <button
                        onClick={handleRequestTrip}
                        disabled={!origin.trim() || !destination.trim()}
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '6px' }}
                      >
                        [ PEDIR TAXI AHORA ] →
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </aside>

      {/* RIGHT PANEL: Huge full-screen map on desktop, responsive standard map on mobile */}
      <section className="main-map-panel">
        <div style={{ width: '100%', height: '100%' }}>
          <InteractiveMap height="100%" showNearbyTaxis={true} />
        </div>
      </section>

      {/* HISTORY DRAWER MENU SLIDE-IN (Kuve Style) */}
      <div className={`history-drawer ${isHistoryOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={14} style={{ color: 'var(--brand-purple)' }} /> HISTORIAL VIAJES
          </h3>
          <button
            onClick={() => setIsHistoryOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px 0' }}>
          {tripHistory.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', margin: 'auto 0' }}>
              No tienes viajes anteriores en Salamanca.
            </div>
          ) : (
            tripHistory.map(h => (
              <div
                key={h.id}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span style={{ color: h.status === 'completed' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {h.status === 'completed' ? 'Completado' : 'Cancelado'}
                  </span>
                  <span style={{ color: 'var(--brand-magenta)' }}>${h.price.toLocaleString('es-CL')}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>De: {h.origin}</div>
                <div style={{ color: 'var(--text-secondary)' }}>A: {h.destination}</div>
                {h.driverName && (
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', borderTop: '1px solid rgba(255,255,255,0.02)', paddingTop: '2px' }}>
                    Chofer: Don {h.driverName} ({h.driverPlate})
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {tripHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="btn-danger"
            style={{ width: '100%', padding: '10px' }}
          >
            [ VACIAR HISTORIAL ]
          </button>
        )}
      </div>

      {/* Share Modal Backdrop */}
      {showShareModal && activeTrip && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '16px'
        }}>
          <div className="card-glass" style={{ width: '100%', maxWidth: '340px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>COMPARTIR UBICACIÓN</h3>
              <button onClick={() => setShowShareModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Comparte el enlace de seguimiento en tiempo real con tus familiares por seguridad.
            </p>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: '6px', fontSize: '0.7rem', fontFamily: 'monospace', overflowX: 'auto', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
              {window.location.origin}/viaje/{activeTrip.id}
            </div>
            <button onClick={handleCopyShareLink} className="btn-primary" style={{ width: '100%' }}>
              Copiar Enlace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
