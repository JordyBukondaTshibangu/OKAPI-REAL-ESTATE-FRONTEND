"use client";

import Link from "next/link";
import {
  Building2, Users, BookOpen, Shield, User,
  Home, Briefcase, MapPin, Newspaper, Info,
} from "lucide-react";
import { useT } from "@/i18n/useT";
import type { Messages } from "@/i18n/types";

type SitemapLink = { label: string; href: string };
type SitemapSection = { titleKey: keyof Messages["pages"]["sitemap"]; icon: React.ElementType; color: string; links: SitemapLink[] };

export default function PlanDuSitePage() {
  const t = useT();
  const s = t.pages.sitemap;

  const sections: SitemapSection[] = [
    { titleKey: "sHome", icon: Home, color: "bg-primary/10 text-primary",
      links: [{ label: s.lHome, href: "/" }] },
    { titleKey: "sBuy", icon: Home, color: "bg-primary/10 text-primary",
      links: [
        { label: s.lAllBuy, href: "/acheter" }, { label: s.lApts, href: "/acheter/appartements" },
        { label: s.lVillas, href: "/acheter/villas" }, { label: s.lTownhouses, href: "/acheter/maisons-ville" },
        { label: s.lLands, href: "/acheter/terrains" },
      ] },
    { titleKey: "sRent", icon: MapPin, color: "bg-secondary/20 text-secondary-foreground",
      links: [
        { label: s.lAllRent, href: "/louer" }, { label: s.lAptsRent, href: "/louer/appartements" },
        { label: s.lStudios, href: "/louer/studios" }, { label: s.lVillasRent, href: "/louer/villas" },
        { label: s.lTownhousesRent, href: "/louer/maisons-ville" },
      ] },
    { titleKey: "sSell", icon: Briefcase, color: "bg-primary/10 text-primary",
      links: [
        { label: s.lSell, href: "/vendre" }, { label: s.lEstimate, href: "/vendre/estimation" },
        { label: s.lSellApt, href: "/vendre/appartement" }, { label: s.lSellHouse, href: "/vendre/maison" },
      ] },
    { titleKey: "sCommercial", icon: Building2, color: "bg-secondary/20 text-secondary-foreground",
      links: [
        { label: s.lCommercial, href: "/commercial" }, { label: s.lOffices, href: "/commercial/bureaux" },
        { label: s.lStores, href: "/commercial/magasins" }, { label: s.lWarehouses, href: "/commercial/entrepots" },
        { label: s.lCommLands, href: "/commercial/terrains" }, { label: s.lOfficesRent, href: "/commercial/location/bureaux" },
        { label: s.lStoresRent, href: "/commercial/location/magasins" }, { label: s.lWarehousesRent, href: "/commercial/location/entrepots" },
        { label: s.lCommNews, href: "/commercial/actualites" },
      ] },
    { titleKey: "sAgents", icon: Users, color: "bg-primary/10 text-primary",
      links: [{ label: s.lFindAgent, href: "/agents" }, { label: s.lFindAgency, href: "/agences" }] },
    { titleKey: "sGuides", icon: BookOpen, color: "bg-secondary/20 text-secondary-foreground",
      links: [
        { label: s.lAllGuides, href: "/conseils" }, { label: s.lBuyGuide, href: "/conseils/guide-acheteur" },
        { label: s.lSellGuide, href: "/conseils/guide-vendeur" }, { label: s.lRentGuide, href: "/conseils/guide-locataire" },
        { label: s.lNeighborhoods, href: "/conseils/quartiers" }, { label: s.lCommunities, href: "/conseils/communautes" },
        { label: s.lTours, href: "/conseils/tours-residences" }, { label: s.lSchools, href: "/conseils/ecoles-universites" },
      ] },
    { titleKey: "sBlog", icon: Newspaper, color: "bg-primary/10 text-primary",
      links: [{ label: s.lBlog, href: "/blog" }] },
    { titleKey: "sAccount", icon: User, color: "bg-secondary/20 text-secondary-foreground",
      links: [
        { label: s.lLogin, href: "/connexion" }, { label: s.lRegister, href: "/inscription" },
        { label: s.lForgotPwd, href: "/mot-de-passe-oublie" }, { label: s.lProfile, href: "/profil" },
        { label: s.lFavorites, href: "/favoris" }, { label: s.lEnquiries, href: "/demandes" },
        { label: s.lAlerts, href: "/alertes" }, { label: s.lReviews, href: "/avis" },
      ] },
    { titleKey: "sAbout", icon: Info, color: "bg-primary/10 text-primary",
      links: [
        { label: s.lAbout, href: "/a-propos" }, { label: s.lContact, href: "/contact" },
        { label: s.lCareers, href: "/carrieres" },
      ] },
    { titleKey: "sLegal", icon: Shield, color: "bg-secondary/20 text-secondary-foreground",
      links: [
        { label: s.lTerms, href: "/conditions-generales" }, { label: s.lPrivacy, href: "/confidentialite" },
        { label: s.lCookies, href: "/cookies" }, { label: s.lSitemap, href: "/plan-du-site" },
      ] },
  ];

  return (
    <>
      <section className="bg-navy text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">{s.breadHome}</Link>
            <span>/</span>
            <span className="text-white">{s.heading}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{s.heading}</h1>
          <p className="text-white/75 max-w-xl">{s.subtitle}</p>
        </div>
      </section>

      <section className="py-14 px-6 bg-background-alt">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.titleKey} className="bg-white rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${section.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-semibold text-foreground">
                    {s[section.titleKey]}
                  </h2>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-primary hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
