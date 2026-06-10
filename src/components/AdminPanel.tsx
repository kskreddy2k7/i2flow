import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { addResource, editResource, deleteResource, addCategory, deleteCategory, getSocialLinks, editSocialLink, uploadFile } from '../lib/db';
import type { Resource, Category, SocialLink } from '../lib/db';
import { ShieldAlert, LogOut, Plus, Trash2, Edit2, FileText, Image as ImageIcon, Archive, FolderPlus, ArrowLeft, Link as LinkIcon } from 'lucide-react';

interface AdminPanelProps {
  onBackToSite: () => void;
  categories: Category[];
  resources: Resource[];
  onDataChange: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToSite,
  categories,
  resources,
  onDataChange,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'resources' | 'social'>('resources');

  // Resource Form State
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tagsStr, setTagsStr] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [zipUrl, setZipUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Category Form State
  const [newCatName, setNewCatName] = useState('');

  // Social Links State
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);

  // Authorized Founder Email
  const FOUNDER_EMAIL = 'official.i2flow.ai@gmail.com';

  useEffect(() => {
    if (session) {
      loadSocialLinks();
    }
  }, [session]);

  const loadSocialLinks = async () => {
    const data = await getSocialLinks();
    setSocialLinks(data);
  };

  // Check Session on Mount
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user.email === FOUNDER_EMAIL) {
          setSession(session);
        } else if (session) {
          supabase.auth.signOut();
          setAuthError('ACCESS DENIED: Unauthorized email account.');
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session && session.user.email === FOUNDER_EMAIL) {
          setSession(session);
        } else if (session) {
          supabase.auth.signOut();
          setSession(null);
          setAuthError('ACCESS DENIED: Unauthorized email account.');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    if (email.toLowerCase() !== FOUNDER_EMAIL) {
      setAuthError('ACCESS DENIED: Only the designated founder can log in.');
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
      } else if (data.user && data.user.email !== FOUNDER_EMAIL) {
        await supabase.auth.signOut();
        setAuthError('ACCESS DENIED: Only the founder account is permitted.');
      } else {
        setSession(data.session);
      }
    } else {
      setAuthError('Supabase is not configured. Please set environment variables.');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
  };

  // Resource Form Submit
  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !categoryId) {
      alert('Please fill out Title, Description, and Category');
      return;
    }

    const resourceData = {
      title,
      description,
      category_id: categoryId,
      date,
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
      pdf_url: pdfUrl || undefined,
      github_url: githubUrl || undefined,
      demo_url: demoUrl || undefined,
      instagram_url: instagramUrl || undefined,
      cover_image_url: coverImageUrl || undefined,
      zip_url: zipUrl || undefined,
      is_featured: isFeatured,
      is_published: isPublished,
    };

    try {
      if (isEditing) {
        await editResource(isEditing, resourceData);
        setIsEditing(null);
      } else {
        await addResource(resourceData);
      }
      onDataChange();
      resetResourceForm();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const resetResourceForm = () => {
    setIsEditing(null);
    setTitle('');
    setDescription('');
    setCategoryId(categories[0]?.id || '');
    setDate(new Date().toISOString().split('T')[0]);
    setTagsStr('');
    setPdfUrl('');
    setGithubUrl('');
    setDemoUrl('');
    setInstagramUrl('');
    setCoverImageUrl('');
    setZipUrl('');
    setIsFeatured(false);
    setIsPublished(true);
  };

  const handleEditResourceClick = (res: Resource) => {
    setIsEditing(res.id);
    setTitle(res.title);
    setDescription(res.description);
    setCategoryId(res.category_id);
    setDate(res.date);
    setTagsStr(res.tags.join(', '));
    setPdfUrl(res.pdf_url || '');
    setGithubUrl(res.github_url || '');
    setDemoUrl(res.demo_url || '');
    setInstagramUrl(res.instagram_url || '');
    setCoverImageUrl(res.cover_image_url || '');
    setZipUrl(res.zip_url || '');
    setIsFeatured(!!res.is_featured);
    setIsPublished(res.is_published !== false);
  };

  const handleDeleteResourceClick = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      await deleteResource(id);
      onDataChange();
    }
  };

  // Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addCategory(newCatName);
    setNewCatName('');
    onDataChange();
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Delete category? Resources under this category will display General.')) {
      await deleteCategory(id);
      onDataChange();
    }
  };

  // Handle File Uploads (To Supabase Storage)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>, folder: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const publicUrl = await uploadFile(file, folder);
        setter(publicUrl);
        alert(`Successfully uploaded: ${file.name}`);
      } catch (err: any) {
        alert('Failed to upload file: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Social Link Submit
  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSocial) {
      await editSocialLink(editingSocial.id, editingSocial);
      setEditingSocial(null);
      loadSocialLinks();
    }
  };

  // Set default category
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  if (!session) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        zIndex: 10,
      }}>
        <div className="glass-panel" style={{
          width: '100%',
          maxWidth: '440px',
          borderRadius: '16px',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
              Founder Login
            </h2>
            <p style={{ color: 'var(--color-grey-light)', fontSize: '0.9rem' }}>
              Access restricted to designated I2Flow administrators only.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-grey-light)' }}>
                Founder Email
              </label>
              <input
                type="email"
                placeholder="official.i2flow.ai@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: '12px',
                  background: 'rgba(5, 5, 5, 0.6)',
                  border: '1px solid rgba(205, 127, 50, 0.2)',
                  borderRadius: '6px',
                  color: 'var(--color-white)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-grey-light)' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  padding: '12px',
                  background: 'rgba(5, 5, 5, 0.6)',
                  border: '1px solid rgba(205, 127, 50, 0.2)',
                  borderRadius: '6px',
                  color: 'var(--color-white)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>

            {authError && (
              <div style={{
                background: 'rgba(211, 84, 0, 0.15)',
                border: '1px solid var(--color-copper)',
                color: 'var(--color-gold)',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <ShieldAlert size={16} />
                <span>{authError}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', marginTop: '8px' }}>
              {loading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>

          <button onClick={onBackToSite} className="btn-secondary" style={{ justifyContent: 'center', gap: '8px' }}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '100px 8% 60px 8%', position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)' }}>Founder Control Panel</h1>
          <p style={{ color: 'var(--color-grey-light)', fontSize: '0.9rem' }}>
            Logged in as <span style={{ color: 'var(--color-gold)' }}>{session.user.email}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setActiveTab('resources')} className={`btn-${activeTab === 'resources' ? 'primary' : 'secondary'}`}>Resources</button>
          <button onClick={() => setActiveTab('social')} className={`btn-${activeTab === 'social' ? 'primary' : 'secondary'}`}>Social Links</button>
          <button onClick={onBackToSite} className="btn-secondary"><ArrowLeft size={16} /> Site</button>
          <button onClick={handleLogout} className="btn-secondary" style={{ borderColor: 'var(--color-copper)' }}><LogOut size={16} /> Sign Out</button>
        </div>
      </div>

      {activeTab === 'resources' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }} className="admin-grid">
          {/* Resource Editor */}
          <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', alignSelf: 'start' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '24px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20} className="text-gradient-sunrise" />
              {isEditing ? 'Edit Hub Resource' : 'Create Hub Resource'}
            </h2>

            <form onSubmit={handleResourceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-grey-light)' }}>Title *</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-grey-light)' }}>Category *</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-grey-light)' }}>Description *</label>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-grey-light)' }}>Release Date *</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-grey-light)' }}>Tags (comma-separated)</label>
                  <input type="text" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-grey-light)' }}>GitHub URL</label>
                  <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-grey-light)' }}>Live Demo URL</label>
                  <input type="url" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-grey-light)' }}>Instagram Reel/Post Link</label>
                <input type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff' }} />
              </div>

              {/* Asset Uploads */}
              <div style={{ background: 'rgba(5, 5, 5, 0.4)', border: '1px dashed rgba(205, 127, 50, 0.2)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gold)' }}>Assets Upload</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label className="btn-secondary" style={{ cursor: 'pointer', padding: '8px 12px', fontSize: '0.8rem' }}>
                      <ImageIcon size={14} /> Upload Cover Image
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, setCoverImageUrl, 'images')} />
                    </label>
                    {coverImageUrl && <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)' }}>✓ Image selected</span>}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label className="btn-secondary" style={{ cursor: 'pointer', padding: '8px 12px', fontSize: '0.8rem' }}>
                      <FileText size={14} /> Upload PDF
                      <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, setPdfUrl, 'pdfs')} />
                    </label>
                    {pdfUrl && <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)' }}>✓ PDF selected</span>}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label className="btn-secondary" style={{ cursor: 'pointer', padding: '8px 12px', fontSize: '0.8rem' }}>
                      <Archive size={14} /> Upload ZIP
                      <input type="file" accept=".zip,.rar,.tar,.gz" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, setZipUrl, 'zips')} />
                    </label>
                    {zipUrl && <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)' }}>✓ ZIP selected</span>}
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id="isPublished" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--color-orange)' }} />
                  <label htmlFor="isPublished" style={{ fontSize: '0.9rem', color: 'var(--color-white)', cursor: 'pointer' }}>Publish to Platform</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--color-orange)' }} />
                  <label htmlFor="isFeatured" style={{ fontSize: '0.9rem', color: 'var(--color-white)', cursor: 'pointer' }}>Feature (Highlight at top)</label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {isEditing ? 'Apply Update' : 'Launch Resource'}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetResourceForm} className="btn-secondary" style={{ borderColor: 'var(--color-copper)' }}>Cancel</button>
                )}
              </div>
            </form>
          </div>

          {/* Right Side: List & Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderPlus size={18} className="text-gradient-sunrise" /> Manage Categories
              </h2>
              <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input type="text" placeholder="New Category Name..." value={newCatName} onChange={(e) => setNewCatName(e.target.value)} required style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', fontSize: '0.9rem' }} />
                <button type="submit" className="btn-primary" style={{ padding: '10px 16px' }}>Add</button>
              </form>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {categories.map(cat => (
                  <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.9rem' }}>{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat.id)} style={{ background: 'none', border: 'none', color: 'var(--color-copper)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
                Active Resources ({resources.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto' }}>
                {resources.map(res => (
                  <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-white)' }}>{res.title} {res.is_published ? '' : <span style={{ color: 'var(--color-orange)', fontSize: '0.75rem' }}>(Draft)</span>}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-grey-light)' }}>{res.date} • {res.downloads_count} dls</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditResourceClick(res)} style={{ background: 'none', border: 'none', color: 'var(--color-gold)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteResourceClick(res.id)} style={{ background: 'none', border: 'none', color: 'var(--color-copper)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Social Links Manager */
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '24px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LinkIcon size={20} className="text-gradient-sunrise" />
            Social Links Configuration
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {socialLinks.map(link => (
              <div key={link.id} style={{ background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {editingSocial?.id === link.id ? (
                  <form onSubmit={handleSocialSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--color-grey-light)' }}>Name</label>
                        <input type="text" value={editingSocial.name} onChange={(e) => setEditingSocial({...editingSocial, name: e.target.value})} required style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff' }} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--color-grey-light)' }}>URL</label>
                        <input type="url" value={editingSocial.url} onChange={(e) => setEditingSocial({...editingSocial, url: e.target.value})} required style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-grey-light)' }}>Description</label>
                      <input type="text" value={editingSocial.description} onChange={(e) => setEditingSocial({...editingSocial, description: e.target.value})} required style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Save Changes</button>
                      <button type="button" className="btn-secondary" onClick={() => setEditingSocial(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--color-gold)', marginBottom: '4px' }}>{link.name}</h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-grey-light)', marginBottom: '4px' }}>{link.description}</p>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--color-white)' }}>{link.url}</a>
                    </div>
                    <button onClick={() => setEditingSocial(link)} className="btn-secondary">Edit</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .admin-grid {
            gridTemplateColumns: 1fr !important;
          }
        }
        @media (max-width: 576px) {
          .form-row-2 {
            gridTemplateColumns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
