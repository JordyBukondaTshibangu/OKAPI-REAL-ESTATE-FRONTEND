import { Button } from "@/shared/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides communautaires — Okapi Real Estate",
  description:
    "Conseils immobiliers sur mesure pour les expatriés, primo-accédants, investisseurs et retraités à Kinshasa — Okapi Real Estate.",
};

const communities = [
  {
    id: "expatries",
    label: "Expatriés",
    icon: "✈️",
    subtitle: "Vous venez d'arriver à Kinshasa ou préparez votre installation",
    intro:
      "Kinshasa accueille une communauté internationale significative : représentants d'ONG, diplomates, cadres d'entreprises multinationales et consultants en mission. La ville offre une gamme de logements adaptés à vos exigences, à condition de connaître les bons réflexes.",
    tips: [
      {
        title: "Commencez par une location courte durée",
        body: "À votre arrivée, privilégiez un logement temporaire (résidence hôtelière, appartement meublé à la semaine) le temps de visiter les quartiers et de comprendre la ville. Ne signez pas un bail d'un an sur photos.",
      },
      {
        title: "Ciblez Gombe, Ngaliema ou les résidences sécurisées",
        body: "Ces zones offrent le niveau de confort et de sécurité comparable aux standards internationaux : eau chaude, groupe électrogène permanent, connexion internet stable, service de sécurité 24h/24.",
      },
      {
        title: "Négociez un loyer USD avec contrat anglais/français",
        body: "Faites rédiger le contrat en français ou en anglais et exigez que le loyer soit exprimé en USD. Évitez les accords verbaux, aussi symphatiques que soit le propriétaire.",
      },
      {
        title: "Rejoignez les réseaux d'expatriés",
        body: "Les groupes Facebook et WhatsApp dédiés aux expatriés à Kinshasa sont des mines d'information : recommandations de logements, agents fiables, quartiers à éviter. Demandez à votre employeur ou à votre ambassade les contacts communautaires.",
      },
      {
        title: "Budget de vie complet",
        body: "Intégrez dans votre budget : loyer + charges (électricité groupe, eau, internet, sécurité) + transport (véhicule recommandé) + école internationale si vous avez des enfants. Le coût total peut rapidement dépasser 3 000–5 000 USD/mois.",
      },
      {
        title: "Faites appel à un agent relocation",
        body: "Un agent relocation prend en charge la recherche de logement, les démarches administratives, l'ouverture de comptes bancaires et l'introduction dans la communauté locale. Ce service est souvent partiellement pris en charge par l'employeur.",
      },
    ],
    quartiers: ["Gombe", "Ngaliema", "Golf (Gombe)", "Montana (Ngaliema)"],
  },
  {
    id: "primo-accedants",
    label: "Primo-accédants",
    icon: "🏠",
    subtitle: "Vous achetez votre premier bien immobilier à Kinshasa",
    intro:
      "Devenir propriétaire pour la première fois est une étape décisive dans la vie. À Kinshasa, cela représente un investissement important qui mérite une préparation sérieuse. Les primo-accédants ont tout intérêt à bien s'informer pour éviter les erreurs classiques.",
    tips: [
      {
        title: "Commencez par un bien plus petit que votre idéal",
        body: "Un appartement de 2 chambres bien situé est souvent plus judicieux qu'une villa en périphérie. Vous pourrez le revendre avec une plus-value et utiliser ce capital pour accéder à un bien plus grand.",
      },
      {
        title: "Épargnez 20–30 % du prix en apport personnel",
        body: "Les banques kinoisies financent rarement au-delà de 70–80 % de la valeur du bien. Constituez votre apport avant de commencer à chercher, cela renforce aussi votre position de négociation.",
      },
      {
        title: "Faites vérifier le titre foncier par un professionnel",
        body: "Ne sautez jamais cette étape, même si le vendeur vous semble honnête. Les litiges fonciers à Kinshasa sont fréquents et coûteux. Un avocat spécialisé vous coûtera 200–500 USD mais peut vous éviter de perdre des dizaines de milliers.",
      },
      {
        title: "Visitez minimum 5 biens avant de décider",
        body: "Prenez le temps de comparer. Le premier bien qui vous enthousiasme n'est pas nécessairement le meilleur choix. Chaque visite vous apprend quelque chose sur le marché local.",
      },
      {
        title: "Pensez à la revenabilité dès l'achat",
        body: "Un bien facile à revendre est un bien bien situé, avec un titre clair et dans un quartier en développement. N'achetez pas uniquement avec votre cœur — pensez à la demande future.",
      },
      {
        title: "Ne négligez pas les coûts d'entretien",
        body: "Un logement au Congo demande un entretien actif : groupe électrogène (carburant, maintenance), pompe à eau, sécurité. Ces coûts récurrents peuvent représenter 5–10 % du prix du bien par an.",
      },
    ],
    quartiers: ["Limete", "Bandalungwa", "Ngiri-Ngiri", "Kintambo"],
  },
  {
    id: "investisseurs",
    label: "Investisseurs",
    icon: "📈",
    subtitle:
      "Vous cherchez à développer ou diversifier votre portefeuille immobilier",
    intro:
      "Kinshasa est l'une des villes africaines offrant les rendements locatifs bruts les plus attractifs : entre 8 % et 15 % selon le secteur. La croissance démographique de la ville (estimée à plus de 15 millions d'habitants) génère une demande structurelle qui soutient les prix.",
    tips: [
      {
        title: "Ciblez les quartiers à forte demande locative",
        body: "Gombe, Limete et Ngaliema affichent des taux d'occupation supérieurs à 90 % sur les biens de qualité. Les logements meublés destinés aux expatriés et cadres offrent les meilleurs rendements par mètre carré.",
      },
      {
        title: "Préférez les petites surfaces pour la location",
        body: "Les studios et appartements de 2 chambres meublés offrent les meilleurs rendements nets (10–15 %). Les grandes villas sont plus difficiles à louer et à entretenir.",
      },
      {
        title: "Diversifiez vos secteurs",
        body: "Ne concentrez pas tous vos investissements dans le même quartier. Un portefeuille équilibré entre Gombe (rendement élevé, prix fort) et Limete ou Ngaliema (prix plus modérés, demande solide) réduit votre risque global.",
      },
      {
        title: "Sécurisez la gestion locative",
        body: "La gestion à distance d'un bien à Kinshasa est complexe. Confiez votre bien à une agence de gestion locative professionnelle. Okapi Real Estate propose un service de gestion clé en main (collecte des loyers, entretien, relation locataire).",
      },
      {
        title: "Attention aux risques spécifiques au marché RDC",
        body: "Instabilité politique, risques de change, litiges fonciers, défauts de paiement des locataires — diversifiez vos risques, constituez une réserve de trésorerie et assurez vos biens contre l'incendie et les dommages.",
      },
      {
        title: "Profitez des opportunités de réhabilitation",
        body: "Les biens anciens dans de bons emplacements (Gombe, Kintambo, Lingwala) peuvent être acquis à prix réduit et rénovés pour un rendement de 12–18 % après travaux. Le marché de la réhabilitation est encore peu compétitif.",
      },
    ],
    quartiers: ["Gombe", "Ngaliema", "Limete industriel", "Lingwala"],
  },
  {
    id: "retraites",
    label: "Retraités",
    icon: "🌿",
    subtitle:
      "Vous préparez votre retraite ou cherchez un cadre de vie serein à Kinshasa",
    intro:
      "Kinshasa offre aux retraités une qualité de vie singulière : chaleur humaine, dynamisme culturel, coût de la vie compétitif (hors logement haut de gamme) et une diaspora congolaise rentrée au pays après des décennies à l'étranger. Le bon quartier et le bon type de bien font toute la différence.",
    tips: [
      {
        title: "Choisissez un quartier accessible et sécurisé",
        body: "Ngaliema et Kintambo offrent un cadre de vie plus calme, avec de grands espaces et une communauté stable. Évitez les zones à forte densité si vous recherchez la tranquillité.",
      },
      {
        title: "Optez pour un bien de plain-pied ou avec ascenseur",
        body: "Les escaliers sont souvent problématiques avec l'âge. Si vous achetez en immeuble, vérifiez la fiabilité de l'ascenseur (et la disponibilité du générateur pour le faire fonctionner en cas de coupure SNEL).",
      },
      {
        title: "Proximité des soins médicaux",
        body: "Vérifiez la distance à une clinique ou un hôpital de confiance. La Clinique Ngaliema, l'Hôpital du Cinquantenaire et la Clinique Monkole sont des références. Idéalement, restez dans un rayon de 15 minutes de l'une d'elles.",
      },
      {
        title: "Anticipez les coupures de courant",
        body: "Un groupe électrogène fiable et une citerne d'eau (forage ou cuve) sont indispensables pour vivre confortablement. Intégrez ces équipements dans vos critères de sélection ou dans votre budget de travaux.",
      },
      {
        title: "Envisagez une résidence avec services",
        body: "Certaines résidences sécurisées à Kinshasa proposent des services intégrés (sécurité 24h, jardinage, entretien, groupe électrogène géré). Ce confort supplémentaire a un prix mais est idéal pour un retraité souhaitant déléguer la gestion quotidienne.",
      },
      {
        title: "Testez avant d'acheter",
        body: "Si vous revenez après de longues années à l'étranger, louez pendant 6 à 12 mois avant d'acheter. La ville a beaucoup changé : vous aurez ainsi le temps de vous réapproprier les réalités locales et de faire le meilleur choix.",
      },
    ],
    quartiers: ["Ngaliema", "Kintambo", "Golf", "Mont Ngafula"],
  },
];

export default function CommunautesPage() {
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
            <span className="text-white">Guides communautaires</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white dark:bg-card/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-4">
            4 profils d&apos;acheteurs
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Guides communautaires
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Chaque profil a ses besoins, ses priorités et ses opportunités sur
            le marché kinois. Retrouvez les conseils taillés sur mesure pour
            votre situation.
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <section className="bg-muted py-6 px-6 border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {communities.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="flex items-center gap-2 text-sm font-medium text-foreground bg-card border border-border px-4 py-2 rounded-full hover:bg-accent hover:border-primary transition-colors"
              >
                <span>{c.icon}</span>
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Community sections */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-4xl mx-auto space-y-20">
          {communities.map((community, idx) => (
            <div key={community.id} id={community.id}>
              {/* Section header */}
              <div className="flex items-start gap-4 mb-8">
                <div className="text-4xl flex-shrink-0">{community.icon}</div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-1">
                    {community.label}
                  </h2>
                  <p className="text-muted-foreground">{community.subtitle}</p>
                </div>
              </div>

              {/* Intro card */}
              <div
                className={`bg-card rounded-xl shadow-md p-6 mb-8 border-l-4 ${
                  idx % 2 === 0 ? "border-primary" : "border-secondary"
                }`}
              >
                <p className="text-muted-foreground leading-relaxed">
                  {community.intro}
                </p>
              </div>

              {/* Tips grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {community.tips.map((tip, i) => (
                  <div key={i} className="bg-card rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <h3 className="font-semibold text-foreground">
                        {tip.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tip.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recommended neighborhoods */}
              <div className="bg-accent border border-border rounded-xl p-4 flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-foreground">
                  Quartiers recommandés :
                </span>
                {community.quartiers.map((q) => (
                  <span
                    key={q}
                    className="text-xs font-medium bg-primary text-white px-3 py-1 rounded-full"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-muted">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Votre profil, votre projet, nos experts
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Quel que soit votre profil, nos conseillers Okapi Real Estate
            connaissent les spécificités de votre situation et peuvent vous
            guider vers les meilleures opportunités à Kinshasa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/acheter">Explorer les annonces</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Prendre rendez-vous</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
