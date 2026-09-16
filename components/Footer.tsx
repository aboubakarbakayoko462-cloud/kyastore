import Link from "next/link";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

// Remplace ces liens par les vrais comptes de la boutique.
const SOCIALS = [
  {
    name: "Instagram",
    href: "https://instagram.com/kyastore",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px]">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com/kyastore",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px]">
        <path d="M15 8.5h-2c-1.1 0-2 .9-2 2V13H9v3h2v6h3v-6h2.2l.8-3H14v-2c0-.55.45-1 1-1h2v-3.5Z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@kyastore",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px]">
        <path d="M15 3v10.5a3.5 3.5 0 1 1-3.5-3.5" />
        <path d="M15 3c0 2.5 2 4.5 4.5 4.5" />
      </svg>
    ),
  },
];

export default function Footer() {
  const whatsappContactLink = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <footer className="bg-navy text-[#9497A3] mt-16">
      <div className="max-w-content mx-auto px-6 md:px-10 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <p className="font-heading font-bold text-xl text-white mb-3">
            Kya<span className="text-brand">Store</span>
          </p>
          <p className="text-sm leading-relaxed max-w-[200px]">
            Des pièces choisies avec soin, commandées en un message.
          </p>
        </div>

        <div>
          <p className="text-sm font-heading font-semibold text-white mb-4">Boutique</p>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link href="/" className="hover:text-brand transition-colors">
                Catalogue
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-brand transition-colors">
                Espace boutique
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-heading font-semibold text-white mb-4">Contact</p>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <a
                href={whatsappContactLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand transition-colors"
              >
                Nous écrire sur WhatsApp
              </a>
            </li>
            <li>
              <a href="mailto:contact@kyastore.com" className="hover:text-brand transition-colors">
                contact@kyastore.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-heading font-semibold text-white mb-4">Suivez-nous</p>
          <div className="flex items-center gap-4">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="hover:text-brand transition-colors duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#2A2D37]">
        <div className="max-w-content mx-auto px-6 md:px-10 py-4 text-xs text-[#6C6F7C]">
          &copy; {new Date().getFullYear()} KyaStore. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
