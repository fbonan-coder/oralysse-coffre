/*
  # Dossiers Oralysse

  1. Nouvelle table
    - `dossiers` : un dossier (coffre) par utilisateur.
      - `id` (uuid, clé primaire)
      - `owner_id` (uuid, unique) : l'utilisateur Supabase Auth propriétaire
      - `email` (text) : l'adresse de connexion, recopiée pour l'administration
      - `first_name` (text) : le prénom saisi dans l'app
      - `state` (jsonb) : tout le contenu du coffre (volontés, messages, personnes, L'essentiel…)
      - `created_at`, `updated_at` (timestamptz)

  2. Fichiers
    - Bucket privé `coffre` : enregistrements audio et vidéo, pièces jointes, documents.
      Chaque fichier est rangé sous `<owner_id>/<clé>`.

  3. Sécurité
    - RLS activée : chaque utilisateur ne lit, n'écrit et ne supprime que son propre dossier
      et ses propres fichiers. Aucun accès anonyme.
*/

create table if not exists public.dossiers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique default auth.uid() references auth.users (id) on delete cascade,
  email text,
  first_name text,
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.dossiers enable row level security;

drop policy if exists "Lire son dossier" on public.dossiers;
create policy "Lire son dossier" on public.dossiers
  for select to authenticated using (owner_id = auth.uid());

drop policy if exists "Créer son dossier" on public.dossiers;
create policy "Créer son dossier" on public.dossiers
  for insert to authenticated with check (owner_id = auth.uid());

drop policy if exists "Modifier son dossier" on public.dossiers;
create policy "Modifier son dossier" on public.dossiers
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "Supprimer son dossier" on public.dossiers;
create policy "Supprimer son dossier" on public.dossiers
  for delete to authenticated using (owner_id = auth.uid());

create or replace function public.dossiers_touch()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists dossiers_touch on public.dossiers;
create trigger dossiers_touch before update on public.dossiers
  for each row execute function public.dossiers_touch();

/* Fichiers du coffre : bucket privé, un dossier par utilisateur. */
insert into storage.buckets (id, name, public, file_size_limit)
values ('coffre', 'coffre', false, 104857600)
on conflict (id) do nothing;

drop policy if exists "Coffre : lire ses fichiers" on storage.objects;
create policy "Coffre : lire ses fichiers" on storage.objects
  for select to authenticated
  using (bucket_id = 'coffre' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Coffre : ajouter ses fichiers" on storage.objects;
create policy "Coffre : ajouter ses fichiers" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'coffre' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Coffre : remplacer ses fichiers" on storage.objects;
create policy "Coffre : remplacer ses fichiers" on storage.objects
  for update to authenticated
  using (bucket_id = 'coffre' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'coffre' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Coffre : supprimer ses fichiers" on storage.objects;
create policy "Coffre : supprimer ses fichiers" on storage.objects
  for delete to authenticated
  using (bucket_id = 'coffre' and (storage.foldername(name))[1] = auth.uid()::text);
