import { Button } from "@/shared/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide de l'acheteur — Okapi Real Estate",
  description:
    "Tout ce que vous devez savoir pour acheter un bien immobilier à Kinshasa en toute sécurité avec Okapi Real Estate.",
};

const sections = [
  {
    number: "01",
    title: "Définir votre budget",
    content: [
      "Avant toute démarche, établissez un budget réaliste en tenant compte de vos revenus, de votre épargne disponible et de votre capacité d'emprunt. À Kinshasa, la plupart des transactions immobilières se font en dollars américains (USD).",
      "Pensez également à inclure dans votre budget les frais annexes qui s'ajoutent au prix de vente : frais de notaire, droits d'enregistrement, honoraires d'agence et éventuels travaux de rénovation. Ces frais peuvent représenter entre 8 % et 12 % du prix du bien.",
      "Si vous avez recours à un crédit bancaire, consultez plusieurs institutions financières à Kinshasa (RawBank, Equity BCDC, TMB) pour comparer les taux et les conditions. Obtenez une pré-approbation écrite avant de commencer vos visites.",
    ],
    tip: "Conseil Okapi : Gardez une réserve de 10 % du prix du bien pour couvrir les imprévus après l'achat.",
  },
  {
    number: "02",
    title: "Choisir le bon quartier",
    content: [
      "Kinshasa est une ville aux multiples visages. Votre choix de quartier doit être guidé par votre mode de vie, votre lieu de travail, la présence d'écoles et l'accessibilité. Les quartiers comme Gombe, Ngaliema et Limete offrent des commodités modernes et une bonne sécurité.",
      "Évaluez la proximité des axes routiers principaux, des marchés et des services essentiels. Dans une ville souvent confrontée aux embouteillages, réduire le temps de trajet quotidien améliore significativement votre qualité de vie.",
      "Renseignez-vous sur le plan d'urbanisme local et les projets de développement prévus dans le secteur : une zone en pleine expansion peut offrir un excellent potentiel de plus-value à moyen terme.",
    ],
    tip: "Conseil Okapi : Visitez le quartier à différentes heures de la journée — matin, midi et soir — pour en avoir une vision complète.",
  },
  {
    number: "03",
    title: "Vérifier le titre foncier",
    content: [
      "La vérification juridique du titre foncier est l'étape la plus critique en RDC. Assurez-vous que le bien dispose d'un certificat d'enregistrement (CE) valide, délivré par les Affaires Foncières, et que le vendeur en est bien le titulaire légal.",
      "Méfiez-vous des ventes de terrain basées uniquement sur des attestations de vente coutumières ou des lettres d'attribution, qui ne confèrent pas de droits de propriété pleinement sécurisés. Exigez toujours un titre formel.",
      "Faites appel à un avocat spécialisé en droit foncier congolais pour effectuer un audit complet du titre : vérification d'absence de litiges, d'hypothèques ou de saisies en cours auprès du registre foncier.",
    ],
    tip: "Conseil Okapi : Ne versez aucun acompte avant d'avoir reçu confirmation écrite de la validité du titre par un professionnel qualifié.",
  },
  {
    number: "04",
    title: "Faire appel à un agent immobilier",
    content: [
      "Un agent immobilier expérimenté à Kinshasa est un allié précieux. Il connaît les prix réels du marché, dispose d'un réseau de biens non publiés et peut vous éviter de nombreuses erreurs coûteuses lors de la négociation.",
      "Choisissez un agent enregistré et disposant d'une réputation solide. Okapi Real Estate vous met en relation avec des professionnels certifiés qui respectent une charte de déontologie stricte et défendent exclusivement vos intérêts d'acheteur.",
      "L'agent s'occupe de la coordination des visites, de la vérification des documents, de la négociation du prix et du suivi de la transaction jusqu'à la signature finale — un gain de temps et de sérénité considérable.",
    ],
    tip: "Conseil Okapi : Demandez toujours un mandat écrit précisant les honoraires avant de commencer à travailler avec un agent.",
  },
  {
    number: "05",
    title: "La signature de l'acte de vente",
    content: [
      "En RDC, le transfert de propriété immobilière se formalise devant un notaire ou par acte authentifié aux Affaires Foncières. La signature du compromis de vente, ou « acte de cession », est une étape intermédiaire qui engage les deux parties.",
      "À la signature du compromis, un acompte de 10 % à 30 % du prix est généralement versé. Cet acompte est protégé par des clauses suspensives (obtention de financement, validation juridique du titre) qui vous permettent de vous retirer sans pénalité si une condition n'est pas remplie.",
      "L'acte définitif de vente est ensuite enregistré auprès du bureau d'enregistrement compétent. C'est à partir de cet enregistrement que vous devenez officiellement propriétaire. Conservez précieusement tous les originaux.",
    ],
    tip: "Conseil Okapi : Lisez intégralement chaque document avant de signer. N'hésitez pas à demander un délai de 48 heures pour faire relire par votre conseiller juridique.",
  },
  {
    number: "06",
    title: "Les frais annexes",
    content: [
      "Au-delà du prix d'achat, plusieurs frais sont à prévoir. Les droits d'enregistrement représentent généralement 2 % à 5 % de la valeur déclarée du bien. Les honoraires du notaire sont encadrés par un barème officiel et varient selon la complexité de l'acte.",
      "Les honoraires d'agence, généralement à la charge du vendeur, sont compris entre 3 % et 5 % du prix de vente. Si vous signez un mandat de recherche, les frais peuvent être partagés ou entièrement à votre charge — clarifiez ce point en amont.",
      "Enfin, prévoyez les frais de raccordement ou remise en état des services (eau, électricité SNEL, générateur), les taxes de mutation et la taxe foncière annuelle qui sera exigible dès la première année de propriété.",
    ],
    tip: "Conseil Okapi : Demandez un récapitulatif écrit de tous les frais avant la signature pour éviter toute surprise de dernière minute.",
  },
];

export default function GuideAcheteurPage() {
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
            <span className="text-white">Guide de l&apos;acheteur</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-4">
            Guide complet
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Guide de l&apos;acheteur
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Acheter un bien immobilier à Kinshasa est une décision majeure. Ce
            guide vous accompagne pas à pas, de la définition de votre budget
            jusqu&apos;à la remise des clés.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Intro */}
          <div className="bg-accent border border-border rounded-xl p-6 mb-12">
            <p className="text-foreground leading-relaxed">
              Le marché immobilier de Kinshasa est dynamique et en pleine
              croissance. Bien que les opportunités soient nombreuses, des
              précautions spécifiques au contexte local s&apos;imposent. Suivez
              chacune des étapes ci-dessous pour sécuriser votre investissement.
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
                  <span className="text-3xl font-bold text-primary/20 leading-none select-none">
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
                <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg px-4 py-3">
                  <p className="text-sm text-primary font-medium">
                    {section.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checklist */}
          <div className="mt-12 bg-card rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Checklist de l&apos;acheteur
            </h2>
            <ul className="space-y-2">
              {[
                "Budget défini et pré-approbation bancaire obtenue",
                "Quartier(s) cible(s) sélectionné(s)",
                "Agent immobilier mandaté par écrit",
                "Titre foncier vérifié par un professionnel juridique",
                "Compromis de vente relu et signé",
                "Acompte sécurisé par clauses suspensives",
                "Acte définitif enregistré aux Affaires Foncières",
                "Frais annexes réglés et reçus conservés",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-muted">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Prêt à trouver votre bien à Kinshasa ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Nos agents certifiés sont disponibles pour vous accompagner dans
            chaque étape de votre projet d&apos;achat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/acheter">Parcourir les annonces</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contacter un agent</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
