import { supabase } from './supabase';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category_id: string;
  date: string;
  pdf_url?: string;
  github_url?: string;
  demo_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  cover_image_url?: string;
  zip_url?: string;
  source_code_url?: string;
  is_featured?: boolean;
  is_published?: boolean;
  tags: string[];
  downloads_count: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  name: string;
  description: string;
  url: string;
  icon: string;
}

// Category API
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data || [];
}

export async function addCategory(name: string): Promise<Category> {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const { data, error } = await supabase.from('categories').insert([{ name, slug }]).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// Resource API
export async function getResources(): Promise<Resource[]> {
  const { data, error } = await supabase.from('resources').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addResource(resource: Omit<Resource, 'id' | 'downloads_count'>): Promise<Resource> {
  const { data, error } = await supabase.from('resources').insert([resource]).select().single();
  if (error) throw error;
  return data;
}

export async function editResource(id: string, updates: Partial<Omit<Resource, 'id' | 'downloads_count'>>): Promise<Resource> {
  const { data, error } = await supabase.from('resources').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteResource(id: string): Promise<void> {
  const { error } = await supabase.from('resources').delete().eq('id', id);
  if (error) throw error;
}

export async function incrementDownload(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_downloads', { resource_id: id });
  if (error) throw error;
}

// Social Links API
export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase.from('social_links').select('*').order('name');
  if (error) throw error;
  return data || [];
}

export async function editSocialLink(id: string, updates: Partial<SocialLink>): Promise<SocialLink> {
  const { data, error } = await supabase.from('social_links').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// File Upload to Supabase Storage
export async function uploadFile(file: File, folder: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage.from('resources').upload(filePath, file);
  if (error) throw error;
  
  const { data } = supabase.storage.from('resources').getPublicUrl(filePath);
  return data.publicUrl;
}
