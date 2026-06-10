import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SunriseBackground from './components/SunriseBackground';
import SocialLinks from './components/SocialLinks';
import ResourceLibrary from './components/ResourceLibrary';
import ResourceDetail from './components/ResourceDetail';
import Timeline from './components/Timeline';
import About from './components/About';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import ResourceCard from './components/ResourceCard';
import { getResources, getCategories } from './lib/db';
import type { Resource, Category } from './lib/db';
import { ArrowUp, Star } from 'lucide-react';

export const App: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Interface state
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [currentSection, setCurrentSection] = useState('home');
  const [isAdminView, setIsAdminView] = useState(false);

  // Load resources and categories
  const loadData = async () => {
    const res = await getResources();
    const cat = await getCategories();
    setResources(res);
    setCategories(cat);
  };

  useEffect(() => {
    loadData();
    if (window.location.pathname === '/admin') {
      setIsAdminView(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (scrollY < vh / 2) {
        setCurrentSection('home');
      } else {
        const resourcesEl = document.getElementById('resources');
        const projectsEl = document.getElementById('projects');
        const aboutEl = document.getElementById('about');

        if (aboutEl && scrollY >= aboutEl.offsetTop - 350) {
          setCurrentSection('about');
        } else if (projectsEl && scrollY >= projectsEl.offsetTop - 350) {
          setCurrentSection('projects');
        } else if (resourcesEl && scrollY >= resourcesEl.offsetTop - 350) {
          setCurrentSection('resources');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsAdminView(false);
    if (window.location.pathname === '/admin') {
      window.history.pushState({}, '', '/');
    }

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.getElementById(sectionId);
      if (target) {
        const offset = target.offsetTop - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }
  };

  const handleAdminToggle = () => {
    if (isAdminView) {
      window.history.pushState({}, '', '/');
      setIsAdminView(false);
    } else {
      window.history.pushState({}, '', '/admin');
      setIsAdminView(true);
      window.scrollTo({ top: 0 });
    }
  };

  const publishedResources = resources.filter(r => r.is_published !== false);
  const featuredResources = publishedResources.filter(r => r.is_featured);

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || 'General';
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <SunriseBackground />
      <Navbar onNavClick={handleNavClick} currentSection={currentSection} onAdminClick={handleAdminToggle} />

      {isAdminView ? (
        <AdminPanel onBackToSite={() => handleNavClick('home')} categories={categories} resources={resources} onDataChange={loadData} />
      ) : (
        <>
          <Hero onExploreClick={() => handleNavClick('resources')} onProjectsClick={() => handleNavClick('projects')} />

          <div style={{ background: 'rgba(5, 5, 5, 0.7)', position: 'relative', zIndex: 10 }}>
            {/* Social Links */}
            <SocialLinks />

            {/* Latest Resources / Resource Library */}
            <ResourceLibrary resources={publishedResources} categories={categories} onSelectResource={setSelectedResource} />

            {/* Featured Projects */}
            {featuredResources.length > 0 && (
              <section id="featured" style={{ padding: '80px 8%', position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Star size={32} className="text-gradient-sunrise" />
                  <div>
                    <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>Featured Projects</h2>
                    <p style={{ color: 'var(--color-grey-light)', fontSize: '1rem' }}>Top picks and major system releases.</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                  {featuredResources.map(res => (
                    <ResourceCard key={res.id} resource={res} categoryName={getCategoryName(res.category_id)} onClick={() => setSelectedResource(res)} />
                  ))}
                </div>
              </section>
            )}

            {/* Timeline */}
            <Timeline resources={publishedResources} categories={categories} onSelectResource={setSelectedResource} />

            {/* About */}
            <About />

            {/* Footer */}
            <Footer onNavClick={handleNavClick} onAdminToggle={handleAdminToggle} />
          </div>
        </>
      )}

      {/* Resource Detail Modal */}
      <ResourceDetail resource={selectedResource} categories={categories} onClose={() => setSelectedResource(null)} onDownloadIncrement={loadData} />

      {/* Back to top indicator */}
      {!isAdminView && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="btn-secondary"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 90,
            background: 'var(--glass-bg)',
            borderColor: 'var(--color-bronze)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <ArrowUp size={20} className="text-gradient-sunrise" />
        </button>
      )}
    </div>
  );
};

export default App;
