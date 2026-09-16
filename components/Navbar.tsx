"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSearch } from "@/lib/SearchContext";

export default function Navbar() {
  const { query, setQuery } = useSearch();
  const pathname = usePathname();
  const router = useRouter();

  function handleSearchChange(value: string) {
    setQuery(value);
    if (pathname !== "/") router.push("/");
  }

  return (
    <header className="bg-surface border-b border-line sticky top-0 z-30">
      <div className="max-w-content mx-auto px-4 sm:px-6 md:px-10 py-3.5 flex flex-wrap items-center gap-3 sm:gap-4">
        <Link href="/" className="font-heading font-bold text-lg sm:text-xl shrink-0">
          Kya<span className="text-brand">Store</span>
        </Link>

        <div className="flex-1 min-w-[140px] flex items-center border border-line rounded-md overflow-hidden bg-surface focus-within:border-brand">
          <span className="px-3 text-stone">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Rechercher un produit…"
            className="flex-1 py-2.5 pr-3 text-sm outline-none bg-transparent"
          />
        </div>

        <nav className="flex items-center gap-5 text-sm font-medium shrink-0">
          <Link href="/" className="hover:text-brand transition-colors">
            Catalogue
          </Link>
          <Link href="/admin/login" className="hover:text-brand transition-colors">
            Espace boutique
          </Link>
        </nav>
      </div>
    </header>
  );
}
