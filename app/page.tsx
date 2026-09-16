"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";
import { useSearch } from "@/lib/SearchContext";
import { HERO_THEME, heroThemes } from "@/lib/heroTheme";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("Tout");
  const { query } = useSearch();
  const theme = heroThemes[HERO_THEME];

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const categories = [
    "Tout",
    ...Array.from(
      new Set(products.map((p) => p.category).filter(Boolean) as string[])
    ),
  ];

  let filtered =
    activeCategory === "Tout"
      ? products
      : products.filter((p) => p.category === activeCategory);

  if (query.trim()) {
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(query.trim().toLowerCase())
    );
  }

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 md:px-10">
      <section className={`rounded-xl mt-5 px-6 sm:px-9 py-9 sm:py-12 ${theme.wrapperClass}`}>
        <p className={`text-[11px] uppercase tracking-wide mb-2 ${theme.eyebrowClass}`}>
          {theme.eyebrowText}
        </p>
        <h1 className="text-white font-heading font-semibold text-2xl sm:text-4xl leading-tight max-w-xl">
          Des pièces choisies avec soin, commandées en un message.
        </h1>
        <p className={`mt-3 max-w-md text-sm ${theme.subClass}`}>
          Parcourez le catalogue et commandez directement sur WhatsApp — sans
          panier, sans compte, sans friction.
        </p>
        <a
          href="#catalogue"
          className={`inline-block mt-6 px-6 py-3 rounded-md text-sm font-semibold transition-colors ${theme.buttonClass}`}
        >
          Voir le catalogue
        </a>
      </section>

      <section id="catalogue" className="pt-6 pb-20">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 -mt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-md text-[12.5px] font-medium border transition-colors ${
                activeCategory === cat
                  ? "bg-brand border-brand text-white"
                  : "bg-surface border-line text-stone hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-24 text-center text-stone text-sm">Chargement…</div>
        ) : (
          <ProductGrid products={filtered} />
        )}
      </section>
    </div>
  );
}
