-- 0003 — deletion integrity, provisioning gaps and enum guards.
--
-- Three problems this fixes, all found in the August 2026 backend audit:
--
-- 1. Deleting a user was impossible. activity_log.actor_id and
--    section_revisions.editor_id referenced auth.users(id) with NO on-delete
--    clause, so auth.admin.deleteUser() failed with a foreign-key violation
--    for any user who had ever acted. The error was swallowed by the caller,
--    so the UI reported success while the account stayed live.
--    History must survive the actor: set null, do not cascade.
--
-- 2. The cv-uploads and exports buckets existed only in the live project,
--    never in migrations — a fresh environment silently lost every CV.
--
-- 3. Enum-like text columns had no CHECK, so a typo ("quotes") inserted fine
--    and became invisible to every filtered dashboard query.

/* ---- 1. Audit references survive user deletion ---- */

alter table public.activity_log
  drop constraint if exists activity_log_actor_id_fkey;
alter table public.activity_log
  add constraint activity_log_actor_id_fkey
  foreign key (actor_id) references auth.users(id) on delete set null;

alter table public.section_revisions
  drop constraint if exists section_revisions_editor_id_fkey;
alter table public.section_revisions
  add constraint section_revisions_editor_id_fkey
  foreign key (editor_id) references auth.users(id) on delete set null;

/* ---- 2. Storage buckets (idempotent) ---- */

insert into storage.buckets (id, name, public)
values ('cv-uploads', 'cv-uploads', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('exports', 'exports', false)
on conflict (id) do nothing;

/* ---- 3. Enum guards on free-text status columns ---- */

alter table public.form_submissions
  drop constraint if exists form_submissions_form_check;
alter table public.form_submissions
  add constraint form_submissions_form_check
  check (form in ('contact', 'quote', 'careers'));

alter table public.form_submissions
  drop constraint if exists form_submissions_status_check;
alter table public.form_submissions
  add constraint form_submissions_status_check
  check (status in ('new', 'read', 'replied', 'spam'));

alter table public.email_logs
  drop constraint if exists email_logs_status_check;
alter table public.email_logs
  add constraint email_logs_status_check
  check (status in ('sent', 'failed'));

alter table public.email_logs
  drop constraint if exists email_logs_kind_check;
alter table public.email_logs
  add constraint email_logs_kind_check
  check (kind in ('notification', 'auto_reply', 'test'));

/* ---- 4. Index the cascade path used when pruning old submissions ---- */

create index if not exists applications_submission_id_idx
  on public.applications (submission_id);
