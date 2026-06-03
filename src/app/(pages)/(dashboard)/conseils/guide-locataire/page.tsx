import { Button } from "@/shared/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide du locataire — Okapi Real Estate",
  description:
    "Tout ce qu'il faut savoir pour louer un bien immobilier à Kinshasa : contrat, charges, droits et obligations avec Okapi Real Estate.",
};

const sections = [
  {
    number: "01",
    title: "Définir vos besoins",
    content: [
      "Avant de commencer vos recherches, établissez une liste claire de vos critères : nombre de chambres, quartier souhaité, budget mensuel maximum, nécessité d'un parking, présence d'un groupe électrogène ou d'un forage. Plus vos critères sont précis, plus vos recherches seront efficaces.",
      "À Kinshasa, il est également important de définir si vous préférez une location meublée ou non meublée. Les expatriés et les personnes en mission courte optent souvent pour le meublé (loyers plus élevés mais clés en main), tandis que les résidents long terme préfèrent le non-meublé pour personnaliser leur espace.",
      "Pensez à anticiper votre durée de séjour : les propriétaires kinois préfèrent généralement des contrats d'au moins 12 mois. Si vous avez besoin d'une location courte durée (moins de 6 mois), orientez-vous vers des résidences hôtelières ou des plateformes de location flexible.",
    ],
    tip: "Conseil Okapi : Listez vos critères en ordre de priorité — essentiel, important, souhaitable — pour faciliter vos arbitrages.",
  },
  {
    number: "02",
    title: "Comprendre le marché locatif kinois",
    content: [
      "Le marché locatif kinois est libellé en dollars américains (USD). Les loyers varient très fortement selon la commune : un appartement de 2 chambres à Gombe peut coûter entre 800 et 3 000 USD par mois, contre 200 à 600 USD à Lemba ou Bandalungwa pour une superficie équivalente.",
      "Les loyers sont généralement payés trimestriellement ou semestriellement à l'avance — la pratique du paiement mensuel est rare et réservée aux résidences gérées professionnellement. Préparez-vous à mobiliser l'équivalent de 3 à 6 mois de loyer pour la caution et le premier paiement.",
      "Le marché est relativement peu réglementé : les prix sont librement fixés par les propriétaires. Cela laisse une réelle marge de négociation, surtout si vous proposez un paiement annuel en une fois — les propriétaires accordent souvent une réduction de 10 % à 20 % dans ce cas.",
    ],
    tip: "Conseil Okapi : Comparez au moins 5 biens similaires dans le même quartier avant de faire une offre.",
  },
  {
    number: "03",
    title: "Vérifier le contrat de bail",
    content: [
      "Le contrat de bail est le document fondamental qui régit votre relation avec le propriétaire. Il doit mentionner les noms et coordonnées des deux parties, la description précise du bien loué, le montant du loyer, la durée du bail, les modalités de paiement et les conditions de renouvellement ou résiliation.",
      "Attention aux clauses abusives courantes à Kinshasa : interdiction de recevoir des visiteurs, augmentation de loyer unilatérale sans préavis, clause autorisant le propriétaire à expulser sans délai légal. Faites relire le contrat par un juriste si vous avez le moindre doute.",
      "Vérifiez que le signataire du bail est bien le propriétaire légitime du bien ou son mandataire dûment autorisé. Demandez à voir le titre foncier ou une procuration notariée si vous traitez avec un intermédiaire.",
    ],
    tip: "Conseil Okapi : N'entrez jamais dans un logement sans contrat signé, même si le propriétaire promet de le fournir plus tard.",
  },
  {
    number: "04",
    title: "Les charges locatives",
    content: [
      "Au loyer de base s'ajoutent diverses charges à clarifier avant la signature. Les principales sont : l'électricité (SNEL et/ou groupe électrogène avec carburant), l'eau (REGIDESO et/ou pompe à forage), la sécurité (gardien), l'entretien des parties communes, et parfois les frais de gestion d'une résidence.",
      "Dans certaines résidences modernes, les charges sont forfaitisées dans un montant mensuel fixe (service charge). Cela simplifie la gestion mais peut représenter 100 à 400 USD supplémentaires par mois. Vérifiez exactement ce que ce montant couvre.",
      "Demandez les relevés des factures des 3 à 6 derniers mois pour évaluer le coût réel des charges avant de signer. Un beau logement avec des charges élevées peut rapidement dépasser votre budget.",
    ],
    tip: "Conseil Okapi : Budget total = loyer + charges + entretien courant. Ne jamais se limiter au loyer seul.",
  },
  {
    number: "05",
    title: "L'état des lieux",
    content: [
      "L'état des lieux est un document descriptif de l'état du bien au moment de votre entrée. Il doit être réalisé contradictoirement — en présence du propriétaire (ou de son représentant) et du locataire — et signé par les deux parties. Sans état des lieux, la restitution de la caution devient une source de litige fréquente.",
      "Documentez minutieusement l'état de chaque pièce, équipement, mur, sol, fenêtre, robinetterie, installation électrique et sanitaire. Prenez des photos datées de chaque anomalie existante (taches, fissures, équipements défectueux) et annexez-les au contrat.",
      "Un état des lieux de sortie sera réalisé à la fin du bail. La différence entre les deux états permettra de déterminer si des retenues sur caution sont justifiées. Le locataire n'est tenu de rembourser que les dégradations qui lui sont imputables, pas l'usure normale.",
    ],
    tip: "Conseil Okapi : Photographiez chaque pièce sous plusieurs angles le jour de l'entrée — c'est votre protection en cas de litige à la sortie.",
  },
  {
    number: "06",
    title: "Vos droits et obligations",
    content: [
      "En tant que locataire, vous avez le droit de jouir paisiblement du logement loué, de recevoir des quittances de loyer, d'être informé de tout changement de propriétaire, et de recevoir un préavis raisonnable (généralement 30 à 90 jours selon le contrat) avant toute demande de départ.",
      "Vos obligations principales sont le paiement du loyer aux dates convenues, l'entretien courant du logement (peinture légère, petites réparations, nettoyage), le respect du voisinage et l'utilisation du bien conformément à sa destination (habitation, non exercice d'activité commerciale sauf autorisation).",
      "En cas de conflit avec votre propriétaire, essayez d'abord une médiation amiable. Si cela échoue, vous pouvez saisir le tribunal de paix compétent dans votre ressort territorial. Okapi Real Estate propose également un service de médiation gratuit pour ses locataires.",
    ],
    tip: "Conseil Okapi : Conservez toutes les quittances de loyer et correspondances avec votre propriétaire dans un dossier dédié.",
  },
];

export default function GuideLocatairePage() {
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
            <span className="text-white">Guide du locataire</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white dark:bg-card/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-4">
            Guide complet
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Guide du locataire
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Louer à Kinshasa sans mauvaise surprise. Ce guide vous explique
            comment trouver le bon logement, signer un bail solide et connaître
            vos droits.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Intro */}
          <div className="bg-accent border border-border rounded-xl p-6 mb-12">
            <p className="text-foreground leading-relaxed">
              Le marché locatif kinois est vivant mais peu standardisé. Les
              pratiques varient selon les propriétaires et les quartiers. Ce
              guide vous donne les clés pour naviguer avec confiance et éviter
              les pièges les plus courants.
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

          {/* Price ranges */}
          <div className="mt-12 bg-card rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Fourchettes de loyers à Kinshasa (2025)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 text-foreground font-semibold">
                      Quartier
                    </th>
                    <th className="text-right py-3 pr-4 text-foreground font-semibold">
                      Studio
                    </th>
                    <th className="text-right py-3 pr-4 text-foreground font-semibold">
                      2 ch.
                    </th>
                    <th className="text-right py-3 text-foreground font-semibold">
                      3+ ch.
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    {
                      zone: "Gombe",
                      studio: "400–800",
                      deux: "800–3 000",
                      trois: "1 500–5 000+",
                    },
                    {
                      zone: "Ngaliema",
                      studio: "300–600",
                      deux: "600–2 000",
                      trois: "1 000–4 000",
                    },
                    {
                      zone: "Limete",
                      studio: "200–400",
                      deux: "400–1 200",
                      trois: "700–2 500",
                    },
                    {
                      zone: "Lemba / Kalamu",
                      studio: "100–200",
                      deux: "200–600",
                      trois: "400–1 000",
                    },
                    {
                      zone: "Bandalungwa",
                      studio: "150–300",
                      deux: "300–800",
                      trois: "500–1 500",
                    },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="py-3 pr-4 font-medium text-foreground">
                        {row.zone}
                      </td>
                      <td className="py-3 pr-4 text-right text-muted-foreground">
                        {row.studio} $
                      </td>
                      <td className="py-3 pr-4 text-right text-muted-foreground">
                        {row.deux} $
                      </td>
                      <td className="py-3 text-right text-muted-foreground">
                        {row.trois} $
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * Loyers mensuels en USD. Données indicatives basées sur les
              annonces Okapi Real Estate — les prix réels peuvent varier.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-muted">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Trouvez votre logement à Kinshasa
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Des centaines d&apos;annonces de location vérifiées dans tous les
            quartiers de Kinshasa, avec des agents disponibles pour vous
            accompagner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/louer">Voir les locations</Link>
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
