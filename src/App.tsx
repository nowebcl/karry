import { useState } from 'react';
import { useTripStore } from './hooks/useTripStore';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { TripPlanningScreen } from './components/TripPlanningScreen';
import { VehicleSelectionScreen } from './components/VehicleSelectionScreen';
import { PassengerView } from './components/PassengerView';
import { DriverView } from './components/DriverView';
import { RefreshCw } from 'lucide-react';

type ScreenView = 'splash' | 'home' | 'planning' | 'vehicle' | 'active_trip';

export default function App() {
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

  // Screen view state for Passenger UI flow
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('home');
  const [selectedOrigin, setSelectedOrigin] = useState('Plaza de Armas Salamanca');
  const [selectedDestination, setSelectedDestination] = useState('Hospital de Salamanca');
  const [activeTab, setActiveTab] = useState('inicio');

  // Handle Quick Actions from Home
  const handleQuickAction = (action: string) => {
    if (action === 'Casa') {
      setSelectedOrigin('Plaza de Armas Salamanca');
      setSelectedDestination('Villa Santa Rosa, Salamanca');
      setCurrentScreen('vehicle');
    } else if (action === 'Trabajo') {
      setSelectedOrigin('Plaza de Armas Salamanca');
      setSelectedDestination('Municipalidad de Salamanca');
      setCurrentScreen('vehicle');
    } else {
      setCurrentScreen('planning');
    }
  };

  // Handle Destination Selection from Planning Screen
  const handleSelectDestination = (destName: string) => {
    setSelectedDestination(destName);
    setCurrentScreen('vehicle');
  };

  // Handle Trip Confirmation from Vehicle Selection Screen
  const handleConfirmTrip = (price: number) => {
    requestTrip(selectedOrigin, selectedDestination, price);
    setCurrentScreen('active_trip');
  };

  const handleReset = () => {
    if (window.confirm('¿Quieres reiniciar la simulación del demo? Se limpiarán los datos locales.')) {
      resetDemo();
      window.location.reload();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F261D',
      color: '#FFFFFF',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: '30px'
    }}>
      {/* Top Main Bar */}
      <header style={{
        width: '100%',
        backgroundColor: '#143026',
        borderBottom: '1px solid rgba(142, 223, 111, 0.2)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            backgroundColor: '#8EDF6F',
            color: '#1D4133',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}>
            K
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0, lineHeight: 1 }}>
              Karry <span style={{ color: '#8EDF6F', fontSize: '0.88rem', fontWeight: 600 }}>Salamanca</span>
            </h1>
            <p style={{ fontSize: '0.74rem', color: '#A0B8AD', margin: 0 }}>
              Plataforma Web de Transporte Local
            </p>
          </div>
        </div>

        {/* Simulator Role & Reset Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.35)',
            borderRadius: '20px',
            padding: '3px',
            display: 'flex',
            border: '1px solid rgba(255,255,255,0.12)'
          }}>
            <button
              onClick={() => setRole('passenger')}
              style={{
                backgroundColor: role === 'passenger' ? '#8EDF6F' : 'transparent',
                color: role === 'passenger' ? '#1D4133' : '#A0B8AD',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '16px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Pasajero
            </button>
            <button
              onClick={() => setRole('driver')}
              style={{
                backgroundColor: role === 'driver' ? '#8EDF6F' : 'transparent',
                color: role === 'driver' ? '#1D4133' : '#A0B8AD',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '16px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Conductor
            </button>
          </div>

          <button 
            onClick={handleReset}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Reiniciar Demo"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* Screen Switcher Toolbar */}
      {role === 'passenger' && (
        <div className="screen-switcher-bar" style={{ width: '100%', maxWidth: '600px' }}>
          <span style={{ color: '#8EDF6F', fontWeight: 700, fontSize: '0.76rem' }}>
            Vistas:
          </span>
          
          <button 
            className={`switcher-btn ${currentScreen === 'splash' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('splash')}
          >
            Splash
          </button>

          <button 
            className={`switcher-btn ${currentScreen === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('home')}
          >
            Home
          </button>

          <button 
            className={`switcher-btn ${currentScreen === 'planning' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('planning')}
          >
            Planifica
          </button>

          <button 
            className={`switcher-btn ${currentScreen === 'vehicle' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('vehicle')}
          >
            Elige
          </button>

          <button 
            className={`switcher-btn ${currentScreen === 'active_trip' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('active_trip')}
          >
            En Camino
          </button>
        </div>
      )}

      {/* Web Application Container */}
      <div className="web-app-container">
        {role === 'passenger' ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            {currentScreen === 'splash' && (
              <SplashScreen onFinish={() => setCurrentScreen('home')} />
            )}

            {currentScreen === 'home' && (
              <HomeScreen 
                onOpenSearch={() => setCurrentScreen('planning')}
                onSelectQuickAction={handleQuickAction}
                onOpenHistory={() => setCurrentScreen('active_trip')}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  if (tab === 'viajes') setCurrentScreen('active_trip');
                  if (tab === 'inicio') setCurrentScreen('home');
                }}
                activeTab={activeTab}
              />
            )}

            {currentScreen === 'planning' && (
              <TripPlanningScreen 
                onBack={() => setCurrentScreen('home')}
                onSelectDestination={handleSelectDestination}
                initialOrigin={selectedOrigin}
              />
            )}

            {currentScreen === 'vehicle' && (
              <VehicleSelectionScreen 
                origin={selectedOrigin}
                destination={selectedDestination}
                onBack={() => setCurrentScreen('planning')}
                onConfirmTrip={handleConfirmTrip}
              />
            )}

            {currentScreen === 'active_trip' && (
              <PassengerView 
                passengerName={passengerName}
                passengerPhone={passengerPhone}
                savePassengerProfile={savePassengerProfile}
                trips={trips}
                requestTrip={requestTrip}
                cancelTrip={cancelTrip}
                sendChatMessage={sendChatMessage}
              />
            )}
          </div>
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
      </div>

      {/* Footer Info */}
      <footer style={{
        marginTop: '16px',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: '#A0B8AD',
        maxWidth: '600px',
        padding: '0 16px'
      }}>
        <p style={{ fontWeight: 600, color: '#8EDF6F', marginBottom: '4px' }}>
          Karry Salamanca · Sistema de Transporte Local
        </p>
        <p>
          #1D4133 Verde Bosque · #8EDF6F Verde Lima · Salamanca, Chile
        </p>
      </footer>
    </div>
  );
}
