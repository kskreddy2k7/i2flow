import React from 'react';
import type { Resource } from '../lib/db';
import { Calendar, Download, Folder, FileText, ExternalLink, Code, Camera, Archive } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResourceCardProps {
  resource: Resource;
  categoryName: string;
  onClick: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, categoryName, onClick }) => {
  return (
    <motion.div
      className="glass-card"
      style={{
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        overflow: 'hidden'
      }}
      onClick={onClick}
      whileHover={{ y: -5, borderColor: 'rgba(205, 127, 50, 0.4)' }}
    >
      {/* Image Frame */}
      <div style={{
        width: '100%',
        height: '180px',
        overflow: 'hidden',
        position: 'relative',
        background: '#0d0d0c',
      }}>
        {resource.cover_image_url ? (
          <img
            src={resource.cover_image_url}
            alt={resource.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="card-image"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Folder size={40} style={{ color: 'var(--color-bronze)' }} />
          </div>
        )}
        {/* Category badge floating */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(13, 13, 12, 0.85)',
          border: '1px solid rgba(255, 111, 0, 0.4)',
          padding: '4px 10px',
          borderRadius: '100px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--color-gold)',
          backdropFilter: 'blur(4px)',
        }}>
          {categoryName}
        </span>
      </div>

      {/* Text Area */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--color-grey-light)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} />
            {resource.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Download size={12} />
            {resource.downloads_count} downloads
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', lineHeight: '1.3', fontFamily: 'var(--font-display)' }}>
          {resource.title}
        </h3>

        <p style={{
          color: 'var(--color-grey-light)',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          flexGrow: 1,
        }}>
          {resource.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
          {resource.tags.slice(0, 3).map((tag) => (
            <span key={tag} style={{ fontSize: '0.75rem', color: 'var(--color-bronze)', fontWeight: 500 }}>
              #{tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-grey-light)' }}>
              +{resource.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Action Buttons (Icons inside card) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '12px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          flexWrap: 'wrap'
        }}>
          {resource.pdf_url && (
            <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
              <FileText size={14} className="text-gradient-sunrise" /> PDF
            </button>
          )}
          {resource.github_url && (
            <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
              <Code size={14} /> GitHub
            </button>
          )}
          {resource.demo_url && (
            <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
              <ExternalLink size={14} /> Demo
            </button>
          )}
          {resource.instagram_url && (
            <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
              <Camera size={14} /> Post
            </button>
          )}
          {resource.zip_url && (
            <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
              <Archive size={14} /> Download
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResourceCard;
