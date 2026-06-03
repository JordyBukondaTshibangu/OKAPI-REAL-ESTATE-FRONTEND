import { Button } from "@/shared/components/ui/button";
import { BookOpen, GraduationCap, MapPin, Star } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides écoles & universités — Okapi Real Estate",
  description:
    "Trouvez un logement proche des meilleures écoles et universités de Kinshasa.",
};

const schools = [
  {
    name: "École Française de Kinshasa (EFK)",
    type: "École internationale",
    location: "Gombe",
    levels: "Maternelle → Terminale",
    language: "Français",
    nearbyQuarters: ["Gombe", "Ngaliema", "Lingwala"],
    note: "Programme CNED, reconnue par l'AEFE.",
  },
  {
    name: "American School of Kinshasa (TASOK)",
    type: "École internationale",
    location: "Ngaliema",
    levels: "Préscolaire → Lycée",
    language: "Anglais",
    nearbyQuarters: ["Ngaliema", "Kintambo", "Lingwala"],
    note: "Diplôme américain et IB. Très prisée des expatriés.",
  },
  {
    name: "Collège Bonsomi",
    type: "École privée congolaise",
    location: "Gombe",
    levels: "Primaire → Secondaire",
    language: "Français",
    nearbyQuarters: ["Gombe", "Barumbu", "Kintambo"],
    note: "Excellents résultats aux examens d'État, forte réputation académique.",
  },
  {
    name: "Institut Sainte-Famille",
    type: "École catholique",
    location: "Lemba",
    levels: "Primaire → Secondaire",
    language: "Français",
    nearbyQuarters: ["Lemba", "Kalamu", "Matete"],
    note: "École mixte reconnue pour la qualité de l'enseignement et la discipline.",
  },
  {
    name: "Complexe Scolaire Roi Baudouin",
    type: "École privée",
    location: "Bandalungwa",
    levels: "Maternelle → Secondaire",
    language: "Français",
    nearbyQuarters: ["Bandalungwa", "Kasa-Vubu", "Ngiri-Ngiri"],
    note: "Bien équipée, milieu de gamme, idéale pour familles congolaises.",
  },
];

const universities = [
  {
    name: "Université de Kinshasa (UNIKIN)",
    location: "Ngaliema — Lemba",
    faculties: ["Droit", "Médecine", "Sciences", "Économie", "Polytechnique"],
    note: "La plus grande université du pays. Campus étendu avec cités universitaires.",
    nearbyQuarters: ["Ngaliema", "Lemba", "Mont-Ngafula"],
  },
  {
    name: "Université Catholique du Congo (UCC)",
    location: "Lingwala",
    faculties: ["Théologie", "Droit", "Sciences Sociales", "Philosophie"],
    note: "Université réputée, bien située au cœur de la ville.",
    nearbyQuarters: ["Lingwala", "Gombe", "Barumbu"],
  },
  {
    name: "Université Protestante du Congo (UPC)",
    location: "Limete",
    faculties: ["Médecine", "Sciences", "Théologie", "Lettres"],
    note: "Forte tradition académique, campus bien organisé.",
    nearbyQuarters: ["Limete", "Kalamu", "Ngiri-Ngiri"],
  },
  {
    name: "Institut Supérieur de Commerce (ISC)",
    location: "Gombe",
    faculties: ["Commerce", "Marketing", "Finance", "Management"],
    note: "Formation professionnalisante très demandée par les entreprises de Kinshasa.",
    nearbyQuarters: ["Gombe", "Kintambo", "Bandalungwa"],
  },
];

const tips = [
  "Habitez à moins de 20 min de l'établissement scolaire pour éviter les embouteillages matinaux.",
  "Vérifiez que le quartier dispose d'un axe routier praticable toute l'année (bitumé).",
  "Privilégiez les biens avec groupe électrogène : les études nocturnes nécessitent un éclairage stable.",
  "Pour les étudiants, les studios et chambres en colocation à Lemba ou Lingwala sont très accessibles.",
  "Les familles d'expatriés optent souvent pour Ngaliema ou Gombe pour la proximité des écoles internationales.",
];

export default function EcolesUniversitesPage() {
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
            Guides écoles & universités
          </h1>
          <p className="text-white/75 text-base max-w-2xl">
            Trouvez le logement idéal à proximité des établissements scolaires
            et universitaires de Kinshasa. Un guide pour les familles, les
            étudiants et les expatriés.
          </p>
        </div>
      </section>

      <section className="bg-background py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-14">
          {/* Schools */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                Écoles recommandées
              </h2>
            </div>

            <div className="space-y-4">
              {schools.map((s) => (
                <div key={s.name} className="bg-card rounded-xl shadow-md p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs font-semibold bg-accent text-primary px-2 py-1 rounded-full">
                        {s.type}
                      </span>
                      <h3 className="text-base font-semibold text-foreground mt-2">
                        {s.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-secondary">
                      <Star className="w-4 h-4 fill-secondary" />
                      <Star className="w-4 h-4 fill-secondary" />
                      <Star className="w-4 h-4 fill-secondary" />
                      <Star className="w-4 h-4 fill-secondary" />
                      <Star className="w-4 h-4 fill-secondary/30" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm text-text-light mb-3">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {s.location}
                    </span>
                    <span>
                      <strong className="text-foreground">Niveaux :</strong>{" "}
                      {s.levels}
                    </span>
                    <span>
                      <strong className="text-foreground">Langue :</strong>{" "}
                      {s.language}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 italic">
                    {s.note}
                  </p>

                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1.5">
                      Quartiers proches :
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {s.nearbyQuarters.map((q) => (
                        <Link
                          key={q}
                          href={`/louer?q=${q}`}
                          className="text-xs px-2.5 py-1 bg-muted rounded-full text-primary hover:bg-accent transition-colors"
                        >
                          {q}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Universities */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                Universités
              </h2>
            </div>

            <div className="space-y-4">
              {universities.map((u) => (
                <div key={u.name} className="bg-card rounded-xl shadow-md p-6">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    {u.name}
                  </h3>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {u.location}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {u.faculties.map((f) => (
                      <span
                        key={f}
                        className="text-xs px-2.5 py-1 bg-muted rounded-full text-foreground/75"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground italic mb-3">
                    {u.note}
                  </p>

                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1.5">
                      Quartiers pour étudiants :
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {u.nearbyQuarters.map((q) => (
                        <Link
                          key={q}
                          href={`/louer?q=${q}&type=studio`}
                          className="text-xs px-2.5 py-1 bg-muted rounded-full text-primary hover:bg-accent transition-colors"
                        >
                          Studios à {q}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-5">
              Conseils pratiques
            </h2>
            <div className="bg-card rounded-xl shadow-md p-6">
              <ul className="space-y-3">
                {tips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-text-light"
                  >
                    <span className="w-6 h-6 rounded-full bg-accent text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-14 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-3">
          Trouver un logement près de l&apos;école
        </h2>
        <p className="text-primary-foreground/80 text-sm mb-6 max-w-lg mx-auto">
          Recherchez par quartier pour trouver l&apos;appartement ou la maison
          idéale à proximité de l&apos;établissement scolaire de votre choix.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="gold" asChild>
            <Link href="/louer">Chercher un logement</Link>
          </Button>
          <Button
            variant="outline"
            className="border-white/40 text-white hover:bg-white dark:bg-card/10"
            asChild
          >
            <Link href="/louer?type=studio">Studios étudiants</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
