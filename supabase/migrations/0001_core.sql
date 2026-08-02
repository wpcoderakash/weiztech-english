-- C0 core schema. RLS: deny-by-default everywhere; all app access goes
-- through the server with the service role + code-level role checks.

create extension if not exists pgcrypto;

-- ---------- access & audit ----------
create type app_role as enum ('super_admin','admin','editor','content_manager','author','viewer');

create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  role app_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  entity text not null,
  entity_id text,
  diff jsonb,
  created_at timestamptz not null default now()
);
create index on activity_log (created_at desc);

-- ---------- content core ----------
create type publish_status as enum ('draft','published','scheduled');

create table pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  seo jsonb not null default '{}',
  status publish_status not null default 'published',
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages(id) on delete cascade,
  type text not null,
  sort int not null default 0,
  enabled boolean not null default true,
  data jsonb not null default '{}',
  draft_data jsonb,
  schedule_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on sections (page_id, sort);

create table section_revisions (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references sections(id) on delete cascade,
  data jsonb not null,
  editor_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index on section_revisions (section_id, created_at desc);

create table navigation_menus (
  key text primary key,
  items jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

create table settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- ---------- collections ----------
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

create table authors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  avatar_url text
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category_id uuid references categories(id),
  author_id uuid references authors(id),
  cover_path text,
  excerpt text not null default '',
  body jsonb not null default '[]',
  seo jsonb not null default '{}',
  status publish_status not null default 'draft',
  published_at timestamptz,
  scheduled_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on posts (status, published_at desc);

create table tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);
create table post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table faqs (
  id uuid primary key default gen_random_uuid(),
  group_key text not null,
  question text not null,
  answer text not null,
  sort int not null default 0,
  enabled boolean not null default true,
  deleted_at timestamptz
);
create index on faqs (group_key, sort);

create table pricing_plans (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  tab text not null,
  name text not null,
  price text not null,
  period text not null default '',
  features jsonb not null default '[]',
  cta jsonb not null default '{}',
  featured boolean not null default false,
  sort int not null default 0,
  deleted_at timestamptz
);
create index on pricing_plans (page_key, tab, sort);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default '',
  location text not null default '',
  description text not null default '',
  open boolean not null default true,
  sort int not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create table locations (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  label text not null default '',
  address text not null default '',
  map_url text,
  sort int not null default 0
);

create table showcase_items (
  id uuid primary key default gen_random_uuid(),
  page_key text not null default 'webapps',
  title text not null,
  body text not null default '',
  image_path text,
  demo_url text,
  sort int not null default 0,
  deleted_at timestamptz
);

create table media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  storage_path text not null unique,
  kind text not null default 'image',
  width int,
  height int,
  bytes int,
  alt text not null default '',
  caption text not null default '',
  folder text not null default '',
  created_at timestamptz not null default now()
);

create table redirects (
  id uuid primary key default gen_random_uuid(),
  from_path text not null unique,
  to_path text not null,
  code int not null default 301,
  enabled boolean not null default true
);

-- ---------- forms ----------
create table form_submissions (
  id uuid primary key default gen_random_uuid(),
  form text not null,
  payload jsonb not null,
  page_source text,
  ip_hash text,
  turnstile_ok boolean not null default false,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
create index on form_submissions (form, status, created_at desc);
create index on form_submissions (created_at desc);

create table applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id),
  submission_id uuid references form_submissions(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null default '',
  cv_storage_path text,
  created_at timestamptz not null default now()
);

-- ---------- RLS: deny by default ----------
do $$ declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public'
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;
