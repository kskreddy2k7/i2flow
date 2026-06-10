import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" style={{
      padding: '120px 8%',
      position: 'relative',
      zIndex: 10,
      background: 'rgba(5, 5, 5, 0.8)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontFamily: 'var(--font-display)',
          marginBottom: '24px',
          fontWeight: 700
        }}>
          About <span className="text-gradient-sunrise">I2Flow</span>
        </h2>
        <p style={{
          fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)',
          color: 'var(--color-grey-light)',
          lineHeight: '1.8'
        }}>
          I2Flow is a platform dedicated to building AI projects, developer resources, learning guides, and practical tools for creators and engineers. We focus on elevating coding into a smooth sunrise flow with premium open source infrastructure.
        </p>
      </div>
    </section>
  );
};

export default About;
