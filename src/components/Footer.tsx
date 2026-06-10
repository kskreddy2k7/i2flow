import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { getSocialLinks } from '../lib/db';
import type { SocialLink } from '../lib/db';

interface FooterProps {
  onNavClick: (sectionId: string) => void;
  onAdminToggle: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onAdminToggle }) => {
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    getSocialLinks().then(setSocials);
  }, []);

  return (
    <footer style={{
      borderTop: '1px solid rgba(205, 127, 50, 0.2)',
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
            src="/images/logo.jpg" 
            alt="I2Flow Logo" 
            style={{ width: '48px', height: '48px', borderRadius: '50%', marginBottom: '16px' }} 
          />
          <h3 className="text-gradient-sunrise" style={{ fontSize: '1.5rem', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
            I2Flow
          </h3>
          <p style={{ color: 'var(--color-grey-light)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Building AI Projects &amp; Developer Resources
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '1rem', color: 'var(--color-white)', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--color-grey-light)' }}>
            <li><button onClick={() => onNavClick('home')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Home</button></li>
            <li><button onClick={() => onNavClick('resources')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Resources</button></li>
            <li><button onClick={() => onNavClick('about')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>About</button></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 style={{ fontSize: '1rem', color: 'var(--color-white)', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Connect</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--color-grey-light)' }}>
            {socials.map(social => (
              <li key={social.id}>
                <a href={social.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Admin */}
        <div>
          <h4 style={{ fontSize: '1rem', color: 'var(--color-white)', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Portal</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--color-grey-light)' }}>
            <li><button onClick={onAdminToggle} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Founder Portal</button></li>
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
        <span>&copy; {new Date().getFullYear()} I2Flow. All rights reserved.</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={14} className="text-gradient-sunrise" />
          Sunrise Production v2.0
        </span>
      </div>
    </footer>
  );
};

export default Footer;
