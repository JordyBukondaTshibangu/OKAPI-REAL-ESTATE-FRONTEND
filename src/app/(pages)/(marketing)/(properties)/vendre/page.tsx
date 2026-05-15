import Link from "next/link";
import { Check, X, Info } from "lucide-react";

export const metadata = {
  title: "Packages de mise en ligne — Vendre avec Okapi Real Estate",
  description:
    "Listez votre bien à Kinshasa avec Okapi Real Estate. Choisissez le package qui correspond à vos besoins : Libre-service Lite, Libre-service, Assisté ou En vedette.",
};

type Feature = { label: string; tooltip?: boolean };

type Package = {
  name: string;
  price: string;
  blurb: string;
  features: Feature[];
  includes: (Feature | null)[]; // null renders an "X" row
  plus: (Feature | null)[];
  highlight?: boolean;
  badge?: string;
  ctaVariant: "primary" | "highlight";
};

const packages: Package[] = [
  {
    name: "Libre-service Lite",
    price: "$ 49",
    blurb:
      "Créez votre annonce avec nos outils. Pour les biens jusqu'à $ 50 000.",
    features: [
      { label: "Biens résidentiels jusqu'à $ 50 000" },
      { label: "Atteignez la plus large audience d'acheteurs" },
      { label: "Annonce en ligne pendant 6 mois" },
      { label: "Alertes email automatiques aux acheteurs" },
      { label: "Téléchargez photos en illimité" },
      { label: "Notifications de prospects en temps réel" },
      { label: "Suivez les performances de votre annonce" },
      { label: "Numéro de téléphone virtuel", tooltip: true },
      { label: "Support dédié" },
      { label: "Aide à l'offre d'achat", tooltip: true },
    ],
    includes: [null, null, null, null],
    plus: [null],
    ctaVariant: "primary",
  },
  {
    name: "Libre-service",
    price: "$ 229",
    blurb:
      "Utilisez nos guides étape par étape et nos outils pour créer votre annonce.",
    features: [
      { label: "Tous types de biens et toutes les fourchettes de prix" },
      { label: "Atteignez la plus large audience d'acheteurs" },
      { label: "Annonce en ligne pendant 6 mois" },
      { label: "Alertes email automatiques aux acheteurs" },
      { label: "Téléchargez photos en illimité" },
      { label: "Notifications de prospects en temps réel" },
      { label: "Suivez les performances de votre annonce" },
      { label: "Numéro de téléphone virtuel", tooltip: true },
      { label: "Support dédié" },
      { label: "Aide à l'offre d'achat", tooltip: true },
    ],
    includes: [null, null, null, null],
    plus: [null],
    highlight: true,
    badge: "LE PLUS POPULAIRE",
    ctaVariant: "highlight",
  },
  {
    name: "Assisté",
    price: "$ 399",
    blurb: "Laissez nos experts créer votre annonce pour vous.",
    features: [
      { label: "Tous types de biens et toutes les fourchettes de prix" },
      { label: "Atteignez la plus large audience d'acheteurs" },
      { label: "Annonce en ligne pendant 6 mois" },
      { label: "Alertes email automatiques aux acheteurs" },
      { label: "Téléchargez photos en illimité" },
      { label: "Notifications de prospects en temps réel" },
      { label: "Suivez les performances de votre annonce" },
      { label: "Numéro de téléphone virtuel", tooltip: true },
      { label: "Support dédié" },
      { label: "Aide à l'offre d'achat", tooltip: true },
    ],
    includes: [
      { label: "Vidéo aérienne et visite guidée professionnelle" },
      { label: "Service de photographie professionnelle" },
      { label: "Rédaction de la description du bien" },
      { label: "Plans d'étage" },
    ],
    plus: [null],
    ctaVariant: "primary",
  },
  {
    name: "En vedette",
    price: "$ 499",
    blurb: "Laissez nos experts créer votre annonce pour vous.",
    features: [
      { label: "Tous types de biens et toutes les fourchettes de prix" },
      { label: "Atteignez la plus large audience d'acheteurs" },
      { label: "Annonce en ligne pendant 6 mois" },
      { label: "Alertes email automatiques aux acheteurs" },
      { label: "Téléchargez photos en illimité" },
      { label: "Notifications de prospects en temps réel" },
      { label: "Suivez les performances de votre annonce" },
      { label: "Numéro de téléphone virtuel", tooltip: true },
      { label: "Support dédié" },
      { label: "Aide à l'offre d'achat", tooltip: true },
    ],
    includes: [
      { label: "Vidéo aérienne et visite guidée professionnelle" },
      { label: "Service de photographie professionnelle" },
      { label: "Rédaction de la description du bien" },
      { label: "Plans d'étage" },
    ],
    plus: [{ label: "Annonce mise en avant", tooltip: true }],
    ctaVariant: "primary",
  },
];

function FeatureRow({ feature }: { feature: Feature | null }) {
  if (feature === null) {
    return (
      <li className="flex items-center gap-2 text-sm text-muted-foreground/70 min-h-[28px]">
        <X className="w-4 h-4 text-muted-foreground/50 shrink-0" />
      </li>
    );
  }
  return (
    <li className="flex items-start gap-2 text-sm text-text-dark min-h-[28px]">
      <Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
      <span className="flex items-center gap-1.5">
        {feature.label}
        {feature.tooltip && (
          <Info className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </span>
    </li>
  );
}

function PackageCard({ pkg }: { pkg: Package }) {
  const ringClass = pkg.highlight
    ? "ring-2 ring-emerald-500"
    : "ring-1 ring-border";

  return (
    <div
      className={`relative bg-card rounded-2xl ${ringClass} flex flex-col overflow-hidden shadow-sm`}
    >
      {pkg.badge && (
        <div className="absolute top-0 left-0 z-10 overflow-hidden w-32 h-32 pointer-events-none">
          <div className="absolute top-6 -left-9 w-44 rotate-[-45deg] bg-emerald-500 text-white text-[10px] font-semibold tracking-wider text-center py-1 shadow">
            {pkg.badge}
          </div>
        </div>
      )}

      <div className="px-6 pt-8 pb-6 text-center">
        <h3 className="text-2xl font-light text-text-dark">{pkg.name}</h3>
        <p className="mt-3 text-2xl font-semibold text-text-dark">{pkg.price}</p>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed min-h-[60px]">
          {pkg.blurb}
        </p>
      </div>

      <div className="px-6 pb-6 border-t border-border pt-6 flex-1">
        <ul className="space-y-2.5">
          {pkg.features.map((f, i) => (
            <FeatureRow key={`f-${i}`} feature={f} />
          ))}
        </ul>

        <p className="mt-6 text-xs text-muted-foreground uppercase tracking-wide">
          Inclus
        </p>
        <ul className="mt-3 space-y-2.5">
          {pkg.includes.map((f, i) => (
            <FeatureRow key={`inc-${i}`} feature={f} />
          ))}
        </ul>

        <p className="mt-6 text-xs text-muted-foreground uppercase tracking-wide">
          Plus
        </p>
        <ul className="mt-3 space-y-2.5">
          {pkg.plus.map((f, i) => (
            <FeatureRow key={`plus-${i}`} feature={f} />
          ))}
        </ul>
      </div>

      <div className="px-6 pb-6">
        <Link
          href="/vendre/maison"
          className={`flex items-center justify-center w-full rounded-full h-11 text-sm font-medium transition-colors ${
            pkg.ctaVariant === "highlight"
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-primary text-primary-foreground hover:bg-primary-hover"
          }`}
        >
          Lister votre bien
        </Link>
      </div>
    </div>
  );
}

export default function VendrePage() {
  return (
    <div className="bg-background-alt">
      <section className="max-w-6xl mx-auto px-6 py-14">
        <p className="text-center text-text-dark">
          Plus de <span className="font-semibold">2 millions</span> de visiteurs
          consultent Okapi chaque mois. Listez votre bien sur le
          <br />
          <span className="font-semibold">
            site immobilier n°1 de RDC
          </span>
          !
        </p>

        <h1 className="text-center text-4xl md:text-5xl font-light text-text-dark mt-8">
          Packages de mise en ligne
        </h1>

        <p className="text-center mt-3">
          <Link
            href="/louer"
            className="text-primary hover:underline text-sm font-medium"
          >
            Vous louez votre bien ?
          </Link>
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.name} pkg={pkg} />
          ))}
        </div>
      </section>

      <section className="bg-background">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-text-dark">
            Pourquoi lister avec Okapi
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-text-dark">
            <span className="font-semibold">Une plus grande part du marché</span>{" "}
            visite Okapi qu&apos;aucun autre site immobilier en RDC. Plus de
            visiteurs signifie{" "}
            <span className="font-semibold">plus de prospects qualifiés</span>.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl bg-background-alt p-8">
              <p className="text-4xl font-semibold text-primary">2M+</p>
              <p className="mt-3 text-sm text-text-dark">
                Visiteurs uniques mensuels sur la plateforme
              </p>
            </div>
            <div className="rounded-xl bg-background-alt p-8">
              <p className="text-4xl font-semibold text-primary">6 mois</p>
              <p className="mt-3 text-sm text-text-dark">
                Durée de mise en ligne incluse sur tous les packages
              </p>
            </div>
            <div className="rounded-xl bg-background-alt p-8">
              <p className="text-4xl font-semibold text-primary">24/7</p>
              <p className="mt-3 text-sm text-text-dark">
                Notifications de prospects en temps réel
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/vendre/maison"
              className="inline-flex items-center justify-center rounded-full h-12 px-8 bg-primary text-primary-foreground hover:bg-primary-hover text-sm font-medium transition-colors"
            >
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
