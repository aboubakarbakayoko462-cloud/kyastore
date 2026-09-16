-- A executer seulement si tu as deja mis en place schema.sql avant l'ajout
-- de la gestion des categories. Si tu pars d'un projet Supabase tout neuf,
-- ignore ce fichier : la table est deja incluse dans schema.sql.

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamp with time zone default now()
);

alter table categories enable row level security;

create policy "Lecture publique des categories"
on categories for select
to anon
using (true);

create policy "Ajout categorie reserve aux connectes"
on categories for insert
to authenticated
with check (true);

create policy "Modification categorie reservee aux connectes"
on categories for update
to authenticated
using (true);

create policy "Suppression categorie reservee aux connectes"
on categories for delete
to authenticated
using (true);
