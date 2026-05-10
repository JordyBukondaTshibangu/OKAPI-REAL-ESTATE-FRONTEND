import { Button } from "@/shared/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conseils immobiliers à Kinshasa — Okapi Real Estate",
  description:
    "Guides pratiques pour acheter, vendre, louer, choisir son quartier et trouver les meilleures écoles à Kinshasa — par Okapi Real Estate.",
};

const guides = [
  {
    href: "/conseils/guide-acheteur",
    label: "Guide de l'acheteur",
    description:
      "Définir votre budget, choisir le bon quartier, vérifier le titre foncier, signer en sécurité. Tout ce qu'il faut savoir avant d'acheter à Kinshasa.",
    icon: "🏠",
    tag: "Achat",
    color: "border-primary",
  },
  {
    href: "/conseils/guide-vendeur",
    label: "Guide du vendeur",
    description:
      "Estimez votre bien, préparez-le pour la vente, fixez le bon prix et finalisez votre transaction dans les meilleures conditions.",
    icon: "📋",
    tag: "Vente",
    color: "border-secondary",
  },
  {
    href: "/conseils/guide-locataire",
    label: "Guide du locataire",
    description:
      "Comprendre le marché locatif kinois, vérifier le bail, connaître vos droits et obligations en tant que locataire.",
    icon: "🔑",
    tag: "Location",
    color: "border-primary",
  },
  {
    href: "/conseils/quartiers",
    label: "Infos quartiers",
    description:
      "Analyse détaillée de 8 quartiers de Kinshasa : ambiance, fourchettes de prix, points forts et points de vigilance.",
    icon: "🗺",
    tag: "Quartiers",
    color: "border-secondary",
  },
  {
    href: "/conseils/communautes",
    label: "Guides communautaires",
    description:
      "Conseils sur mesure pour les expatriés, primo-accédants, investisseurs et retraités qui s'installent ou investissent à Kinshasa.",
    icon: "👥",
    tag: "Profils",
    color: "border-primary",
  },
  {
    href: "/conseils/tours-residences",
    label: "Tours & Résidences",
    description:
      "Les immeubles et résidences sécurisées de standing à Kinshasa : emplacements, équipements, prix et conseils de choix.",
    icon: "🏢",
    tag: "Premium",
    color: "border-secondary",
  },
  {
    href: "/conseils/ecoles-universites",
    label: "Écoles & Universités",
    description:
      "Guide des établissements scolaires et universitaires de Kinshasa par commune, avec conseils pour les familles.",
    icon: "🎓",
    tag: "Familles",
    color: "border-primary",
  },
];

export default function ConseilsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-white">Conseils</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-4">
            7 guides disponibles
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Conseils immobiliers à Kinshasa
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Que vous achetiez, vendiez, louiez ou investissiez, nos guides
            rédigés par des experts locaux vous accompagnent à chaque étape de
            votre projet immobilier en RDC.
          </p>
        </div>
      </section>

      {/* Guides grid */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className={`bg-card rounded-xl shadow-md p-6 border-t-4 ${guide.color} hover:shadow-lg transition-shadow group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{guide.icon}</span>
                  <span className="text-xs font-semibold bg-muted text-muted-foreground px-3 py-1 rounded-full">
                    {guide.tag}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {guide.label}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {guide.description}
                </p>
                <div className="mt-4 text-sm font-medium text-primary flex items-center gap-1">
                  Lire le guide
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-muted">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Besoin d&apos;un conseil personnalisé ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Nos agents Okapi Real Estate sont des experts du marché kinois.
            Contactez-nous pour un accompagnement sur mesure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Contacter un expert</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/acheter">Parcourir les annonces</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
