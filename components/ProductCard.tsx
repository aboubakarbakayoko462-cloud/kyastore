import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produit/${product.id}`}
      className="group block bg-surface border border-line rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
    >
      <div className="relative aspect-square bg-[#F0F1F3]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone text-xs">
            KyaStore
          </div>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 left-2 bg-danger text-white text-[10px] font-semibold px-2 py-0.5 rounded">
            Épuisé
          </span>
        )}
      </div>
      <div className="p-3">
        {product.category && (
          <span className="inline-block bg-[#FDECD8] text-brand-dark text-[10px] font-semibold px-2 py-0.5 rounded mb-1.5">
            {product.category}
          </span>
        )}
        <h3 className="text-[13px] font-semibold leading-snug mb-1.5 min-h-[34px]">
          {product.title}
        </h3>
        <p className="font-heading font-semibold text-[15px] text-ink">
          {product.price.toLocaleString("fr-FR")} FCFA
        </p>
      </div>
    </Link>
  );
}
