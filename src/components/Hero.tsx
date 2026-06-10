import React from 'react';
import { ArrowRight, Code } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onProjectsClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onProjectsClick }) => {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '120px 8% 60px 8%',
      position: 'relative',
      zIndex: 1,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '40px',
        alignItems: 'center',
        width: '100%',
      }} className="hero-container">
        
        {/* Left Side: Typography & Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <span style={{
              background: 'rgba(255, 111, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '100px',
              padding: '6px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              display: 'inline-flex',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              Sunrise Platform v2.0
            </span>
            
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              lineHeight: 1.1,
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: '16px',
            }}>
              <span className="text-gradient-sunrise">I2Flow</span>
              <br />
              Building AI Projects &amp; Developer Resources
            </h1>
            
            <p style={{
              fontSize: 'clamp(1.05rem, 1.5vw, 1.25rem)',
              color: 'var(--color-grey-light)',
              lineHeight: 1.6,
              maxWidth: '600px',
            }}>
              One destination for AI projects, source code, PDFs, tutorials, demos and learning resources.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
            <button onClick={onExploreClick} className="btn-primary">
              Explore Resources
              <ArrowRight size={18} />
            </button>
            <button onClick={onProjectsClick} className="btn-secondary">
              <Code size={18} className="text-gradient-sunrise" />
              View Projects
            </button>
          </div>
        </div>

        {/* Right Side: Logo */}
        <div style={{
          height: '400px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }} className="hero-logo-container">
          <img 
            src="images/logo.jpg" 
            alt="I2Flow Logo" 
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              animation: 'float 6s ease-in-out infinite',
              filter: 'drop-shadow(0 20px 40px rgba(255, 111, 0, 0.3))',
              borderRadius: '50%',
            }}
          />
        </div>

      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @media (max-width: 992px) {
          .hero-container {
            gridTemplateColumns: 1fr !important;
            text-align: center;
          }
          .hero-container > div {
            align-items: center !important;
            justify-content: center !important;
          }
          .hero-logo-container {
            height: 250px !important;
            order: -1; /* Move logo on top of text on tablet/mobile */
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
