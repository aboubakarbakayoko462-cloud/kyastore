"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Product, Category } from "@/lib/types";

const emptyForm = {
  id: "",
  title: "",
  description: "",
  price: "",
  reference: "",
  category: "",
  stock: "1",
};

const fieldClass =
  "border border-line rounded-md px-3.5 py-2.5 text-sm bg-surface focus:outline-none focus:border-brand transition-colors";

function StockPill({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-danger-bg text-danger">
        Épuisé
      </span>
    );
  if (stock <= 3)
    return (
      <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-warn-bg text-warn">
        Stock faible · {stock}
      </span>
    );
  return (
    <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-success-bg text-success">
      En stock · {stock}
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/admin/login");
        return;
      }
      setCheckingAuth(false);
      fetchProducts();
      fetchCategories();
    }
    checkAuth();
  }, [router]);

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProducts(data as Product[]);
  }

  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    if (data) setCategories(data as Category[]);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    setSavingCategory(true);
    const { error } = await supabase.from("categories").insert({ name });
    setSavingCategory(false);
    if (error) {
      alert(
        error.code === "23505"
          ? "Cette catégorie existe déjà."
          : "Impossible d'ajouter la catégorie."
      );
      return;
    }
    setNewCategoryName("");
    fetchCategories();
  }

  async function handleRenameCategory(category: Category) {
    const newName = window.prompt("Nouveau nom de la catégorie :", category.name);
    if (!newName || !newName.trim() || newName.trim() === category.name) return;
    const trimmed = newName.trim();

    await supabase.from("categories").update({ name: trimmed }).eq("id", category.id);

    // Garde les produits deja tagges avec l'ancien nom synchronises
    await supabase.from("products").update({ category: trimmed }).eq("category", category.name);

    fetchCategories();
    fetchProducts();
  }

  async function handleDeleteCategory(category: Category) {
    if (
      !confirm(
        `Supprimer la catégorie "${category.name}" ? Les produits qui l'utilisent garderont ce texte mais elle ne sera plus proposée dans la liste.`
      )
    )
      return;
    await supabase.from("categories").delete().eq("id", category.id);
    fetchCategories();
  }

  function openNewForm() {
    setForm(emptyForm);
    setImageFile(null);
    setExistingImageUrl(null);
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setForm({
      id: product.id,
      title: product.title,
      description: product.description,
      price: String(product.price),
      reference: product.reference,
      category: product.category || "",
      stock: String(product.stock),
    });
    setExistingImageUrl(product.image_url);
    setImageFile(null);
    setShowForm(true);
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Supprimer "${product.title}" ?`)) return;
    await supabase.from("products").delete().eq("id", product.id);
    fetchProducts();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let imageUrl = existingImageUrl;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile);

      if (!uploadError) {
        const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
    }

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      reference: form.reference,
      category: form.category || null,
      stock: Number(form.stock),
      image_url: imageUrl,
    };

    if (form.id) {
      await supabase.from("products").update(payload).eq("id", form.id);
    } else {
      await supabase.from("products").insert(payload);
    }

    setSaving(false);
    setShowForm(false);
    fetchProducts();
  }

  if (checkingAuth) {
    return <div className="py-32 text-center text-stone text-sm">Vérification…</div>;
  }

  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="pb-16">
      <div className="bg-navy text-white mb-8">
        <div className="max-w-content mx-auto px-4 sm:px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-semibold text-xl sm:text-2xl">
              Gestion de la boutique
            </h1>
            <p className="text-[11.5px] text-[#9497A3] mt-0.5">
              Connecté en tant qu&apos;administrateur
            </p>
          </div>
          <div className="flex items-center flex-wrap gap-4">
            <button
              onClick={openNewForm}
              className="bg-brand text-white px-4 py-2.5 rounded-md text-[12.5px] font-semibold hover:bg-brand-dark transition-colors"
            >
              + Ajouter un produit
            </button>
            <button
              onClick={handleLogout}
              className="text-[12.5px] text-[#9497A3] hover:text-white transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
          <div className="bg-surface border border-line border-l-4 border-l-brand rounded-lg px-4.5 py-4">
            <p className="font-heading font-bold text-2xl">{products.length}</p>
            <p className="text-[11.5px] text-stone mt-0.5">Produits au catalogue</p>
          </div>
          <div className="bg-surface border border-line border-l-4 border-l-navy rounded-lg px-4.5 py-4">
            <p className="font-heading font-bold text-2xl">{categories.length}</p>
            <p className="text-[11.5px] text-stone mt-0.5">Catégories</p>
          </div>
          <div className="bg-surface border border-line border-l-4 border-l-danger rounded-lg px-4.5 py-4">
            <p className="font-heading font-bold text-2xl">{outOfStockCount}</p>
            <p className="text-[11.5px] text-stone mt-0.5">Produits épuisés</p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="font-heading font-semibold text-base mb-3">Catégories</h2>
          <div className="bg-surface border border-line rounded-lg p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.length === 0 && (
                <p className="text-sm text-stone">Aucune catégorie pour le moment.</p>
              )}
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 bg-[#FDECD8] rounded-md px-3 py-1.5 text-[12.5px] text-brand-dark font-medium"
                >
                  <span>{cat.name}</span>
                  <button
                    onClick={() => handleRenameCategory(cat)}
                    className="text-ink/70 hover:underline underline-offset-4 text-[11px]"
                  >
                    Renommer
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="text-danger hover:underline underline-offset-4 text-[11px]"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddCategory} className="flex flex-wrap gap-3">
              <input
                placeholder="Nouvelle catégorie (ex : Sacs)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className={`${fieldClass} flex-1 min-w-[180px]`}
              />
              <button
                type="submit"
                disabled={savingCategory}
                className="bg-brand text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60"
              >
                Ajouter
              </button>
            </form>
          </div>
        </section>

        <section>
          <h2 className="font-heading font-semibold text-base mb-3">Produits</h2>
          <div className="bg-surface border border-line rounded-lg overflow-hidden">
            {products.length === 0 ? (
              <p className="p-10 text-center text-stone text-sm">
                Aucun produit pour le moment. Clique sur &quot;+ Ajouter un produit&quot; pour commencer.
              </p>
            ) : (
              products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 border-b border-line last:border-b-0"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-md bg-[#F0F1F3] shrink-0 overflow-hidden">
                      {p.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[13px] truncate">{p.title}</p>
                      <p className="text-[11.5px] text-stone mt-0.5">
                        {p.price.toLocaleString("fr-FR")} FCFA
                        {p.category ? ` · ${p.category}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <StockPill stock={p.stock} />
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditForm(p)}
                        className="text-[12.5px] font-semibold text-brand-dark hover:underline underline-offset-4"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="text-[12.5px] font-semibold text-danger hover:underline underline-offset-4"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface w-full max-w-lg rounded-lg p-7 max-h-[90vh] overflow-y-auto">
            <h2 className="font-heading font-semibold text-lg mb-5">
              {form.id ? "Modifier le produit" : "Nouveau produit"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <input
                placeholder="Titre du produit"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className={fieldClass}
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={4}
                className={fieldClass}
              />
              <div className="grid grid-cols-2 gap-3.5">
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Prix (FCFA)"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  className={fieldClass}
                />
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                  className={fieldClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <input
                  placeholder="Référence"
                  value={form.reference}
                  onChange={(e) => setForm({ ...form, reference: e.target.value })}
                  required
                  className={fieldClass}
                />
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={fieldClass}
                >
                  <option value="">Aucune catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {categories.length === 0 && (
                <p className="text-xs text-stone -mt-1.5">
                  Aucune catégorie créée. Ferme cette fenêtre et ajoute-en une dans
                  la section &quot;Catégories&quot; ci-dessus.
                </p>
              )}
              <div>
                <label className="text-sm text-stone block mb-2">Image du produit</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-sm"
                />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60"
                >
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 text-stone hover:text-ink transition-colors text-sm"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
