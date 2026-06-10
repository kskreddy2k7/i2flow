-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Tables
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.resources (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  category_id uuid references public.categories(id) on delete restrict not null,
  date date not null,
  tags text[] default '{}'::text[],
  pdf_url text,
  github_url text,
  demo_url text,
  instagram_url text,
  linkedin_url text,
  cover_image_url text,
  zip_url text,
  source_code_url text,
  is_featured boolean default false,
  is_published boolean default true,
  downloads_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.social_links (
  id uuid default uuid_generate_v4() primary key,
  platform text not null,
  name text not null,
  description text not null,
  url text not null,
  icon text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Setup Default Categories and Social Links
insert into public.categories (id, name, slug) values
  ('6c1341e3-2e0f-4ab6-8f2e-07a7eb6d9585', 'AI Projects', 'ai-projects'),
  ('1ab2d807-f6ec-4c6e-8260-58c0c98f98d7', 'Web Development', 'web-development'),
  ('34e8f170-0b44-463e-b816-6415694a5307', 'Git & GitHub', 'git-github'),
  ('12b9a7c3-dc07-42c2-aa6b-b26a6c429fb5', 'Career Resources', 'career-resources'),
  ('9fa3cc70-5a8d-4a1e-8d59-cf2c12574e92', 'Tutorials', 'tutorials'),
  ('f7c32b5f-51bc-4e3a-96ad-d01d167eb2e3', 'UI/UX', 'ui-ux');

insert into public.social_links (platform, name, description, url, icon) values
  ('github', 'GitHub', 'Open source AI projects & code', 'https://github.com', 'Github'),
  ('linkedin', 'LinkedIn', 'Professional updates & career', 'https://linkedin.com', 'Linkedin'),
  ('instagram', 'Instagram', 'Behind the scenes & updates', 'https://instagram.com', 'Instagram'),
  ('email', 'Email', 'Business inquiries & contact', 'mailto:official.i2flow.ai@gmail.com', 'Mail');

-- 3. Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.resources enable row level security;
alter table public.social_links enable row level security;

-- Policies for public reading
create policy "Categories are viewable by everyone" on public.categories for select using (true);
create policy "Resources are viewable by everyone" on public.resources for select using (true);
create policy "Social links are viewable by everyone" on public.social_links for select using (true);

-- Allow public to increment downloads via a secure function or allow update of downloads count only
-- However, for strict security, only founders can INSERT/UPDATE/DELETE
create policy "Founders can manage categories" on public.categories 
  for all using (auth.email() = 'official.i2flow.ai@gmail.com');
  
create policy "Founders can manage resources" on public.resources 
  for all using (auth.email() = 'official.i2flow.ai@gmail.com');

create policy "Founders can manage social links" on public.social_links 
  for all using (auth.email() = 'official.i2flow.ai@gmail.com');

-- 4. Storage Buckets
insert into storage.buckets (id, name, public) values ('resources', 'resources', true);

-- Storage RLS Policies
create policy "Public Access to resources" 
  on storage.objects for select 
  using ( bucket_id = 'resources' );

create policy "Founder Upload Access" 
  on storage.objects for insert 
  with check ( bucket_id = 'resources' and auth.email() = 'official.i2flow.ai@gmail.com' );

create policy "Founder Update Access" 
  on storage.objects for update 
  using ( bucket_id = 'resources' and auth.email() = 'official.i2flow.ai@gmail.com' );

create policy "Founder Delete Access" 
  on storage.objects for delete 
  using ( bucket_id = 'resources' and auth.email() = 'official.i2flow.ai@gmail.com' );
