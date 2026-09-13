import React from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '20px',
      overflow: 'hidden'
    }}>
      {/* Main Centered Artwork (image_0.png) */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src="/imagenes/image_0.png" 
          alt="Karry - Salamanca se mueve"
          style={{
            width: '100%',
            maxHeight: '620px',
            objectFit: 'contain',
            borderRadius: '20px',
            display: 'block'
          }} 
        />

        {/* Action Button Centered Directly Underneath Artwork */}
        {onFinish && (
          <button 
            onClick={onFinish}
            style={{
              marginTop: '24px',
              backgroundColor: '#1D4133',
              color: '#FFFFFF',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '24px',
              fontSize: '1.05rem',
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(29, 65, 51, 0.25)',
              transition: 'transform 0.2s ease, background-color 0.2s ease'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Entrar a Salamanca
          </button>
        )}
      </div>
    </div>
  );
};
