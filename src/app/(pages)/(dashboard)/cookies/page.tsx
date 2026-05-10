import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique des cookies — Okapi Real Estate",
};

const types = [
  {
    name: "Cookies essentiels",
    desc: "Indispensables au fonctionnement du Site. Ils permettent la navigation, la connexion à votre compte et la sécurité. Ils ne peuvent pas être désactivés.",
    required: true,
  },
  {
    name: "Cookies de performance",
    desc: "Collectent des données anonymisées sur l'utilisation du Site (pages visitées, durée de session) afin d'améliorer nos services.",
    required: false,
  },
  {
    name: "Cookies de personnalisation",
    desc: "Mémorisent vos préférences (langue, région, critères de recherche) pour personnaliser votre expérience.",
    required: false,
  },
  {
    name: "Cookies publicitaires",
    desc: "Utilisés pour vous proposer des annonces pertinentes sur Okapi Real Estate et sur des sites tiers partenaires.",
    required: false,
  },
];

export default function CookiesPage() {
  return (
    <>
      <section className="bg-navy text-white py-20 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
          Cookies
        </p>
        <h1 className="text-4xl font-semibold mb-4">Politique des cookies</h1>
        <p className="text-white/70 text-sm">
          Dernière mise à jour : 1er janvier 2025
        </p>
      </section>

      <section className="bg-background py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4 mb-10">
            <p className="text-sm text-text-light leading-relaxed">
              Okapi Real Estate utilise des cookies et technologies similaires
              pour améliorer votre expérience de navigation, analyser notre
              trafic et personnaliser le contenu. Un cookie est un petit fichier
              texte stocké sur votre appareil lors de votre visite.
            </p>
            <p className="text-sm text-text-light leading-relaxed">
              En continuant à utiliser le Site, vous acceptez l&apos;utilisation
              des cookies tels que décrits ci-dessous. Vous pouvez modifier vos
              préférences à tout moment via les paramètres de votre navigateur.
            </p>
          </div>

          <h2 className="text-base font-semibold text-text-dark mb-6">
            Types de cookies utilisés
          </h2>

          <div className="space-y-4">
            {types.map((t) => (
              <div
                key={t.name}
                className="bg-card rounded-xl shadow-md p-6 flex items-start gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-text-dark">
                      {t.name}
                    </h3>
                    {t.required && (
                      <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Obligatoire
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-light leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-8 mt-10">
            <h2 className="text-base font-semibold text-text-dark mb-3">
              Gérer vos cookies
            </h2>
            <p className="text-sm text-text-light leading-relaxed mb-4">
              Vous pouvez désactiver les cookies non essentiels depuis les
              paramètres de votre navigateur. Notez que la désactivation de
              certains cookies peut affecter le fonctionnement du Site.
            </p>
            <p className="text-xs text-muted-foreground">
              Questions ?{" "}
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
