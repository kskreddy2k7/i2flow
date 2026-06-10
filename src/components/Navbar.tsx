import React from 'react';
import { Shield } from 'lucide-react';

interface NavbarProps {
  onNavClick: (sectionId: string) => void;
  currentSection: string;
  onAdminClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavClick, currentSection, onAdminClick }) => {

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Resources', id: 'resources' },
    { label: 'Projects', id: 'projects' },
    { label: 'Downloads', id: 'downloads' },
    { label: 'About', id: 'about' }
  ];

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
      {/* Left side: Placeholder for the 3D logo + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* The 3D logo will move into this space when scrolled to Section 7 */}
        <div style={{ width: '40px', height: '40px', position: 'relative' }} id="logo-nav-anchor" />
        
        <span 
          onClick={() => onNavClick('home')}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div className="desktop-menu" style={{ display: 'flex', gap: '24px' }}>
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

      {/* Responsive mobile menu trigger */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
