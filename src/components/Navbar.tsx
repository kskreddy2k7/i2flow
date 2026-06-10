import React, { useState } from 'react';
import { Shield, Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavClick: (sectionId: string) => void;
  currentSection: string;
  onAdminClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavClick, currentSection, onAdminClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Resources', id: 'resources' },
    { label: 'Projects', id: 'projects' },
    { label: 'Downloads', id: 'downloads' },
    { label: 'About', id: 'about' }
  ];

  const handleMobileNavClick = (id: string) => {
    onNavClick(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '16px 24px',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '70px',
    }}>
      {/* Left side: Logo + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', position: 'relative' }} id="logo-nav-anchor" />
        
        <span 
          onClick={() => handleMobileNavClick('home')}
          className="text-gradient-sunrise"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            cursor: 'pointer',
            marginLeft: '12px',
          }}
        >
          I2Flow
        </span>
      </div>

      {/* Desktop Menu */}
      <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: currentSection === item.id ? 'var(--color-gold)' : 'var(--color-grey-light)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                position: 'relative',
              }}
            >
              {item.label}
              {currentSection === item.id && (
                <span style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, var(--color-gold), var(--color-orange))',
                  borderRadius: '2px',
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Admin Login Shortcut */}
        <button
          onClick={onAdminClick}
          className="btn-secondary"
          style={{
            padding: '8px 16px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Shield size={14} className="text-gradient-sunrise" />
          Founder Portal
        </button>
      </div>

      {/* Mobile Hamburger Button */}
      <div className="mobile-menu-toggle" style={{ display: 'none', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onAdminClick}
          className="btn-secondary"
          style={{
            padding: '6px 12px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Shield size={12} />
          Portal
        </button>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-white)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-drawer glass-panel"
          style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            background: 'rgba(5, 5, 5, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(205, 127, 50, 0.2)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            zIndex: 99,
            animation: 'slideDown 0.3s ease-out forwards',
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMobileNavClick(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: currentSection === item.id ? 'var(--color-gold)' : 'var(--color-grey-light)',
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                fontWeight: 500,
                textAlign: 'left',
                cursor: 'pointer',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                transition: 'color 0.2s ease',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* CSS overrides for mobile view */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
