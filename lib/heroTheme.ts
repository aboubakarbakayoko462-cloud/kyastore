// Change cette valeur pour choisir le style du bandeau héros de la page d'accueil.
// "orange"  -> fond orange, ambiance "promo vive"
// "navy"    -> fond marine foncé, ambiance plus sobre/premium
export const HERO_THEME: "orange" | "navy" = "orange";

export const heroThemes = {
  orange: {
    wrapperClass: "bg-brand",
    eyebrowClass: "text-[#FFE3C2]",
    eyebrowText: "La sélection du moment",
    subClass: "text-[#FFEBD6]",
    buttonClass: "bg-navy text-white hover:bg-[#22242C]",
  },
  navy: {
    wrapperClass: "bg-navy",
    eyebrowClass: "text-brand",
    eyebrowText: "Livraison rapide · Commande directe",
    subClass: "text-[#C7C9D1]",
    buttonClass: "bg-brand text-white hover:bg-brand-dark",
  },
} as const;
