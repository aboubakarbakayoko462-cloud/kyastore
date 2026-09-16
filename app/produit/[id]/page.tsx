"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/lib/types";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      setProduct(data as Product);
      setLoading(false);
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="py-24 text-center text-stone text-sm">Chargement…</div>;
  }

  if (!product) {
    return (
      <div className="py-24 text-center">
        <p className="font-heading font-semibold text-xl mb-4">Produit introuvable</p>
        <Link href="/" className="text-brand underline underline-offset-4">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const orderLink = buildWhatsAppOrderLink(product, quantity);
  const outOfStock = product.stock === 0;

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
      <Link href="/" className="text-[12.5px] text-stone hover:text-ink transition-colors">
        ← Catalogue
      </Link>

      <div className="mt-5 grid md:grid-cols-[1fr_1.1fr] gap-7 md:gap-10">
        <div className="relative aspect-square bg-[#F0F1F3] rounded-lg overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone text-sm">
              KyaStore
            </div>
          )}
        </div>

        <div className="bg-surface border border-line rounded-lg p-6">
          {product.category && (
            <span className="inline-block bg-[#FDECD8] text-brand-dark text-[11px] font-semibold px-2.5 py-1 rounded mb-2">
              {product.category}
            </span>
          )}
          <h1 className="font-heading font-semibold text-2xl leading-tight text-ink">
            {product.title}
          </h1>
          <p className="font-heading font-bold text-[26px] text-ink mt-3 mb-3.5">
            {product.price.toLocaleString("fr-FR")} FCFA
          </p>

          <p className="text-stone text-[13.5px] leading-relaxed mb-4">
            {product.description}
          </p>

          <p className="text-[11.5px] text-stone mb-5">Référence : {product.reference}</p>

          <div className="border-t border-line pt-5">
            {!outOfStock ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[13px] text-stone">Quantité</span>
                  <div className="flex items-center border border-line rounded-md">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-bg transition-colors"
                      aria-label="Diminuer la quantité"
                    >
                      −
                    </button>
                    <span className="w-9 text-center text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-bg transition-colors"
                      aria-label="Augmenter la quantité"
                    >
                      +
                    </button>
                  </div>
                </div>

                <a
                  href={orderLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-md bg-whatsapp text-white font-semibold text-sm hover:bg-whatsapp-dark transition-colors"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5.1-1.3C8.6 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3C4.4 15 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.5-.5-1-1.1-1.4-1.7-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.5-1.3-.7-1.8-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.6.6-.9 1.3-.9 2.1.1.9.4 1.8 1 2.6 1.1 1.6 2.4 2.8 4.1 3.5.5.2 1 .4 1.5.5.6.2 1.1.1 1.6-.1.5-.2.9-.6 1.1-1.1.1-.3.1-.6.1-.8-.1-.1-.2-.1-.4-.2z" />
                  </svg>
                  Commander sur WhatsApp
                </a>
              </>
            ) : (
              <p className="text-danger font-medium text-sm">
                Ce produit est actuellement épuisé.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
