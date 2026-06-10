import React, { useEffect, useState } from 'react';
import { getSocialLinks } from '../lib/db';
import type { SocialLink } from '../lib/db';
import { Code, Briefcase, Camera, Mail, ArrowRight, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const SocialLinks: React.FC = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      const data = await getSocialLinks();
      setLinks(data);
    };
    fetchLinks();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'github': return <Code size={24} className="text-gradient-sunrise" />;
      case 'linkedin': return <Briefcase size={24} className="text-gradient-sunrise" />;
      case 'instagram': return <Camera size={24} className="text-gradient-sunrise" />;
      case 'mail': return <Mail size={24} className="text-gradient-sunrise" />;
      default: return <LinkIcon size={24} className="text-gradient-sunrise" />;
    }
  };

  if (links.length === 0) return null;

  return (
    <section style={{ padding: '80px 8%', position: 'relative', zIndex: 10 }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          Connect
        </h2>
        <p style={{ color: 'var(--color-grey-light)', fontSize: '1rem' }}>
          Follow our journey and join the community.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {links.map((link, index) => (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="glass-panel"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '24px',
              borderRadius: '12px',
              textDecoration: 'none',
              color: 'inherit',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{ y: -5, borderColor: 'rgba(205, 127, 50, 0.4)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.05)', 
                padding: '12px', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getIcon(link.icon)}
              </div>
              <ArrowRight size={18} style={{ color: 'var(--color-grey-light)' }} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
              {link.name}
            </h3>
            <p style={{ color: 'var(--color-grey-light)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {link.description}
            </p>
            
            <div style={{ marginTop: '24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-copper)' }}>
              Visit {link.name} &rarr;
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default SocialLinks;
