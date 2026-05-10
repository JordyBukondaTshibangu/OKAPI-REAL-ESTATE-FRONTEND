import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — Okapi Real Estate",
};

const sections = [
  {
    title: "1. Acceptation des conditions",
    body: `En accédant au site Okapi Real Estate (ci-après « le Site »), vous acceptez pleinement et sans réserve les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Site.`,
  },
  {
    title: "2. Description des services",
    body: `Okapi Real Estate est une plateforme en ligne permettant la mise en relation entre particuliers et professionnels de l'immobilier en République Démocratique du Congo. Nous proposons la publication d'annonces immobilières, la recherche de biens, et des outils d'aide à la décision.`,
  },
  {
    title: "3. Création de compte",
    body: `Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous vous engagez à fournir des informations exactes et à maintenir la confidentialité de vos identifiants. Vous êtes responsable de toute activité effectuée depuis votre compte.`,
  },
  {
    title: "4. Publication d'annonces",
    body: `Les annonces publiées doivent être exactes, légales et correspondre à des biens réels. Okapi Real Estate se réserve le droit de supprimer toute annonce frauduleuse, trompeuse ou contraire aux lois en vigueur en RDC. Les annonceurs sont seuls responsables du contenu qu'ils publient.`,
  },
  {
    title: "5. Propriété intellectuelle",
    body: `Tous les contenus du Site (textes, images, logos, graphismes) sont la propriété de Okapi Real Estate ou de ses partenaires. Toute reproduction, modification ou utilisation commerciale sans autorisation préalable est strictement interdite.`,
  },
  {
    title: "6. Limitation de responsabilité",
    body: `Okapi Real Estate ne garantit pas l'exactitude des annonces publiées par les tiers. Notre responsabilité ne peut être engagée en cas de dommage résultant d'une transaction entre utilisateurs. Nous recommandons de vérifier tous les éléments d'une annonce avant tout engagement.`,
  },
  {
    title: "7. Modification des conditions",
    body: `Okapi Real Estate se réserve le droit de modifier les présentes conditions à tout moment. Les modifications seront notifiées sur le Site. La poursuite de l'utilisation du Site après notification constitue une acceptation des nouvelles conditions.`,
  },
  {
    title: "8. Droit applicable",
    body: `Les présentes conditions sont régies par le droit de la République Démocratique du Congo. Tout litige sera soumis aux juridictions compétentes de Kinshasa.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="bg-navy text-white py-20 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
          Mentions légales
        </p>
        <h1 className="text-4xl font-semibold mb-4">
          Conditions générales d&apos;utilisation
        </h1>
        <p className="text-white/70 text-sm">
          Dernière mise à jour : 1er janvier 2025
        </p>
      </section>

      <section className="bg-background py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-base font-semibold text-text-dark mb-3">
                {s.title}
              </h2>
              <p className="text-sm text-text-light leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}

          <div className="border-t border-border pt-8">
            <p className="text-xs text-muted-foreground">
              Pour toute question, contactez-nous à{" "}
              <a
                href="mailto:legal@okapiimmobilier.cd"
                className="text-primary hover:underline"
              >
                legal@okapiimmobilier.cd
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
