import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Okapi Real Estate",
};

const sections = [
  {
    title: "1. Responsable du traitement",
    body: `Okapi Real Estate, dont le siège social est situé Avenue du Commerce, Gombe, Kinshasa, RDC, est responsable du traitement de vos données personnelles.`,
  },
  {
    title: "2. Données collectées",
    body: `Nous collectons les données que vous nous fournissez lors de la création d'un compte (nom, prénom, adresse e-mail, numéro de téléphone), lors de la publication d'une annonce, ou lors de votre navigation sur le Site (adresse IP, type de navigateur, pages visitées).`,
  },
  {
    title: "3. Finalités du traitement",
    body: `Vos données sont utilisées pour : (i) gérer votre compte et vous fournir nos services ; (ii) vous envoyer des notifications liées à votre activité sur le Site ; (iii) améliorer notre plateforme grâce à l'analyse statistique ; (iv) vous adresser des communications commerciales si vous y avez consenti.`,
  },
  {
    title: "4. Partage des données",
    body: `Nous ne vendons pas vos données personnelles. Elles peuvent être partagées avec nos prestataires techniques (hébergement, analyse) dans le strict cadre de leurs missions, ou avec les autorités compétentes sur demande légale.`,
  },
  {
    title: "5. Conservation des données",
    body: `Vos données sont conservées pendant la durée de votre compte et jusqu'à 3 ans après sa suppression, sauf obligation légale contraire.`,
  },
  {
    title: "6. Vos droits",
    body: `Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Vous pouvez exercer ces droits en nous contactant à privacy@okapiimmobilier.cd.`,
  },
  {
    title: "7. Sécurité",
    body: `Nous mettons en œuvre des mesures techniques et organisationnelles adaptées pour protéger vos données contre tout accès non autorisé, perte ou divulgation.`,
  },
  {
    title: "8. Modifications",
    body: `Cette politique peut être mise à jour. Toute modification importante sera notifiée par e-mail ou via une bannière sur le Site.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-navy text-white py-20 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
          Vie privée
        </p>
        <h1 className="text-4xl font-semibold mb-4">
          Politique de confidentialité
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
              Contact DPO :{" "}
              <a
                href="mailto:privacy@okapiimmobilier.cd"
                className="text-primary hover:underline"
              >
                privacy@okapiimmobilier.cd
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
