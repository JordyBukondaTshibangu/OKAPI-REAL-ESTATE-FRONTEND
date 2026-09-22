import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agences immobilières à Kinshasa — Okapi Real Estate",
  description:
    "Découvrez les meilleures agences immobilières à Kinshasa sur Okapi Real Estate. Comparez les agences vérifiées, consultez leurs annonces et contactez-les directement.",
  keywords: [
    "agences immobilières Kinshasa",
    "meilleures agences immobilières RDC",
    "agence immobilière Congo",
    "trouver agence immobilière Kinshasa",
  ],
  openGraph: {
    title: "Agences immobilières à Kinshasa — Okapi Real Estate",
    description:
      "Toutes les agences immobilières vérifiées à Kinshasa. Comparez et contactez directement.",
    url: "https://okapi-real-estate.com/agences",
  },
  alternates: { canonical: "https://okapi-real-estate.com/agences" },
};

export default function AgencesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
