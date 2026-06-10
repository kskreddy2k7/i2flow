import React, { useState, useMemo } from 'react';
import type { Resource, Category } from '../lib/db';
import { Search, Folder } from 'lucide-react';
import ResourceCard from './ResourceCard';

interface ResourceLibraryProps {
  resources: Resource[];
  categories: Category[];
  onSelectResource: (resource: Resource) => void;
}

export const ResourceLibrary: React.FC<ResourceLibraryProps> = ({
  resources,
  categories,
  onSelectResource,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all'); // pdf, github, demo, zip

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    resources.forEach((r) => r.tags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [resources]);

  // Filter resources in real-time
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // Search query filter
      const matchesSearch =
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || res.category_id === selectedCategory;

      // Tag filter
      const matchesTag = selectedTag === 'all' || res.tags.includes(selectedTag);

      // Resource type filter
      let matchesType = true;
      if (filterType === 'pdf') matchesType = !!res.pdf_url;
      if (filterType === 'github') matchesType = !!res.github_url;
      if (filterType === 'demo') matchesType = !!res.demo_url;
      if (filterType === 'zip') matchesType = !!res.zip_url;

      return matchesSearch && matchesCategory && matchesTag && matchesType;
    });
  }, [resources, searchQuery, selectedCategory, selectedTag, filterType]);

  const getCategoryName = (catId: string) => {
    return categories.find((c) => c.id === catId)?.name || 'General';
  };

  return (
    <section 
      id="resources" 
      style={{
        padding: '100px 8% 80px 8%',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }} className="text-gradient-sunrise">
          Resource Library
        </h2>
        <p style={{ color: 'var(--color-grey-light)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Browse and download our curations of high-quality PDFs, project source codes, templates, and interactive demos.
        </p>
      </div>

      {/* Filtering Dashboard Dashboard */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {/* Row 1: Search and Type Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
        }} className="filter-row-1">
          {/* Search box */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-grey-light)',
            }} />
            <input
              type="text"
              placeholder="Search resources by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                background: 'rgba(5, 5, 5, 0.4)',
                border: '1px solid rgba(205, 127, 50, 0.2)',
                borderRadius: '8px',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              className="search-input"
            />
            <style>{`
              .search-input:focus {
                border-color: var(--color-gold) !important;
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.1);
              }
            `}</style>
          </div>

          {/* Type dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '14px 16px',
              background: 'rgba(5, 5, 5, 0.4)',
              border: '1px solid rgba(205, 127, 50, 0.2)',
              borderRadius: '8px',
              color: 'var(--color-white)',
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Resource Types</option>
            <option value="pdf">PDF Publications</option>
            <option value="github">GitHub Repositories</option>
            <option value="demo">Live Demos</option>
            <option value="zip">ZIP Files</option>
          </select>
        </div>

        {/* Row 2: Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-grey-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Categories
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: selectedCategory === 'all' ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.05)',
                background: selectedCategory === 'all' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                color: selectedCategory === 'all' ? 'var(--color-gold)' : 'var(--color-white)',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
              }}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: selectedCategory === cat.id ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.05)',
                  background: selectedCategory === cat.id ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  color: selectedCategory === cat.id ? 'var(--color-gold)' : 'var(--color-white)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-grey-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tags
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedTag('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '100px',
                border: 'none',
                background: selectedTag === 'all' ? 'var(--color-bronze)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedTag === 'all' ? 'var(--color-black)' : 'var(--color-grey-light)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '100px',
                  border: 'none',
                  background: selectedTag === tag ? 'var(--color-bronze)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedTag === tag ? 'var(--color-black)' : 'var(--color-grey-light)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid List */}
      {filteredResources.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', border: '1px dashed rgba(205, 127, 50, 0.2)', borderRadius: '12px', background: 'rgba(5, 5, 5, 0.3)' }}>
          <Folder size={48} style={{ color: 'var(--color-grey-light)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No resources match your filters</h3>
          <p style={{ color: 'var(--color-grey-light)', fontSize: '0.95rem' }}>Try clearing your search query or selecting a different category.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px',
        }} className="resource-grid">
          {filteredResources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              categoryName={getCategoryName(res.category_id)}
              onClick={() => onSelectResource(res)}
            />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .filter-row-1 {
            gridTemplateColumns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ResourceLibrary;
