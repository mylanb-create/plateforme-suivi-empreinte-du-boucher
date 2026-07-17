-- L'Empreinte du Boucher — schéma Supabase
-- À exécuter une fois dans Supabase : Dashboard > SQL Editor > New query > Run

create table if not exists public.videos (
  id integer primary key,
  status text not null default 'a_monter' check (status in ('a_monter', 'monte', 'planifie', 'poste')),
  date date not null,
  updated_at timestamptz not null default now()
);

insert into public.videos (id, status, date) values
  (1,  'a_monter', '2026-07-20'),
  (2,  'a_monter', '2026-07-22'),
  (3,  'a_monter', '2026-07-24'),
  (4,  'a_monter', '2026-07-27'),
  (5,  'a_monter', '2026-07-29'),
  (6,  'a_monter', '2026-07-31'),
  (7,  'a_monter', '2026-08-03'),
  (8,  'a_monter', '2026-08-05'),
  (9,  'a_monter', '2026-08-07'),
  (10, 'a_monter', '2026-08-10'),
  (11, 'a_monter', '2026-08-12'),
  (12, 'a_monter', '2026-08-14')
on conflict (id) do nothing;

-- Sécurité : la plateforme est privée. Seules les sessions connectées (le
-- compte partagé des 2 frères en lecture seule + ton compte admin) peuvent
-- lire les données. Sans session valide, l'API Supabase ne renvoie rien,
-- même avec la clé publique — c'est ça qui rend le lien vraiment privé.
alter table public.videos enable row level security;

drop policy if exists "Public read" on public.videos;
drop policy if exists "Authenticated read" on public.videos;
drop policy if exists "Authenticated update" on public.videos;

create policy "Authenticated read" on public.videos
  for select using (auth.role() = 'authenticated');

create policy "Authenticated update" on public.videos
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Temps réel : indispensable pour que les changements de statut
-- apparaissent instantanément chez les frères sans recharger la page.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'videos'
  ) then
    alter publication supabase_realtime add table public.videos;
  end if;
end $$;
