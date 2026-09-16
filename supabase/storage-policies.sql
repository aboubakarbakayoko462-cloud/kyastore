-- A executer APRES avoir cree le bucket "product-images" dans Supabase Storage.
-- Sans ces regles, n'importe qui pourrait uploader ou supprimer des images
-- meme sans etre connecte en tant qu'admin.

-- Lecture publique des images (necessaire pour les afficher sur le site)
create policy "Lecture publique images produits"
on storage.objects for select
to public
using (bucket_id = 'product-images');

-- Upload reserve aux utilisateurs connectes (l'admin)
create policy "Upload reserve aux connectes"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

-- Modification reservee aux connectes
create policy "Modification images reservee aux connectes"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images');

-- Suppression reservee aux connectes
create policy "Suppression images reservee aux connectes"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');
