import { Button } from "@/shared/components/ui/button";
import { Car, Shield, Trees, Wifi } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides tours & résidences — Okapi Real Estate",
  description:
    "Découvrez les résidences sécurisées et tours résidentielles de Kinshasa.",
};

const residences = [
  {
    name: "Tour Panorama — Gombe",
    location: "Boulevard du 30 Juin, Gombe",
    type: "Tour résidentielle",
    priceRange: "3 500 – 8 000 $/mois",
    floors: 18,
    amenities: [
      "Piscine sur toit",
      "Salle de sport",
      "Concierge 24/7",
      "Parking sécurisé",
      "Groupe électrogène",
    ],
    description:
      "Résidence de prestige au cœur du quartier diplomatique. Vue panoramique sur le fleuve Congo et la ville.",
  },
  {
    name: "Résidence Les Flamboyants",
    location: "Ngaliema, Mont-Fleury",
    type: "Villa sécurisée",
    priceRange: "2 200 – 4 500 $/mois",
    floors: 2,
    amenities: [
      "Piscine privée",
      "Jardin paysager",
      "Garde 24/7",
      "Tennis",
      "Quartiers du personnel",
    ],
    description:
      "Ensemble résidentiel sécurisé de 24 villas indépendantes dans un cadre verdoyant. Idéal pour familles et expatriés.",
  },
  {
    name: "L'Immeuble du Fleuve",
    location: "Lingwala, Avenue du Fleuve",
    type: "Tour résidentielle",
    priceRange: "1 800 – 3 200 $/mois",
    floors: 12,
    amenities: [
      "Vue sur le Congo",
      "Ascenseur",
      "Sécurité électronique",
      "Parking couvert",
      "Local vélos",
    ],
    description:
      "Tour moderne offrant des appartements meublés et non meublés avec vue dégagée sur le fleuve Congo.",
  },
  {
    name: "Cité Verte de Kintambo",
    location: "Kintambo, Avenue des Jardins",
    type: "Résidence fermée",
    priceRange: "1 200 – 2 800 $/mois",
    floors: 3,
    amenities: [
      "Piscine communautaire",
      "Aire de jeux",
      "Gardiennage",
      "Eau autonome",
      "Fibr optique",
    ],
    description:
      "Résidence familiale paisible avec 48 appartements et villas dans un environnement végétalisé.",
  },
  {
    name: "Towers Gombe Business",
    location: "Avenue de la Justice, Gombe",
    type: "Résidence d'affaires",
    priceRange: "2 800 – 6 500 $/mois",
    floors: 22,
    amenities: [
      "Salle de conférence",
      "Gym",
      "Restaurant",
      "Business center",
      "Navette aéroport",
    ],
    description:
      "Tour mixte résidentielle et d'affaires, idéale pour les professionnels en déplacement prolongé.",
  },
  {
    name: "Résidence Mapendo",
    location: "Bandalungwa, Route Matadi",
    type: "Résidence familiale",
    priceRange: "800 – 1 800 $/mois",
    floors: 4,
    amenities: [
      "Sécurité",
      "Eau courante",
      "Parking",
      "Espace commun",
      "Groupe électrogène",
    ],
    description:
      "Résidence accessible pour familles congolaises et primo-accédants. Environnement calme et bien desservi.",
  },
];

const amenityIcons: Record<string, React.ElementType> = {
  Piscine: Trees,
  Sécurité: Shield,
  Internet: Wifi,
  Parking: Car,
};

export default function ToursResidencesPage() {
  return (
    <>
      <section className="bg-navy text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="text-white/60 hover:text-white text-sm mb-8 inline-block transition-colors"
          >
            ← Accueil
          </Link>
          <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
            Conseils
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Guides tours & résidences
          </h1>
          <p className="text-white/75 text-base max-w-2xl">
            Découvrez les tours résidentielles et résidences sécurisées de
            Kinshasa — de la résidence d&apos;affaires haut de gamme au complexe
            familial abordable.
          </p>
        </div>
      </section>

      <section className="bg-muted py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: "Résidences référencées", value: residences.length },
            { label: "Quartiers couverts", value: "6" },
            { label: "Fourchette de prix", value: "800 – 8 000 $" },
            { label: "Types de biens", value: "3" },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-card rounded-xl p-4 shadow-sm">
              <p className="text-xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            Résidences sélectionnées
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {residences.map((r) => (
              <div key={r.name} className="bg-card rounded-xl shadow-md p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-semibold bg-accent text-primary px-2 py-1 rounded-full">
                      {r.type}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mt-2">
                      {r.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {r.location}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      Fourchette de prix
                    </p>
                    <p className="text-base font-bold text-primary">
                      {r.priceRange}
                    </p>
                    {r.floors && (
                      <p className="text-xs text-muted-foreground">
                        {r.floors} niveaux
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-text-light leading-relaxed mb-4">
                  {r.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {r.amenities.map((a) => (
                    <span
                      key={a}
                      className="text-xs px-3 py-1 bg-muted rounded-full text-foreground/75"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-14 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-3">Trouver votre résidence</h2>
        <p className="text-primary-foreground/80 text-sm mb-6 max-w-lg mx-auto">
          Nos agents spécialisés peuvent vous aider à trouver la résidence qui
          correspond à votre style de vie.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="gold" asChild>
            <Link href="/louer">Voir les locations</Link>
          </Button>
          <Button
            variant="outline"
            className="border-white/40 text-white hover:bg-white dark:bg-card/10"
            asChild
          >
            <Link href="/agents">Parler à un agent</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
