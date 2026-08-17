import { useTripStore } from './hooks/useTripStore';
import { PassengerView } from './components/PassengerView';
import { DriverView } from './components/DriverView';
import { Navigation, ShieldCheck, RefreshCw } from 'lucide-react';

function App() {
  const {
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
    resetDemo
  } = useTripStore();

  const handleReset = () => {
    if (window.confirm('¿Quieres reiniciar la simulación del demo? Se borrarán todos los datos locales.')) {
      resetDemo();
      window.location.reload();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header component */}
      <header className="app-header">
        <div className="app-logo">
          <Navigation size={20} style={{ color: 'var(--accent-color)', transform: 'rotate(45deg)' }} />
          Karry <span>Salamanca</span>
        </div>

        {/* Dynamic Role Switcher for Simulator */}
        <div className="role-toggle">
          <button 
            onClick={() => setRole('passenger')} 
            className={`role-tab ${role === 'passenger' ? 'active' : ''}`}
          >
            Pasajero
          </button>
          <button 
            onClick={() => setRole('driver')} 
            className={`role-tab ${role === 'driver' ? 'active' : ''}`}
          >
            Conductor
          </button>
        </div>

        {/* Reset button to clear localStorage */}
        <button 
          onClick={handleReset} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-muted)', 
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-color)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          title="Reiniciar Demo"
        >
          <RefreshCw size={16} />
        </button>
      </header>

      {/* Demo helper banner */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '8px 16px', fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
        <ShieldCheck size={14} style={{ color: 'var(--accent-color)' }} />
        <span>
          {role === 'passenger' 
            ? 'Modo Pasajero: Pide un viaje. Abre otra pestaña en modo Conductor para ver y aceptar en tiempo real.' 
            : 'Modo Conductor: Acepta y gestiona los viajes de los vecinos de Salamanca en tiempo real.'
          }
        </span>
      </div>

      {/* Main Content Area */}
      <main className="app-main">
        {role === 'passenger' ? (
          <PassengerView 
            passengerName={passengerName}
            passengerPhone={passengerPhone}
            savePassengerProfile={savePassengerProfile}
            trips={trips}
            requestTrip={requestTrip}
            cancelTrip={cancelTrip}
            sendChatMessage={sendChatMessage}
          />
        ) : (
          <DriverView 
            driverName={driverName}
            driverPhone={driverPhone}
            driverPlate={driverPlate}
            driverIsApproved={driverIsApproved}
            saveDriverProfile={saveDriverProfile}
            approveDriver={approveDriver}
            trips={trips}
            acceptTrip={acceptTrip}
            driverArrived={driverArrived}
            startTrip={startTrip}
            completeTrip={completeTrip}
            cancelTrip={cancelTrip}
            sendChatMessage={sendChatMessage}
          />
        )}
      </main>

      {/* Legal Footer Disclaimer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '24px 16px', backgroundColor: '#07080c', color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', lineHeight: '1.5' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto' }}>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Deslinde de Responsabilidad Legal
          </p>
          <p style={{ marginBottom: '12px' }}>
            Karry es una plataforma digital comunitaria de intermediación de código abierto para la provincia de Choapa. No poseemos flota de vehículos ni somos una empresa de transporte. La relación civil y de transporte es de carácter estrictamente independiente y directo entre el pasajero y el conductor profesional autorizado (Licencia Clase A).
          </p>
          <p>© 2026 Karry Salamanca · Simplificando el transporte local con confianza.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
