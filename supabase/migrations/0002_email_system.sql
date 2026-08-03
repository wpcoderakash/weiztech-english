-- Microsoft Graph email management system.

-- Singleton row holding the Graph app registration.
create table if not exists email_settings (
  id boolean primary key default true check (id),
  sender_email text not null default '',
  tenant_id text not null default '',
  client_id text not null default '',
  client_secret_enc text,                 -- AES-256-GCM, never leaves the server
  enabled boolean not null default false,
  last_test_at timestamptz,
  last_test_ok boolean,
  last_test_error text,
  updated_at timestamptz not null default now()
);
insert into email_settings (id) values (true) on conflict (id) do nothing;

-- Notification recipients (unlimited, orderable, individually toggleable).
create table if not exists email_recipients (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null default '',
  enabled boolean not null default true,
  is_primary boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
insert into email_recipients (email, name, is_primary, sort) values
  ('dev@weiz.co.il', 'Dev', true, 0),
  ('matan@weiz.co.il', 'Matan', false, 1)
on conflict (email) do nothing;

-- Reusable HTML templates (notification + auto-reply).
create table if not exists email_templates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  subject text not null default '',
  html text not null default '',
  logo_url text not null default '',
  footer_text text not null default '',
  updated_at timestamptz not null default now()
);

-- Per-form configuration. Any future form gets a row and works immediately.
create table if not exists form_email_settings (
  form_key text primary key,
  label text not null,
  notify_enabled boolean not null default true,
  recipient_ids jsonb not null default '[]',   -- empty = every enabled recipient
  subject text not null default '',
  reply_to text not null default '',
  cc text not null default '',
  bcc text not null default '',
  template_id uuid references email_templates(id) on delete set null,
  auto_reply_enabled boolean not null default false,
  auto_reply_subject text not null default '',
  auto_reply_html text not null default '',
  updated_at timestamptz not null default now()
);

insert into form_email_settings (form_key, label, subject) values
  ('contact', 'Contact Form', 'New contact form submission'),
  ('quote',   'Quote Request', 'New quote request'),
  ('careers', 'Career Application', 'New career application'),
  ('support', 'Support Form', 'New support request')
on conflict (form_key) do nothing;

-- Delivery log with retry payload.
create table if not exists email_logs (
  id uuid primary key default gen_random_uuid(),
  form_key text not null default '',
  recipient text not null default '',
  subject text not null default '',
  status text not null default 'sent',      -- sent | failed
  error text,
  kind text not null default 'notification', -- notification | auto_reply | test
  payload jsonb,                             -- enough to retry
  created_at timestamptz not null default now()
);
create index if not exists email_logs_created_idx on email_logs (created_at desc);
create index if not exists email_logs_status_idx on email_logs (status, created_at desc);

alter table email_settings enable row level security;
alter table email_recipients enable row level security;
alter table email_templates enable row level security;
alter table form_email_settings enable row level security;
alter table email_logs enable row level security;
