-- ============================================================================
-- AROYA aW Tracker — Supabase schema
-- Paste this into: Supabase → SQL Editor → New query → Run
-- ============================================================================

-- READINGS: water activity measurements taken at the event
create table if not exists readings (
  id uuid primary key default gen_random_uuid(),
  contestant text not null,
  strain text not null,
  bracket text not null check (bracket in ('High Rollers', 'Open Strain', 'Other')),
  aw numeric(4,3) not null check (aw >= 0 and aw <= 1),
  temp_f numeric(4,1),
  cultivator text,
  cure_days integer,
  notes text,
  photo_url text,
  created_at timestamptz default now()
);

create index if not exists readings_created_at_idx on readings (created_at desc);
create index if not exists readings_bracket_idx on readings (bracket);

-- LEADS: cultivators requesting aW testing on their own flower
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  sample_count integer,
  preferred_contact text check (preferred_contact in ('email', 'phone', 'text')),
  notes text,
  created_at timestamptz default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);

-- STORAGE: bucket for optional sample photos uploaded from /admin
insert into storage.buckets (id, name, public)
values ('sample-photos', 'sample-photos', true)
on conflict (id) do nothing;

-- ROW LEVEL SECURITY
-- Readings: public can read (the whole point). Writes happen via service-role key from server actions only.
alter table readings enable row level security;
drop policy if exists "readings public read" on readings;
create policy "readings public read" on readings
  for select using (true);

-- Leads: public can insert (the request form). No public reads — you'll check Supabase directly.
alter table leads enable row level security;
drop policy if exists "leads public insert" on leads;
create policy "leads public insert" on leads
  for insert with check (true);

-- Storage policies for sample-photos bucket
drop policy if exists "sample photos public read" on storage.objects;
create policy "sample photos public read" on storage.objects
  for select using (bucket_id = 'sample-photos');

-- Note: writes to storage also happen via service-role key from the server.

-- ============================================================================
-- REALTIME: enable postgres_changes broadcast on readings so the public
-- booth display gets instant updates (no 30s poll wait).
-- Wrapped in a DO block so re-running this file doesn't error if the table
-- is already in the publication.
-- ============================================================================
do $$
begin
  alter publication supabase_realtime add table readings;
exception
  when duplicate_object then null; -- already in publication, no-op
end $$;
