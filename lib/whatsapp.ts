import { Product } from "./types";

// Numéro WhatsApp de la boutique, au format international sans "+" ni espaces.
// Exemple Côte d'Ivoire : "2250700000000"
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2250000000000";

export function buildWhatsAppOrderLink(
  product: Product,
  quantity: number = 1
) {
  const productUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/produit/${product.id}`
      : "";

  const lines = [
    `Bonjour KyaStore 👋`,
    ``,
    `Je souhaite commander :`,
    `• Produit : ${product.title}`,
    `• Référence : ${product.reference}`,
    `• Prix unitaire : ${product.price.toLocaleString("fr-FR")} FCFA`,
    `• Quantité : ${quantity}`,
    productUrl ? `• Lien : ${productUrl}` : ``,
  ].filter(Boolean);

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
