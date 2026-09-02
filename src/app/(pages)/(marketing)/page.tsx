import AboutSection from "@/features/home/components/AboutSection";
import ContentSections from "@/features/home/components/ContentSections";
import Discover from "@/features/home/components/Discover";
import Hero from "@/features/home/components/Hero";
import LatestListings from "@/features/home/components/LatestListings";
import MobileApp from "@/features/home/components/MobileApp";
import Regions from "@/features/home/components/Regions";
import SectionReveal from "@/shared/components/layout/SectionReveal";
import { getPropertyStats } from "@/lib/api";
import { getPropertiesByListingType } from "@/lib/properties";

export default async function Home() {
  const [initialRent, stats] = await Promise.all([
    getPropertiesByListingType("rent").then((p) => p.slice(0, 6)),
    getPropertyStats(),
  ]);

  const totalCount = stats.total || initialRent.length;

  return (
    <>
      <Hero previewProperties={initialRent.slice(0, 2)} totalCount={totalCount} />
      <SectionReveal><LatestListings initialRent={initialRent} totalCount={totalCount} /></SectionReveal>
      <SectionReveal><Regions stats={stats} /></SectionReveal>
      <SectionReveal><Discover /></SectionReveal>
      <SectionReveal><ContentSections /></SectionReveal>
      <SectionReveal><MobileApp /></SectionReveal>
      <SectionReveal><AboutSection /></SectionReveal>
    </>
  );
}
