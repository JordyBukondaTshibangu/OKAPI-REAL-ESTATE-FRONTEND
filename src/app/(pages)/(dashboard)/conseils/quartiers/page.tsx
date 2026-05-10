import { Button } from "@/shared/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Infos quartiers — Okapi Real Estate",
  description:
    "Découvrez les quartiers de Kinshasa : ambiance, prix de l'immobilier, avantages et inconvénients pour choisir où habiter ou investir.",
};

const neighborhoods = [
  {
    name: "Gombe",
    tag: "Centre des affaires",
    priceRange: "1 500 – 8 000 $/mois (loc.) · 150 000 – 800 000 $ (achat)",
    description:
      "La Gombe est le cœur diplomatique, commercial et financier de Kinshasa. On y trouve ambassades, sièges de banques, hôtels cinq étoiles, restaurants internationaux et boutiques haut de gamme. C'est le quartier le plus cher et le plus prisé de la ville.",
    pros: [
      "Concentration maximale de services et commodités",
      "Sécurité renforcée, présence diplomatique",
      "Accès rapide aux principaux axes routiers",
      "Idéal pour expatriés et cadres supérieurs",
    ],
    cons: [
      "Loyers et prix d'achat les plus élevés de Kinshasa",
      "Trafic dense en semaine",
      "Peu de grandes propriétés résidentielles disponibles",
    ],
    color: "border-primary",
  },
  {
    name: "Ngaliema",
    tag: "Résidentiel premium",
    priceRange: "800 – 4 000 $/mois (loc.) · 100 000 – 500 000 $ (achat)",
    description:
      "Ngaliema s'étend sur les hauteurs de Kinshasa avec des propriétés spacieuses et une vue dégagée sur le fleuve Congo. Quartier résidentiel par excellence, il accueille de nombreuses villas de diplomates, de personnalités et d'expatriés dans un cadre verdoyant et relativement calme.",
    pros: [
      "Grandes propriétés avec jardins",
      "Calme et verdure, air plus frais en altitude",
      "Vue sur le fleuve depuis les points hauts",
      "Communauté internationale bien établie",
    ],
    cons: [
      "Éloignement du centre-ville (30–60 min en heure de pointe)",
      "Voirie parfois difficile en saison des pluies",
      "Dépendance forte à la voiture personnelle",
    ],
    color: "border-secondary",
  },
  {
    name: "Limete",
    tag: "Dynamique & mixte",
    priceRange: "400 – 2 000 $/mois (loc.) · 60 000 – 300 000 $ (achat)",
    description:
      "Limete est un quartier populaire à forte densité commerciale, idéalement situé entre le centre et les quartiers populaires de l'est. Le secteur industriel et les quartiers résidentiels y cohabitent. Limete attire une classe moyenne dynamique et de nombreux commerçants.",
    pros: [
      "Bon rapport qualité-prix",
      "Forte activité commerciale et accès aux marchés",
      "Communauté diversifiée et animée",
      "Plusieurs écoles et centres de santé",
    ],
    cons: [
      "Trafic et bruit importants en journée",
      "Certaines zones inondables en saison des pluies",
      "Qualité variable selon le sous-quartier",
    ],
    color: "border-primary",
  },
  {
    name: "Lemba",
    tag: "Universitaire & populaire",
    priceRange: "150 – 600 $/mois (loc.) · 25 000 – 120 000 $ (achat)",
    description:
      "Lemba est l'une des communes les plus peuplées de Kinshasa. Quartier à forte densité estudiantine (UNIKIN y est implantée), il propose des logements accessibles et une vie de quartier animée. C'est un choix privilégié pour les familles à revenus intermédiaires et les étudiants.",
    pros: [
      "Prix parmi les plus accessibles",
      "Proximité de l'Université de Kinshasa",
      "Vie de quartier animée, nombreux commerces locaux",
      "Bonnes connexions vers le reste de la ville",
    ],
    cons: [
      "Infrastructure parfois déficiente",
      "Densité élevée, manque d'espaces verts",
      "Délestage électrique fréquent",
    ],
    color: "border-secondary",
  },
  {
    name: "Kintambo",
    tag: "Historique & calme",
    priceRange: "300 – 1 200 $/mois (loc.) · 40 000 – 180 000 $ (achat)",
    description:
      "Kintambo est l'un des plus anciens quartiers de Kinshasa, avec une forte identité culturelle. Situé non loin du fleuve et du Parc de la Vallée, il mêle maisons de caractère, espace et calme relatif. Le quartier est apprécié pour son ambiance villageoise au cœur de la métropole.",
    pros: [
      "Ambiance calme et communautaire",
      "Logements avec terrain et jardins",
      "Proximité du fleuve Congo",
      "Prix intermédiaires et négociables",
    ],
    cons: [
      "Voirie limitée, difficile d'accès en saison des pluies",
      "Moins de commerces modernes",
      "Transports en commun moins fréquents",
    ],
    color: "border-primary",
  },
  {
    name: "Bandalungwa",
    tag: "Familial & accessible",
    priceRange: "200 – 800 $/mois (loc.) · 30 000 – 150 000 $ (achat)",
    description:
      "Bandalungwa est un quartier résidentiel populaire, réputé pour son cadre de vie familial et son accessibilité. Les maisons individuelles avec cour sont prédominantes. C'est un quartier stable, prisé par les familles congolaises de la classe moyenne qui y vivent depuis plusieurs générations.",
    pros: [
      "Esprit communautaire fort",
      "Maisons individuelles avec espace extérieur",
      "Prix d'achat accessibles",
      "Nombreuses écoles et paroisses",
    ],
    cons: [
      "Peu d'offre d'appartements modernes",
      "Infrastructure électrique vieillissante",
      "Trafic sur les axes principaux",
    ],
    color: "border-secondary",
  },
  {
    name: "Lingwala",
    tag: "Culturel & en mutation",
    priceRange: "350 – 1 500 $/mois (loc.) · 50 000 – 220 000 $ (achat)",
    description:
      "Lingwala est un quartier aux multiples facettes, connu pour sa scène culturelle vibrante (concerts, bars, restaurants) et sa proximité du stade des Martyrs. Le quartier est en pleine gentrification, avec de nouveaux immeubles résidentiels qui y voient le jour aux côtés de maisons traditionnelles.",
    pros: [
      "Vie nocturne et culturelle riche",
      "Bien desservi par les transports en commun",
      "Marché immobilier en hausse, bon potentiel",
      "Proximité du centre-ville",
    ],
    cons: [
      "Bruit important, surtout le week-end",
      "Qualité de l'offre très hétérogène",
      "Certaines zones à sécurité variable",
    ],
    color: "border-primary",
  },
  {
    name: "Kalamu",
    tag: "Populaire & authentique",
    priceRange: "100 – 500 $/mois (loc.) · 20 000 – 100 000 $ (achat)",
    description:
      "Kalamu est l'une des communes les plus vivantes et authentiques de Kinshasa, avec une forte identité culturelle congolaise. Le marché de Gambela et la place du 24 novembre y sont emblématiques. Idéal pour qui cherche une immersion totale dans la vie kinoise à un coût très abordable.",
    pros: [
      "Prix les plus bas de la ville",
      "Vie locale authentique et intense",
      "Accès aux grands marchés de la ville",
      "Forte solidarité communautaire",
    ],
    cons: [
      "Infrastructure limitée (eau, électricité, routes)",
      "Moins adapté aux expatriés sans accompagnement local",
      "Offre immobilière formelle réduite",
    ],
    color: "border-secondary",
  },
];

export default function QuartiersPage() {
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
            <Link
              href="/conseils"
              className="hover:text-white transition-colors"
            >
              Conseils
            </Link>
            <span>/</span>
            <span className="text-white">Infos quartiers</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-4">
            8 quartiers analysés
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Infos quartiers de Kinshasa
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Chaque quartier de Kinshasa a sa propre personnalité, ses prix et
            ses avantages. Découvrez notre analyse détaillée pour choisir où
            vivre ou investir.
          </p>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-muted py-8 px-6 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-xl shadow-md h-48 flex items-center justify-center border border-border">
            <div className="text-center text-muted-foreground">
              <div className="text-3xl mb-2">🗺</div>
              <p className="text-sm font-medium">
                Carte interactive de Kinshasa
              </p>
              <p className="text-xs">Bientôt disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhoods grid */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {neighborhoods.map((hood) => (
              <div
                key={hood.name}
                className={`bg-card rounded-xl shadow-md p-6 border-t-4 ${hood.color}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-bold text-foreground">
                        {hood.name}
                      </h2>
                      <span className="text-xs font-medium bg-accent text-accent-foreground px-3 py-1 rounded-full">
                        {hood.tag}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {hood.priceRange}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-5">
                  {hood.description}
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
                      <span className="text-green-500">+</span> Points forts
                    </h3>
                    <ul className="space-y-1">
                      {hood.pros.map((pro, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-green-500 mt-0.5 flex-shrink-0">
                            ✓
                          </span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
                      <span className="text-red-400">−</span> Points de
                      vigilance
                    </h3>
                    <ul className="space-y-1">
                      {hood.cons.map((con, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-red-400 mt-0.5 flex-shrink-0">
                            •
                          </span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-muted">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Vous avez trouvé votre quartier idéal ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Explorez les annonces disponibles dans votre commune préférée ou
            contactez un agent local pour une visite personnalisée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/acheter">Voir les biens à vendre</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/louer">Voir les locations</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
