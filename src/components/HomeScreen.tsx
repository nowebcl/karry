import React, { useState, useEffect } from 'react';
import { KarryLogo } from './KarryHeaderLogo';
import { InteractiveMap } from './InteractiveMap';
import { 
  Home, 
  Briefcase, 
  Star, 
  Clock, 
  Search, 
  Menu, 
  Navigation2, 
  Heart, 
  User, 
  Car,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface HomeScreenProps {
  onOpenSearch: () => void;
  onSelectQuickAction: (action: string) => void;
  onOpenHistory?: () => void;
  onSelectTab?: (tab: string) => void;
  activeTab?: string;
}

const PROMO_BANNERS = [
  {
    id: 1,
    title: 'Muévete por Salamanca',
    subtitle: 'Rápido · Seguro · Local',
    description: 'Nuestra ciudad, siempre en movimiento',
    bgImage: '/imagenes/image_1.png',
    badge: 'Oficial Karry'
  },
  {
    id: 2,
    title: 'Festivales de Verano 2026',
    subtitle: 'Música, cultura y feria artesanal',
    description: 'Viaja seguro a la Plaza de Armas con Karry',
    bgImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    badge: 'Evento Comunitario'
  },
  {
    id: 3,
    title: 'Turismo Valle del Choapa',
    subtitle: 'Ruta Cueva de la Bruja & El Tambo',
    description: 'Tarifas fijas para paseos familiares',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    badge: 'Destino Destacado'
  },
  {
    id: 4,
    title: 'Restaurante & Comercio Local',
    subtitle: 'Sabores tradicionales de Salamanca',
    description: 'Apoya el emprendimiento de Choapa',
    bgImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    badge: 'Comercio Amigo'
  }
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenSearch,
  onSelectQuickAction,
  onOpenHistory,
  onSelectTab,
  activeTab = 'inicio'
}) => {
  const [bannerIndex, setBannerIndex] = useState(0);

  // Auto-rotate promotional carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentBanner = PROMO_BANNERS[bannerIndex];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#F6FAF6',
      position: 'relative',
      overflowY: 'auto',
      paddingBottom: '80px'
    }}>
      {/* Top Bar Header */}
      <div style={{
        padding: '14px 20px 8px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F6FAF6'
      }}>
        <KarryLogo size="md" showSlogan={true} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            className="user-avatar-badge"
            title="Perfil de Juan Pérez"
          >
            JP
          </div>
          <button 
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#1D4133',
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Menú principal"
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* Greeting Header */}
      <div style={{ padding: '12px 20px 16px 20px' }}>
        <h2 style={{
          fontSize: '1.85rem',
          fontWeight: 800,
          color: '#1D4133',
          lineHeight: 1.1,
          letterSpacing: '-0.03em'
        }}>
          Hola, Juan
        </h2>
        <p style={{
          fontSize: '1.05rem',
          fontWeight: 500,
          color: '#576E64',
          marginTop: '4px'
        }}>
          ¿A dónde vamos hoy?
        </p>
      </div>

      {/* Search Input Bar (Click opens Search/Planification Screen) */}
      <div style={{ padding: '0 20px 16px 20px' }}>
        <div 
          onClick={onOpenSearch}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 4px 20px rgba(29, 65, 51, 0.06)',
            border: '1.5px solid #E2ECE7',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Search size={22} style={{ color: '#1D4133' }} />
          <div style={{ height: '22px', width: '1px', backgroundColor: '#E2ECE7' }} />
          <span style={{
            fontSize: '0.96rem',
            fontWeight: 500,
            color: '#889B92'
          }}>
            Ingresa un destino en Salamanca
          </span>
        </div>
      </div>

      {/* 4 Quick Actions Grid */}
      <div className="quick-actions-grid">
        <div 
          className="quick-action-card"
          onClick={() => onSelectQuickAction('Casa')}
        >
          <div className="quick-action-icon-wrapper">
            <Home size={22} />
          </div>
          <span className="quick-action-label">Casa</span>
        </div>

        <div 
          className="quick-action-card"
          onClick={() => onSelectQuickAction('Trabajo')}
        >
          <div className="quick-action-icon-wrapper">
            <Briefcase size={22} />
          </div>
          <span className="quick-action-label">Trabajo</span>
        </div>

        <div 
          className="quick-action-card"
          onClick={() => onSelectQuickAction('Favoritos')}
        >
          <div className="quick-action-icon-wrapper">
            <Star size={22} />
          </div>
          <span className="quick-action-label">Favoritos</span>
        </div>

        <div 
          className="quick-action-card"
          onClick={() => {
            if (onOpenHistory) onOpenHistory();
            else onSelectQuickAction('Historial');
          }}
        >
          <div className="quick-action-icon-wrapper">
            <Clock size={22} />
          </div>
          <span className="quick-action-label">Historial</span>
        </div>
      </div>

      {/* Salamanca Interactive Map */}
      <div style={{
        padding: '0 20px',
        marginBottom: '18px',
        position: 'relative'
      }}>
        <div style={{
          height: '240px',
          borderRadius: '22px',
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(29, 65, 51, 0.08)',
          border: '1px solid #E2ECE7',
          position: 'relative'
        }}>
          <InteractiveMap height="100%" onSelectLocation={onOpenSearch} />
          
          {/* Map Overlay Button */}
          <button 
            onClick={onOpenSearch}
            style={{
              position: 'absolute',
              bottom: '14px',
              right: '14px',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 600,
              color: '#1D4133'
            }}
            title="Centrar ubicación"
          >
            <Navigation2 size={22} style={{ fill: '#1D4133' }} />
          </button>
        </div>
      </div>

      {/* Dynamic Promotional Rotating Banner (Crucial Requirement matching image_1.png) */}
      <div style={{ padding: '0 20px 16px 20px' }}>
        <div style={{
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 8px 24px rgba(29, 65, 51, 0.08)',
          border: '1px solid #E2ECE7',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Banner Image Container */}
          <div style={{
            position: 'relative',
            height: '140px',
            width: '100%',
            overflow: 'hidden'
          }}>
            {bannerIndex === 0 ? (
              <img 
                src="/imagenes/image_1.png" 
                alt="Muévete por Salamanca"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'bottom center'
                }} 
              />
            ) : (
              <img 
                src={currentBanner.bgImage} 
                alt={currentBanner.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} 
              />
            )}

            {/* Gradient Overlay for Text Readability */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(29, 65, 51, 0.92) 0%, rgba(29, 65, 51, 0.75) 50%, rgba(29, 65, 51, 0.1) 100%)',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#FFFFFF'
            }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: '#8EDF6F',
                  color: '#1D4133',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '10px',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {currentBanner.badge}
                </span>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.15
                }}>
                  {currentBanner.title}
                </h3>
                <p style={{
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: '#D2ECE0',
                  marginTop: '2px'
                }}>
                  {currentBanner.subtitle}
                </p>
              </div>

              <div style={{
                fontSize: '0.72rem',
                color: '#8EDF6F',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Sparkles size={12} />
                <span>{currentBanner.description}</span>
              </div>
            </div>

            {/* Banner Manual Navigation Arrows */}
            <button 
              onClick={() => setBannerIndex((prev) => (prev - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length)}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(4px)',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <button 
              onClick={() => setBannerIndex((prev) => (prev + 1) % PROMO_BANNERS.length)}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(4px)',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Banner Dots Bar */}
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            {PROMO_BANNERS.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setBannerIndex(idx)}
                style={{
                  width: bannerIndex === idx ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: bannerIndex === idx ? '#1D4133' : '#D1E2D9',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation Bar (image_1.png) */}
      <div className="bottom-nav-bar">
        <button 
          className={`nav-item ${activeTab === 'inicio' ? 'active' : ''}`}
          onClick={() => onSelectTab && onSelectTab('inicio')}
        >
          <Home size={22} style={{ color: activeTab === 'inicio' ? '#1D4133' : '#889B92' }} />
          <span>Inicio</span>
          {activeTab === 'inicio' && <div className="nav-icon-indicator" />}
        </button>

        <button 
          className={`nav-item ${activeTab === 'viajes' ? 'active' : ''}`}
          onClick={() => onSelectTab && onSelectTab('viajes')}
        >
          <Car size={22} style={{ color: activeTab === 'viajes' ? '#1D4133' : '#889B92' }} />
          <span>Viajes</span>
          {activeTab === 'viajes' && <div className="nav-icon-indicator" />}
        </button>

        <button 
          className={`nav-item ${activeTab === 'favoritos' ? 'active' : ''}`}
          onClick={() => onSelectTab && onSelectTab('favoritos')}
        >
          <Heart size={22} style={{ color: activeTab === 'favoritos' ? '#1D4133' : '#889B92' }} />
          <span>Favoritos</span>
          {activeTab === 'favoritos' && <div className="nav-icon-indicator" />}
        </button>

        <button 
          className={`nav-item ${activeTab === 'cuenta' ? 'active' : ''}`}
          onClick={() => onSelectTab && onSelectTab('cuenta')}
        >
          <User size={22} style={{ color: activeTab === 'cuenta' ? '#1D4133' : '#889B92' }} />
          <span>Cuenta</span>
          {activeTab === 'cuenta' && <div className="nav-icon-indicator" />}
        </button>
      </div>
    </div>
  );
};
