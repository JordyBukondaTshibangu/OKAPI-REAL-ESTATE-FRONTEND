import type { Metadata } from "next";
import AboutSection from "@/features/home/components/AboutSection";
import ContentSections from "@/features/home/components/ContentSections";
import Discover from "@/features/home/components/Discover";
import Hero from "@/features/home/components/Hero";
import HeroStats from "@/features/home/components/HeroStats";
import LatestListings from "@/features/home/components/LatestListings";
import MobileApp from "@/features/home/components/MobileApp";
import Regions from "@/features/home/components/Regions";
import SectionReveal from "@/shared/components/layout/SectionReveal";
import { getPropertyStats } from "@/lib/api";
import { getPropertiesByListingType } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Immobilier à Kinshasa — Appartements, Villas & Maisons",
  description:
    "Okapi Real Estate : la plateforme immobilière de référence à Kinshasa. Achetez ou louez des appartements, villas, maisons et locaux commerciaux en RDC. Annonces vérifiées, agents certifiés.",
  keywords: [
    "immobilier Kinshasa",
    "appartement Kinshasa",
    "villa à vendre Kinshasa",
    "maison à louer RDC",
    "agence immobilière Kinshasa",
    "bien immobilier Congo",
  ],
  openGraph: {
    title: "Immobilier à Kinshasa — Appartements, Villas & Maisons | Okapi Real Estate",
    description:
      "La plateforme immobilière de référence à Kinshasa. Achetez ou louez des biens vérifiés en RDC.",
    url: "https://okapi-real-estate.com",
  },
  alternates: { canonical: "https://okapi-real-estate.com" },
};

export default async function Home() {
  const [initialRent, stats] = await Promise.all([
    getPropertiesByListingType("rent").then((p) => p.slice(0, 6)),
    getPropertyStats(),
  ]);

  const totalCount = stats.total || initialRent.length;

  return (
    <>
      <Hero previewProperties={initialRent.slice(0, 2)} totalCount={totalCount} />
      <HeroStats totalCount={totalCount} />
      <SectionReveal><LatestListings initialRent={initialRent} totalCount={totalCount} /></SectionReveal>
      <SectionReveal><Regions stats={stats} /></SectionReveal>
      <SectionReveal><Discover /></SectionReveal>
      <SectionReveal><ContentSections /></SectionReveal>
      <SectionReveal><MobileApp /></SectionReveal>
      <SectionReveal><AboutSection /></SectionReveal>
    </>
  );
}
