-- Table des categories, geree independamment des produits
create table categories (
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

-- Table des produits
create table products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric not null,
  image_url text,
  reference text not null,
  category text,
  stock integer not null default 1,
  created_at timestamp with time zone default now(),
  constraint price_non_negative check (price >= 0),
  constraint stock_non_negative check (stock >= 0)
);

-- Activer la sécurité au niveau des lignes (RLS)
alter table products enable row level security;

-- Tout le monde peut LIRE les produits (catalogue public)
create policy "Lecture publique des produits"
on products for select
to anon
using (true);

-- Seuls les utilisateurs connectés (admin) peuvent AJOUTER
create policy "Ajout reserve aux connectes"
on products for insert
to authenticated
with check (true);

-- Seuls les utilisateurs connectés (admin) peuvent MODIFIER
create policy "Modification reservee aux connectes"
on products for update
to authenticated
using (true);

-- Seuls les utilisateurs connectés (admin) peuvent SUPPRIMER
create policy "Suppression reservee aux connectes"
on products for delete
to authenticated
using (true);
