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
      paddingBottom: '40px'
    }}>
      {/* Top Main Bar for Demo Presentation */}
      <header style={{
        width: '100%',
        backgroundColor: '#143026',
        borderBottom: '1px solid rgba(142, 223, 111, 0.2)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            backgroundColor: '#8EDF6F',
            color: '#1D4133',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800
          }}>
            K
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0, lineHeight: 1 }}>
              Karry <span style={{ color: '#8EDF6F', fontSize: '0.85rem', fontWeight: 600 }}>Salamanca</span>
            </h1>
            <p style={{ fontSize: '0.72rem', color: '#A0B8AD', margin: 0 }}>
              Sistema de Identidad & UI/UX (Referencia image_0 a image_5)
            </p>
          </div>
        </div>

        {/* Simulator Role & Reset Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '20px',
            padding: '3px',
            display: 'flex',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <button
              onClick={() => setRole('passenger')}
              style={{
                backgroundColor: role === 'passenger' ? '#8EDF6F' : 'transparent',
                color: role === 'passenger' ? '#1D4133' : '#A0B8AD',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '0.76rem',
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
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '0.76rem',
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
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Reiniciar Demo"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </header>

      {/* Screen Switcher Toolbar for Direct Reference Testing */}
      {role === 'passenger' && (
        <div className="screen-switcher-bar" style={{ width: '100%', maxWidth: '440px' }}>
          <span style={{ color: '#8EDF6F', fontWeight: 700, fontSize: '0.72rem' }}>
            Vistas UI:
          </span>
          
          <button 
            className={`switcher-btn ${currentScreen === 'splash' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('splash')}
          >
            1. Splash (image_0)
          </button>

          <button 
            className={`switcher-btn ${currentScreen === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('home')}
          >
            2. Home (image_1)
          </button>

          <button 
            className={`switcher-btn ${currentScreen === 'planning' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('planning')}
          >
            3. Planifica (image_2)
          </button>

          <button 
            className={`switcher-btn ${currentScreen === 'vehicle' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('vehicle')}
          >
            4. Elige (image_3)
          </button>

          <button 
            className={`switcher-btn ${currentScreen === 'active_trip' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('active_trip')}
          >
            5. En Camino
          </button>
        </div>
      )}

      {/* Mobile Shell Frame */}
      <div className="mobile-shell-container">
        {/* iOS Status Bar */}
        <div className="ios-status-bar">
          <span>9:41</span>
          <div className="ios-status-icons">
            <span>📶</span>
            <span>📡</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Screen View Router */}
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
        marginTop: '20px',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: '#A0B8AD',
        maxWidth: '440px',
        padding: '0 16px'
      }}>
        <p style={{ fontWeight: 600, color: '#8EDF6F', marginBottom: '4px' }}>
          App Karry Salamanca · Versión 0.1
        </p>
        <p>
          Basado en la paleta oficial (#1D4133 Verde Bosque, #8EDF6F Verde Lima) e iconografía de Salamanca, Chile.
        </p>
      </footer>
    </div>
  );
}
