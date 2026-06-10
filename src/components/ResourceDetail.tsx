import React, { useState } from 'react';
import { incrementDownload } from '../lib/db';
import type { Resource, Category } from '../lib/db';
import { X, Calendar, Download, Folder, ExternalLink, FileText, Package, Copy, Check, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResourceDetailProps {
  resource: Resource | null;
  categories: Category[];
  onClose: () => void;
  onDownloadIncrement: () => void;
}

export const ResourceDetail: React.FC<ResourceDetailProps> = ({
  resource,
  categories,
  onClose,
  onDownloadIncrement,
}) => {
  const [copied, setCopied] = useState(false);
  const [allResources, setAllResources] = useState<Resource[]>([]);

  React.useEffect(() => {
    import('../lib/db').then(module => {
      module.getResources().then(setAllResources);
    });
  }, []);

  if (!resource) return null;

  const categoryName = categories.find((c) => c.id === resource.category_id)?.name || 'General';

  const handleCopyCommand = () => {
    const gitUrl = resource.github_url || 'https://github.com/i2flow/project';
    navigator.clipboard.writeText(`git clone ${gitUrl}.git`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    // Increment download count locally/supabase
    await incrementDownload(resource.id);
    onDownloadIncrement();

    // Trigger celebratory confetti effect
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FFD700', '#FF6F00', '#D35400'],
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end', // Slide over style from right
      background: 'rgba(5, 5, 5, 0.85)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    }}>
      {/* Background click to close */}
      <div 
        onClick={onClose} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          cursor: 'pointer',
        }} 
      />

      {/* Main Sliding Sheet */}
      <div className="glass-panel detail-sheet" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '960px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
        borderLeft: '1px solid var(--glass-border)',
        borderTop: 'none',
        borderBottom: 'none',
        borderRight: 'none',
        overflow: 'hidden',
        animation: 'slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}>
        
        {/* Header toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(13, 13, 12, 0.9)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              background: 'rgba(255, 111, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.25)',
              borderRadius: '4px',
              padding: '2px 8px',
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-display)',
            }}>
              RESOURCE SPECIFICATION
            </span>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--color-white)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            className="close-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrolling content columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.8fr 1.2fr',
          height: '100%',
          overflow: 'hidden',
        }} className="columns-container">
          
          {/* Main Column (Left) */}
          <div style={{
            padding: '32px 24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          }}>
            {/* Title */}
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)', lineHeight: '1.2' }}>
              {resource.title}
            </h2>

            {/* Cover Image */}
            {resource.cover_image_url && (
              <div style={{
                borderRadius: '12px',
                overflow: 'hidden',
                width: '100%',
                maxHeight: '340px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <img 
                  src={resource.cover_image_url} 
                  alt={resource.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Overview / Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-gold)' }}>Overview</h3>
              <p style={{
                color: 'var(--color-grey-light)',
                fontSize: '1rem',
                lineHeight: '1.7',
              }}>
                {resource.description}
              </p>
            </div>

            {/* Installation / Integration Guide (Notion style) */}
            <div style={{
              background: 'rgba(5, 5, 5, 0.5)',
              border: '1px solid rgba(205, 127, 50, 0.15)',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={16} className="text-gradient-sunrise" />
                Integration Instructions
              </h3>
              
              <p style={{ color: 'var(--color-grey-light)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Clone this repository or add the component framework directly to your React app configuration.
              </p>
              
              {/* Terminal Code Block */}
              <div style={{
                background: '#050505',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: 'var(--color-gold)',
                marginTop: '6px',
              }}>
                <span>$ git clone {resource.github_url || 'https://github.com/i2flow/project'}.git</span>
                <button 
                  onClick={handleCopyCommand}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: copied ? 'var(--color-gold)' : 'var(--color-grey-light)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Related Resources */}
            {allResources.length > 1 && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '16px' }}>Related Resources</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {allResources
                    .filter(r => r.category_id === resource.category_id && r.id !== resource.id && r.is_published)
                    .slice(0, 2)
                    .map(related => (
                      <div 
                        key={related.id}
                        className="glass-panel"
                        style={{ padding: '16px', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => {
                           // For a seamless modal experience, we could update the selected resource, but since this is just a modal wrapper in App.tsx, the prop is fixed. 
                           // For now we'll just display them, clicking could be handled if we pass a changeResource prop.
                           alert('Open resource: ' + related.title);
                        }}
                      >
                        <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>{related.title}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-grey-light)' }}>{related.date}</span>
                      </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column (Right) */}
          <div style={{
            padding: '32px 24px',
            overflowY: 'auto',
            background: 'rgba(13, 13, 12, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
          }}>
            {/* Download/Action Hub */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-grey-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Actions &amp; Downloads
              </span>

              {/* Action Buttons */}
              {resource.pdf_url && (
                <a 
                  href={resource.pdf_url} 
                  download 
                  onClick={() => handleDownload()}
                  className="btn-primary" 
                  style={{
                    justifyContent: 'center',
                    padding: '14px',
                  }}
                >
                  <FileText size={18} />
                  Download PDF Whitepaper
                </a>
              )}

              {resource.zip_url && (
                <a 
                  href={resource.zip_url} 
                  download 
                  onClick={() => handleDownload()}
                  className="btn-primary" 
                  style={{
                    justifyContent: 'center',
                    padding: '14px',
                    background: 'linear-gradient(135deg, var(--color-bronze) 0%, var(--color-copper) 100%)',
                    boxShadow: '0 4px 16px rgba(211, 84, 0, 0.2)',
                  }}
                >
                  <Package size={18} />
                  Download ZIP Package
                </a>
              )}

              {resource.github_url && (
                <a 
                  href={resource.github_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-secondary" 
                  style={{ justifyContent: 'center', padding: '14px', gap: '8px' }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                  View GitHub Repository
                </a>
              )}

              {resource.demo_url && (
                <a 
                  href={resource.demo_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-secondary" 
                  style={{ justifyContent: 'center', padding: '14px', borderColor: 'var(--color-orange)' }}
                >
                  <ExternalLink size={18} className="text-gradient-sunrise" />
                  Launch Live Demo
                </a>
              )}

              {resource.instagram_url && (
                <a 
                  href={resource.instagram_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-secondary" 
                  style={{ justifyContent: 'center', padding: '14px', gap: '8px' }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                  Watch Instagram Demo
                </a>
              )}
            </div>

            {/* Spec Sheet Table (Linear/Apple style) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-grey-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Resource Metadata
              </span>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '16px',
                background: 'rgba(5, 5, 5, 0.4)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-grey-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Folder size={14} /> Category
                  </span>
                  <span style={{ fontWeight: 500 }}>{categoryName}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-grey-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> Released
                  </span>
                  <span style={{ fontWeight: 500 }}>{resource.date}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-grey-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Download size={14} /> Downloads
                  </span>
                  <span style={{ fontWeight: 500, color: 'var(--color-gold)' }}>{resource.downloads_count}</span>
                </div>
              </div>
            </div>

            {/* Tags Cloud */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-grey-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Associated Tags
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(205, 127, 50, 0.2)',
                      borderRadius: '100px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      color: 'var(--color-grey-light)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .close-btn:hover {
          background: rgba(255, 111, 0, 0.15) !important;
          border-color: var(--color-orange) !important;
          color: var(--color-gold) !important;
        }
        @media (max-width: 768px) {
          .detail-sheet {
            max-width: 100% !important;
          }
          .columns-container {
            gridTemplateColumns: 1fr !important;
            overflow-y: auto !important;
          }
          .columns-container > div {
            overflow-y: visible !important;
            border-right: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResourceDetail;
