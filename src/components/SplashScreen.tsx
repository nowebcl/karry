import React, { useEffect, useState } from 'react';
import { KarryLogo } from './KarryHeaderLogo';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 12;
      });
    }, 160);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '40px'
    }}>
      {/* Top Status Bar Mock */}
      <div style={{
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#1D4133',
        fontSize: '0.85rem',
        fontWeight: 700
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <span>📶</span>
          <span>📡</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Main Centered Branding & Progress Bar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 24px',
        marginTop: '-20px'
      }}>
        <KarryLogo size="xl" showSlogan={true} />

        {/* Loading Bar matching image_0.png */}
        <div style={{
          width: '160px',
          height: '6px',
          backgroundColor: '#E5EFE9',
          borderRadius: '10px',
          marginTop: '44px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#22C55E',
            borderRadius: '10px',
            transition: 'width 0.2s ease-out'
          }} />
        </div>

        <span style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          color: '#889B92',
          letterSpacing: '0.22em',
          marginTop: '12px'
        }}>
          CARGANDO...
        </span>

        {onFinish && (
          <button 
            onClick={onFinish}
            style={{
              marginTop: '28px',
              backgroundColor: '#1D4133',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 22px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(29, 65, 51, 0.2)',
              transition: 'transform 0.2s ease'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Entrar a Salamanca
          </button>
        )}
      </div>

      {/* Salamanca Landscape Illustration Footer (image_0.png) */}
      <div style={{
        width: '100%',
        position: 'relative',
        lineHeight: 0,
        marginBottom: 0
      }}>
        <img 
          src="/imagenes/image_0.png" 
          alt="Salamanca Landscape"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            maxHeight: '260px',
            display: 'block'
          }} 
        />
      </div>
    </div>
  );
};
