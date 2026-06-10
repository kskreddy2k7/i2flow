import React from 'react';
import { Info } from 'lucide-react';
import { socialLinks } from '../config/socialLinks';

interface FooterProps {
  onNavClick: (sectionId: string) => void;
  onAdminToggle: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onAdminToggle }) => {
  return (
    <div style={{ position: 'relative' }}>
      {/* Sunrise Glow Divider */}
      <div 
        style={{
          height: '2px',
          width: '100%',
          background: 'linear-gradient(90deg, transparent, var(--color-orange), var(--color-gold), var(--color-orange), transparent)',
          opacity: 0.6,
          boxShadow: '0 0 15px rgba(255, 111, 0, 0.5)'
        }}
      />

      <footer style={{
        background: 'var(--color-charcoal)',
        padding: '60px 8% 40px 8%',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}>
          {/* Brand */}
          <div style={{ gridColumn: '1 / -1', maxWidth: '300px' }}>
            <img 
              src="images/logo.jpg" 
              alt="I2Flow Logo" 
              style={{ width: '48px', height: '48px', borderRadius: '50%', marginBottom: '16px' }} 
            />
            <h3 className="text-gradient-sunrise" style={{ fontSize: '1.5rem', marginBottom: '8px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              I2Flow
            </h3>
            <p style={{ color: 'var(--color-grey-light)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Building AI Projects &amp; Developer Resources
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--color-white)', marginBottom: '16px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--color-grey-light)' }}>
              <li><button onClick={() => onNavClick('home')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Home</button></li>
              <li><button onClick={() => onNavClick('resources')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Resources</button></li>
              <li><button onClick={() => onNavClick('projects')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Projects</button></li>
              <li><button onClick={() => onNavClick('downloads')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Downloads</button></li>
              <li><button onClick={() => onNavClick('about')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>About</button></li>
            </ul>
          </div>

          {/* Social Connect */}
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--color-white)', marginBottom: '16px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Connect</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--color-grey-light)' }}>
              <li>
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  GitHub
                </a>
              </li>
              <li>
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Instagram
                </a>
              </li>
              <li>
                <a href={`mailto:${socialLinks.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  Email
                </a>
              </li>
            </ul>
          </div>

          {/* Admin Portal */}
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--color-white)', marginBottom: '16px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Portal</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--color-grey-light)' }}>
              <li><button onClick={onAdminToggle} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Founder Portal</button></li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.85rem',
          color: 'var(--color-grey-light)',
        }}>
          <div>
            <span>&copy; 2026 I2Flow</span>
            <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.1)' }}>|</span>
            <span style={{ color: 'var(--color-gold)', fontWeight: 500 }}>Ideas &bull; Innovation &bull; Impact</span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={14} className="text-gradient-sunrise" />
            Sunrise Production v2.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
