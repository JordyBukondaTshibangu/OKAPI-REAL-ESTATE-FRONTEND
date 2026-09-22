import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendre un bien à Kinshasa — Estimation & Mise en vente",
  description:
    "Vendez votre appartement, villa ou maison à Kinshasa avec Okapi Real Estate. Estimation gratuite, accompagnement par des agents certifiés et publication d'annonce rapide.",
  keywords: [
    "vendre appartement Kinshasa",
    "vendre maison RDC",
    "estimation immobilière Kinshasa",
    "mettre en vente bien immobilier Congo",
    "agence vente immobilier Kinshasa",
  ],
  openGraph: {
    title: "Vendre un bien à Kinshasa — Estimation & Mise en vente | Okapi Real Estate",
    description:
      "Vendez votre bien immobilier à Kinshasa avec des agents certifiés. Estimation gratuite et publication rapide.",
    url: "https://okapi-real-estate.com/vendre",
  },
  alternates: { canonical: "https://okapi-real-estate.com/vendre" },
};

export default function VendreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
