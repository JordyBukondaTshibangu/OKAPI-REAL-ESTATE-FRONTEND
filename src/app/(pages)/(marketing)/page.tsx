import AboutSection from "@/features/home/components/AboutSection";
import ContentSections from "@/features/home/components/ContentSections";
import Discover from "@/features/home/components/Discover";
import Hero from "@/features/home/components/Hero";
import MobileApp from "@/features/home/components/MobileApp";
import Regions from "@/features/home/components/Regions";

export default function Home() {
  return (
    <>
      <Hero />
      <Regions />
      <Discover />
      <ContentSections />
      <MobileApp />
      <AboutSection />
    </>
  );
}
