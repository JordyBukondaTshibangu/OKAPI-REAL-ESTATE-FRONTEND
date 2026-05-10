import { Button } from "@/shared/components/ui/button";
import { Briefcase, Globe, Heart, Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrières — Okapi Real Estate",
  description:
    "Rejoignez l'équipe Okapi Real Estate et contribuez à transformer l'immobilier en RDC.",
};

const perks = [
  {
    icon: Heart,
    title: "Mission qui a du sens",
    body: "Aider les Congolais à trouver leur chez-soi, c'est un travail qui compte.",
  },
  {
    icon: Globe,
    title: "Impact national",
    body: "Vos contributions touchent des centaines de milliers d'utilisateurs à travers la RDC.",
  },
  {
    icon: Zap,
    title: "Croissance rapide",
    body: "Une startup en pleine expansion — vos idées prennent vie rapidement.",
  },
  {
    icon: Briefcase,
    title: "Équipe diversifiée",
    body: "Une équipe passionnée, bienveillante et tournée vers l'excellence.",
  },
];

const openings = [
  {
    title: "Développeur(se) Front-end",
    team: "Technologie",
    location: "Kinshasa (Hybride)",
    type: "CDI",
  },
  {
    title: "Développeur(se) Back-end",
    team: "Technologie",
    location: "Kinshasa (Hybride)",
    type: "CDI",
  },
  {
    title: "Chef de produit (Product Manager)",
    team: "Produit",
    location: "Kinshasa",
    type: "CDI",
  },
  {
    title: "Responsable marketing digital",
    team: "Marketing",
    location: "Kinshasa",
    type: "CDI",
  },
  {
    title: "Commercial(e) — Partenariats agences",
    team: "Commercial",
    location: "Kinshasa / Lubumbashi",
    type: "CDI",
  },
  {
    title: "Designer UI/UX",
    team: "Design",
    location: "Kinshasa (Remote possible)",
    type: "CDI",
  },
];

export default function CarreresPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-24 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
          Rejoindre l&apos;équipe
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight max-w-2xl mx-auto">
          Construisons l&apos;avenir de l&apos;immobilier congolais ensemble
        </h1>
        <p className="text-white/75 max-w-xl mx-auto text-base mb-8">
          Okapi Real Estate grandit vite et cherche des talents passionnés,
          ambitieux et prêts à changer les règles du jeu.
        </p>
        <Button variant="gold" asChild>
          <a href="#offres">Voir les offres</a>
        </Button>
      </section>

      {/* Why us */}
      <section className="bg-muted py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-text-dark">
              Pourquoi Okapi Real Estate ?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {perks.map((p) => (
              <div
                key={p.title}
                className="bg-card rounded-xl shadow-md p-6 flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-dark mb-1">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-light leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section id="offres" className="bg-background py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
              Offres d&apos;emploi
            </p>
            <h2 className="text-2xl font-semibold text-text-dark">
              Postes ouverts
            </h2>
          </div>

          <div className="space-y-4">
            {openings.map((job) => (
              <div
                key={job.title}
                className="bg-card rounded-xl shadow-md p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <h3 className="text-base font-semibold text-text-dark mb-1">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{job.team}</span>
                    <span>·</span>
                    <span>{job.location}</span>
                    <span>·</span>
                    <span className="text-primary font-medium">{job.type}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/contact">Postuler</a>
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-10">
            Vous ne trouvez pas votre poste ?{" "}
            <a
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              Envoyez-nous une candidature spontanée
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
