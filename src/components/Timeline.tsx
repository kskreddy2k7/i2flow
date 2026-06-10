import React from 'react';
import type { Resource, Category } from '../lib/db';
import { Calendar, Download, Folder } from 'lucide-react';

interface TimelineProps {
  resources: Resource[];
  categories: Category[];
  onSelectResource: (resource: Resource) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  resources,
  categories,
  onSelectResource,
}) => {
  // Sort resources chronologically (newest first or oldest first? "chronologically" usually means starting from past to present, or latest releases. Let's sort from newest to oldest for a release feed look!)
  const sortedResources = [...resources].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getCategoryName = (catId: string) => {
    return categories.find((c) => c.id === catId)?.name || 'General';
  };

  return (
    <section 
      id="projects" 
      style={{
        padding: '100px 8% 80px 8%',
        position: 'relative',
        zIndex: 2,
        background: 'rgba(5, 5, 5, 0.2)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }} className="text-gradient-sunrise">
          Project Launch Timeline
        </h2>
        <p style={{ color: 'var(--color-grey-light)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Follow our development journey and track releases of systems, templates, and tools.
        </p>
      </div>

      <div style={{
        position: 'relative',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px 0',
      }}>
        {/* The Vertical Timeline Track */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '0',
          bottom: '0',
          width: '2px',
          background: 'linear-gradient(to bottom, var(--color-gold) 0%, var(--color-orange) 50%, rgba(205, 127, 50, 0.1) 100%)',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }} className="timeline-line" />

        {/* Timeline Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          {sortedResources.map((res, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={res.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  position: 'relative',
                  flexDirection: isLeft ? 'row' : 'row-reverse',
                }}
                className="timeline-item"
              >
                {/* Timeline Card */}
                <div 
                  onClick={() => onSelectResource(res)}
                  className="glass-card timeline-card"
                  style={{
                    width: '45%',
                    borderRadius: '12px',
                    padding: '24px',
                    cursor: 'pointer',
                    position: 'relative',
                    textAlign: isLeft ? 'right' : 'left',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8rem',
                    color: 'var(--color-bronze)',
                    fontWeight: 600,
                    justifyContent: isLeft ? 'flex-end' : 'flex-start',
                    marginBottom: '8px',
                  }}>
                    <Folder size={12} />
                    {getCategoryName(res.category_id)}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                    {res.title}
                  </h3>

                  <p style={{
                    color: 'var(--color-grey-light)',
                    fontSize: '0.88rem',
                    lineHeight: '1.5',
                    marginBottom: '16px',
                  }}>
                    {res.description.substring(0, 100)}...
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '0.8rem',
                    color: 'var(--color-grey-light)',
                    justifyContent: isLeft ? 'flex-end' : 'flex-start',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '12px',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      {res.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Download size={12} />
                      {res.downloads_count} Downloads
                    </span>
                  </div>
                </div>

                {/* Center Node Bullet */}
                <div
                  className="timeline-node"
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'var(--color-black)',
                    border: '3px solid var(--color-orange)',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    boxShadow: '0 0 10px var(--color-orange)',
                    transition: 'all 0.3s ease',
                  }}
                />

                {/* Empty space matching the opposite side */}
                <div style={{ width: '45%' }} />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .timeline-item:hover .timeline-node {
          border-color: var(--color-gold) !important;
          box-shadow: 0 0 18px var(--color-gold) !important;
          transform: translateX(-50%) scale(1.3) !important;
        }
        .timeline-card:hover {
          border-color: rgba(255, 215, 0, 0.35) !important;
          box-shadow: 0 8px 30px rgba(255, 111, 0, 0.1) !important;
        }
        @media (max-width: 768px) {
          .timeline-line {
            left: 20px !important;
          }
          .timeline-item {
            flex-direction: row-reverse !important;
            align-items: flex-start !important;
            gap: 20px;
          }
          .timeline-card {
            width: calc(100% - 40px) !important;
            text-align: left !important;
          }
          .timeline-card div {
            justify-content: flex-start !important;
          }
          .timeline-node {
            left: 20px !important;
            transform: translateX(-50%) translateY(20px) !important;
          }
          .timeline-item:hover .timeline-node {
            transform: translateX(-50%) translateY(20px) scale(1.3) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Timeline;
