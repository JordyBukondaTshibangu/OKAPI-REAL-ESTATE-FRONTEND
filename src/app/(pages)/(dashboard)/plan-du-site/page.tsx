import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Users,
  BookOpen,
  Shield,
  User,
  Home,
  Briefcase,
  MapPin,
  Newspaper,
  Info,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Plan du site — Okapi Real Estate",
  description:
    "Plan complet du site Okapi Real Estate : accédez rapidement à toutes les sections — annonces, agents, conseils, compte et informations légales.",
};

type SitemapLink = { label: string; href: string };

type SitemapSection = {
  title: string;
  icon: React.ElementType;
  color: string;
  links: SitemapLink[];
};

const sections: SitemapSection[] = [
  {
    title: "Accueil",
    icon: Home,
    color: "bg-primary/10 text-primary",
    links: [{ label: "Page d'accueil", href: "/" }],
  },
  {
    title: "Acheter",
    icon: Home,
    color: "bg-primary/10 text-primary",
    links: [
      { label: "Tous les biens à vendre", href: "/acheter" },
      { label: "Appartements", href: "/acheter/appartements" },
      { label: "Villas", href: "/acheter/villas" },
      { label: "Maisons de ville", href: "/acheter/maisons-ville" },
      { label: "Terrains", href: "/acheter/terrains" },
    ],
  },
  {
    title: "Louer",
    icon: MapPin,
    color: "bg-secondary/20 text-secondary-foreground",
    links: [
      { label: "Tous les biens à louer", href: "/louer" },
      { label: "Appartements à louer", href: "/louer/appartements" },
      { label: "Studios", href: "/louer/studios" },
      { label: "Villas à louer", href: "/louer/villas" },
      { label: "Maisons de ville à louer", href: "/louer/maisons-ville" },
    ],
  },
  {
    title: "Vendre",
    icon: Briefcase,
    color: "bg-primary/10 text-primary",
    links: [
      { label: "Vendre votre bien", href: "/vendre" },
      { label: "Estimation gratuite", href: "/vendre/estimation" },
      { label: "Vendre un appartement", href: "/vendre/appartement" },
      { label: "Vendre une maison", href: "/vendre/maison" },
    ],
  },
  {
    title: "Commercial",
    icon: Building2,
    color: "bg-secondary/20 text-secondary-foreground",
    links: [
      { label: "Immobilier commercial", href: "/commercial" },
      { label: "Bureaux à vendre", href: "/commercial/bureaux" },
      { label: "Magasins à vendre", href: "/commercial/magasins" },
      { label: "Entrepôts à vendre", href: "/commercial/entrepots" },
      { label: "Terrains commerciaux", href: "/commercial/terrains" },
      { label: "Bureaux à louer", href: "/commercial/location/bureaux" },
      { label: "Magasins à louer", href: "/commercial/location/magasins" },
      { label: "Entrepôts à louer", href: "/commercial/location/entrepots" },
      { label: "Actualités commerciales", href: "/commercial/actualites" },
    ],
  },
  {
    title: "Agents & Agences",
    icon: Users,
    color: "bg-primary/10 text-primary",
    links: [
      { label: "Trouver un agent immobilier", href: "/agents" },
      { label: "Trouver une agence", href: "/agences" },
    ],
  },
  {
    title: "Conseils immobiliers",
    icon: BookOpen,
    color: "bg-secondary/20 text-secondary-foreground",
    links: [
      { label: "Tous les conseils", href: "/conseils" },
      { label: "Guide de l'acheteur", href: "/conseils/guide-acheteur" },
      { label: "Guide du vendeur", href: "/conseils/guide-vendeur" },
      { label: "Guide du locataire", href: "/conseils/guide-locataire" },
      { label: "Infos quartiers", href: "/conseils/quartiers" },
      { label: "Guides communautaires", href: "/conseils/communautes" },
      { label: "Tours & Résidences", href: "/conseils/tours-residences" },
      { label: "Écoles & Universités", href: "/conseils/ecoles-universites" },
    ],
  },
  {
    title: "Blog & Actualités",
    icon: Newspaper,
    color: "bg-primary/10 text-primary",
    links: [{ label: "Blog Okapi Real Estate", href: "/blog" }],
  },
  {
    title: "Mon compte",
    icon: User,
    color: "bg-secondary/20 text-secondary-foreground",
    links: [
      { label: "Se connecter", href: "/connexion" },
      { label: "Créer un compte", href: "/inscription" },
      { label: "Mot de passe oublié", href: "/mot-de-passe-oublie" },
      { label: "Mon profil", href: "/profil" },
      { label: "Mes favoris", href: "/favoris" },
      { label: "Mes demandes", href: "/demandes" },
      { label: "Mes alertes", href: "/alertes" },
      { label: "Mes avis & notes", href: "/avis" },
    ],
  },
  {
    title: "À propos",
    icon: Info,
    color: "bg-primary/10 text-primary",
    links: [
      { label: "À propos d'Okapi", href: "/a-propos" },
      { label: "Nous contacter", href: "/contact" },
      { label: "Carrières", href: "/carrieres" },
    ],
  },
  {
    title: "Légal",
    icon: Shield,
    color: "bg-secondary/20 text-secondary-foreground",
    links: [
      { label: "Conditions générales", href: "/conditions-generales" },
      { label: "Politique de confidentialité", href: "/confidentialite" },
      { label: "Politique des cookies", href: "/cookies" },
      { label: "Plan du site", href: "/plan-du-site" },
    ],
  },
];

export default function PlanDuSitePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-white">Plan du site</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Plan du site</h1>
          <p className="text-white/75 max-w-xl">
            Retrouvez toutes les pages d&apos;Okapi Real Estate organisées par
            section pour naviguer facilement.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-14 px-6 bg-background-alt">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="bg-white rounded-2xl border border-border shadow-sm p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${section.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-semibold text-foreground">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-primary hover:underline"
                      >
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
