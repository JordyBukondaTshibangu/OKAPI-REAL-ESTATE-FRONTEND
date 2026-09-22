import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer votre agence immobilière sur Okapi — Kinshasa",
  description:
    "Référencez votre agence immobilière sur Okapi Real Estate et trouvez des clients à Kinshasa. Gestion d'équipe, annonces groupées et tableau de bord agence.",
  keywords: [
    "agence immobilière Kinshasa",
    "créer agence immobilière RDC",
    "référencer agence immobilière Congo",
    "gestion agence immobilière Kinshasa",
  ],
  openGraph: {
    title: "Créer votre agence immobilière sur Okapi — Kinshasa",
    description:
      "Référencez votre agence immobilière à Kinshasa sur Okapi Real Estate et gérez vos agents et annonces.",
    url: "https://okapi-real-estate.com/agence",
  },
  alternates: { canonical: "https://okapi-real-estate.com/agence" },
};

export default function AgenceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
