import { Button } from "@/shared/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide du vendeur — Okapi Real Estate",
  description:
    "Maximisez la valeur de votre bien et vendez rapidement à Kinshasa grâce aux conseils d'expert d'Okapi Real Estate.",
};

const sections = [
  {
    number: "01",
    title: "Estimer votre bien",
    content: [
      "Une estimation précise est le fondement d'une vente réussie. Elle tient compte de la superficie, de l'état général du bien, du quartier, des équipements disponibles (groupe électrogène, forage, enceinte sécurisée) et des transactions récentes dans le secteur.",
      "À Kinshasa, les prix varient considérablement d'une commune à l'autre et même d'une rue à l'autre. Un appartement à Gombe peut se vendre deux à trois fois plus cher que son équivalent à Lemba pour des superficies similaires. Se baser uniquement sur le prix d'achat ou sur la rumeur locale conduit souvent à un prix inadapté.",
      "Okapi Real Estate propose une estimation professionnelle et gratuite réalisée par des agents qui connaissent parfaitement les micro-marchés kinois. Ne prenez pas de décision sans données fiables.",
    ],
    tip: "Conseil Okapi : Une surévaluation de 10 % fait fuir les acheteurs sérieux et allonge significativement les délais de vente.",
  },
  {
    number: "02",
    title: "Préparer le bien pour la vente",
    content: [
      "La première impression est déterminante. Un bien propre, bien entretenu et dépersonnalisé se vend plus vite et à un meilleur prix. Commencez par un grand nettoyage, des petites réparations (robinetterie, peinture écaillée, serrures défectueuses) et un désencombrement complet des espaces.",
      "Le home staging — l'art de mettre en valeur un bien avec un aménagement neutre et attractif — peut augmenter la perception de valeur de 5 % à 15 %. Des photos professionnelles prises en lumière naturelle sont indispensables : à Kinshasa, 80 % des acheteurs commencent leurs recherches en ligne.",
      "Assurez-vous que tous les documents juridiques sont à jour et facilement accessibles : titre foncier, reçus de taxes foncières, plans et permis de construire. Un dossier complet rassure les acheteurs et accélère la transaction.",
    ],
    tip: "Conseil Okapi : Investir 500 USD dans de petites améliorations peut générer plusieurs milliers de dollars de plus-value perçue.",
  },
  {
    number: "03",
    title: "Fixer le bon prix",
    content: [
      "Le prix de mise en vente doit refléter la valeur réelle du marché tout en laissant une marge de négociation raisonnable. À Kinshasa, il est courant que les acheteurs proposent entre 5 % et 15 % de moins que le prix affiché : anticipez cet ajustement dans votre stratégie.",
      "Évitez les prix psychologiquement bloquants : un bien affiché à 205 000 USD sera vu moins souvent qu'un bien à 199 000 USD dans les recherches en ligne. Positionnez-vous dans les fourchettes clés du marché.",
      "Révisez votre prix si vous ne recevez aucune visite après 30 jours. Le marché vous envoie un signal clair : soit le prix est trop élevé, soit la présentation doit être améliorée. Restez flexible et réactif.",
    ],
    tip: "Conseil Okapi : Un bien correctement prix se vend en moyenne trois fois plus vite qu'un bien surévalué.",
  },
  {
    number: "04",
    title: "Promouvoir votre annonce",
    content: [
      "Une promotion efficace combine plusieurs canaux : portails immobiliers en ligne (Okapi Real Estate, OLX Congo, Airbnb Business pour la location), réseaux sociaux (Facebook, WhatsApp Business, Instagram), affichage physique et réseau d'agents. À Kinshasa, le bouche-à-oreille reste un canal puissant.",
      "Rédigez une annonce claire et honnête : superficie exacte, nombre de pièces, état, équipements (groupe électrogène, pompe à eau, surveillance, parking), localisation précise avec accès routier. Évitez les termes vagues comme « beau standing » sans les justifier par des éléments concrets.",
      "Confiez votre mandat à un agent Okapi pour bénéficier de notre base d'acheteurs qualifiés et pré-filtrés, de notre outil de diffusion multi-portails et de notre suivi de performance d'annonce en temps réel.",
    ],
    tip: "Conseil Okapi : Les annonces avec au moins 8 photos de qualité reçoivent 3 fois plus de contacts que celles avec une seule photo.",
  },
  {
    number: "05",
    title: "Négocier avec les acheteurs",
    content: [
      "La négociation est une phase délicate qui requiert du sang-froid et une bonne connaissance de votre marge. Définissez à l'avance votre prix plancher — le prix minimum en-deçà duquel vous ne souhaitez pas vendre — et ne le divulguez pas.",
      "Répondez à toutes les offres, même celles qui semblent basses : une contre-proposition montre votre sérieux et maintient le dialogue ouvert. Soyez attentif aux conditions proposées par l'acheteur : un acheteur cash sans financement à obtenir est souvent préférable à un acheteur offrant un prix plus élevé mais soumis à une condition bancaire incertaine.",
      "En RDC, il est courant de négocier directement en espèces ou par virement international. Assurez-vous de la traçabilité des fonds pour vous protéger légalement et fiscalement. Votre agent Okapi peut jouer le rôle de médiateur neutre pour faciliter la négociation.",
    ],
    tip: "Conseil Okapi : Ne laissez jamais votre émotionnel prendre le dessus. Chaque concession doit être équilibrée par une contrepartie.",
  },
  {
    number: "06",
    title: "Finaliser la transaction",
    content: [
      "Une fois l'accord sur le prix et les conditions trouvé, le compromis de vente est signé. Ce document engage les deux parties et précise les délais, les conditions suspensives et les modalités de paiement. L'acheteur verse généralement un acompte de 10 % à 30 %.",
      "Le passage chez le notaire ou aux Affaires Foncières pour la signature de l'acte définitif de cession doit être planifié dans les 30 à 60 jours suivant le compromis. C'est à ce moment que vous remettez les documents originaux du titre foncier à l'acheteur.",
      "Après l'encaissement du solde du prix, remettez les clés, les badges d'accès et tous les documents techniques du bien. Pensez à informer les services publics (SNEL, REGIDESO) du changement de propriétaire et à clôturer vos abonnements.",
    ],
    tip: "Conseil Okapi : Conservez une copie certifiée de tous les actes de vente signés pendant au moins 10 ans.",
  },
];

export default function GuideVendeurPage() {
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
            <span className="text-white">Guide du vendeur</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-4">
            Guide complet
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Guide du vendeur
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Vendez votre bien au meilleur prix et dans les meilleurs délais.
            Découvrez les étapes clés pour réussir votre vente immobilière à
            Kinshasa.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Intro */}
          <div className="bg-accent border border-border rounded-xl p-6 mb-12">
            <p className="text-foreground leading-relaxed">
              Vendre un bien immobilier à Kinshasa demande une préparation
              minutieuse. Le marché est compétitif, les acheteurs sont de plus
              en plus informés et les délais de vente peuvent varier de quelques
              semaines à plusieurs mois selon la qualité de votre préparation.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section) => (
              <div
                key={section.number}
                className="bg-card rounded-xl shadow-md p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl font-bold text-secondary/30 leading-none select-none">
                    {section.number}
                  </span>
                  <h2 className="text-xl font-semibold text-foreground pt-1">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-3 mb-5">
                  {section.content.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-muted-foreground leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="bg-secondary/5 border-l-4 border-secondary rounded-r-lg px-4 py-3">
                  <p className="text-sm text-secondary-foreground font-medium">
                    {section.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Key numbers */}
          <div className="mt-12 bg-card rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Chiffres clés du marché kinois
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  value: "45 j",
                  label: "Délai moyen de vente (bien bien préparé)",
                },
                {
                  value: "8–12 %",
                  label: "Frais annexes sur le prix de vente",
                },
                { value: "80 %", label: "Acheteurs qui commencent en ligne" },
                { value: "3–5 %", label: "Honoraires d'agence standards" },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 bg-muted rounded-xl">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-muted">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Obtenez une estimation gratuite de votre bien
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Nos experts locaux analysent votre bien et vous fournissent une
            estimation précise basée sur les données réelles du marché kinois.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/vendre">Estimer mon bien</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Parler à un conseiller</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
