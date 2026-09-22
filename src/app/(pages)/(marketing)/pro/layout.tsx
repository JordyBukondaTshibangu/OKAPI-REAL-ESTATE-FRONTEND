import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Okapi Pro — Boostez vos annonces immobilières à Kinshasa",
  description:
    "Passez à Okapi Pro et obtenez plus de visibilité pour vos annonces immobilières à Kinshasa : badge exclusif, boosts, statistiques avancées et accès prioritaire.",
  keywords: [
    "agent immobilier pro Kinshasa",
    "boost annonce immobilière RDC",
    "abonnement agent immobilier Congo",
    "annonce immobilière premium Kinshasa",
  ],
  openGraph: {
    title: "Okapi Pro — Boostez vos annonces immobilières à Kinshasa",
    description:
      "Plus de visibilité, plus de clients. Passez à Okapi Pro pour vos annonces immobilières en RDC.",
    url: "https://okapi-real-estate.com/pro",
  },
  alternates: { canonical: "https://okapi-real-estate.com/pro" },
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
