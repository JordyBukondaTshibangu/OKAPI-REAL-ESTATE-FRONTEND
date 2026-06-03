import AboutSection from "@/features/home/components/AboutSection";
import ContentSections from "@/features/home/components/ContentSections";
import Discover from "@/features/home/components/Discover";
import Hero from "@/features/home/components/Hero";
import MobileApp from "@/features/home/components/MobileApp";
import Regions from "@/features/home/components/Regions";
import SectionReveal from "@/shared/components/layout/SectionReveal";

export default function Home() {
  return (
    <>
      <Hero />
      <SectionReveal><Regions /></SectionReveal>
      <SectionReveal><Discover /></SectionReveal>
      <SectionReveal><ContentSections /></SectionReveal>
      <SectionReveal><MobileApp /></SectionReveal>
      <SectionReveal><AboutSection /></SectionReveal>
    </>
  );
}
