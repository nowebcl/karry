import React from 'react';

interface KarryLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
}

export const KarryLogo: React.FC<KarryLogoProps> = ({ size = 'md', showSlogan = true }) => {
  const isLg = size === 'lg' || size === 'xl';
  const isXl = size === 'xl';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: size === 'xl' ? 'center' : 'flex-start' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: isXl ? '3.2rem' : isLg ? '2.5rem' : size === 'sm' ? '1.4rem' : '1.85rem',
          color: '#1D4133',
          letterSpacing: '-0.04em',
          lineHeight: 1.05,
          margin: 0
        }}>
          Karry
        </h1>
        {/* Arc smile green smile under 'a' matching image_5.png */}
        <svg 
          width={isXl ? "54" : isLg ? "42" : size === 'sm' ? "24" : "32"} 
          height={isXl ? "14" : isLg ? "11" : size === 'sm' ? "6" : "8"} 
          viewBox="0 0 40 10" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            bottom: isXl ? '-8px' : isLg ? '-6px' : '-4px',
            left: isXl ? '46px' : isLg ? '36px' : size === 'sm' ? '20px' : '26px'
          }}
        >
          <path d="M2 2C12 9 28 9 38 2" stroke="#8EDF6F" strokeWidth="3.8" strokeLinecap="round"/>
        </svg>
      </div>
      {showSlogan && (
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: isXl ? '1.15rem' : isLg ? '0.95rem' : size === 'sm' ? '0.68rem' : '0.8rem',
          fontWeight: 500,
          color: '#1D4133',
          letterSpacing: '0.01em',
          marginTop: isXl ? '14px' : isLg ? '10px' : '4px'
        }}>
          Salamanca se mueve
        </span>
      )}
    </div>
  );
};

export const KarryIsotype: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: '#1D4133',
      borderRadius: `${Math.round(size * 0.28)}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(29, 65, 51, 0.25)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <span style={{
        color: '#FFFFFF',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 800,
        fontSize: `${size * 0.58}px`,
        lineHeight: 1,
        marginTop: `-${size * 0.05}px`
      }}>
        K
      </span>
      <svg 
        width={`${size * 0.55}`} 
        height={`${size * 0.16}`} 
        viewBox="0 0 40 10" 
        fill="none"
        style={{ marginTop: `-${size * 0.08}px` }}
      >
        <path d="M2 2C12 9 28 9 38 2" stroke="#8EDF6F" strokeWidth="4.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
};
