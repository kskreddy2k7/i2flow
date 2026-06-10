import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Code as GithubIcon, Briefcase as LinkedinIcon, Camera as InstagramIcon, Mail as MailIcon, ArrowUpRight } from 'lucide-react';
import { socialLinks } from '../config/socialLinks';

interface SocialCardProps {
  platform: string;
  title: string;
  description: string;
  buttonText: string;
  url: string;
  icon: React.ReactNode;
  index: number;
}

const SocialCard: React.FC<SocialCardProps> = ({ title, description, buttonText, url, icon, index }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.a
      ref={cardRef}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '32px',
        borderRadius: '16px',
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(5, 5, 5, 0.5)',
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
      }}
      whileHover={{ 
        y: -6, 
        borderColor: 'rgba(205, 127, 50, 0.35)',
        boxShadow: '0 10px 30px rgba(205, 127, 50, 0.05)'
      }}
    >
      {/* Spotlight Glow Effect */}
      {isHovered && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(205, 127, 50, 0.12), transparent 85%)`,
            zIndex: 0,
          }}
        />
      )}

      {/* Shine Effect */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: isHovered ? '100%' : '-100%',
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent)',
          transform: 'skewX(-25deg)',
          transition: isHovered ? 'left 0.75s ease-in-out' : 'none',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ 
            background: 'rgba(205, 127, 50, 0.1)', 
            padding: '12px', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(205, 127, 50, 0.15)'
          }}>
            {icon}
          </div>
          <ArrowUpRight size={18} style={{ color: 'var(--color-grey-light)', transition: 'transform 0.2s', transform: isHovered ? 'translate(2px, -2px)' : 'none' }} />
        </div>

        <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', marginBottom: '12px', fontWeight: 600 }}>
          {title}
        </h3>
        
        <p style={{ color: 'var(--color-grey-light)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '32px', flexGrow: 1 }}>
          {description}
        </p>
        
        <div style={{ 
          fontSize: '0.9rem', 
          fontWeight: 600, 
          color: 'var(--color-gold)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {buttonText}
        </div>
      </div>
    </motion.a>
  );
};

export const ConnectSection: React.FC = () => {
  const socialCards = [
    {
      platform: 'github',
      title: 'GitHub',
      description: 'Explore source code, AI projects, experiments, and open-source repositories.',
      buttonText: 'View GitHub →',
      url: socialLinks.github,
      icon: <GithubIcon size={24} className="text-gradient-sunrise" />
    },
    {
      platform: 'linkedin',
      title: 'LinkedIn',
      description: 'Connect professionally and follow my software development journey.',
      buttonText: 'Connect on LinkedIn →',
      url: socialLinks.linkedin,
      icon: <LinkedinIcon size={24} className="text-gradient-sunrise" />
    },
    {
      platform: 'instagram',
      title: 'Instagram',
      description: 'Follow Build In Public updates, project launches, tutorials, reels, and behind-the-scenes content.',
      buttonText: 'Follow Instagram →',
      url: socialLinks.instagram,
      icon: <InstagramIcon size={24} className="text-gradient-sunrise" />
    },
    {
      platform: 'email',
      title: 'Email',
      description: `For collaborations, opportunities, partnerships, project discussions, and feedback.\n\n${socialLinks.email}`,
      buttonText: 'Send Email →',
      url: `mailto:${socialLinks.email}`,
      icon: <MailIcon size={24} className="text-gradient-sunrise" />
    }
  ];

  return (
    <section 
      style={{ 
        position: 'relative', 
        zIndex: 10, 
        background: 'rgba(5, 5, 5, 0.4)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* 1. SOCIAL CARDS GRID */}
      <div style={{ padding: '80px 8% 80px 8%' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontFamily: 'var(--font-display)', marginBottom: '16px', fontWeight: 700 }}>
            Connect With <span className="text-gradient-sunrise">I2Flow</span>
          </h2>
          <p style={{ color: 'var(--color-grey-light)', fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Follow my Build In Public journey, explore projects, access resources, and connect with me across platforms.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '30px' 
        }}>
          {socialCards.map((card, idx) => (
            <SocialCard key={card.platform} {...card} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
