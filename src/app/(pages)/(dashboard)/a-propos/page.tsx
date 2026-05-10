import { Button } from "@/shared/components/ui/button";
import { Award, Globe, Home, Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos — Okapi Real Estate",
  description:
    "Découvrez Okapi Real Estate, le portail immobilier numéro un à Kinshasa et en RDC.",
};

const stats = [
  { label: "Biens listés", value: "250 000+" },
  { label: "Utilisateurs actifs", value: "500 000+" },
  { label: "Agences partenaires", value: "1 200+" },
  { label: "Années d'expérience", value: "10+" },
];

const values = [
  {
    icon: Home,
    title: "Accessibilité",
    body: "Nous croyons que chaque Congolais mérite un toit. Nous rendons la recherche immobilière simple, rapide et gratuite.",
  },
  {
    icon: Users,
    title: "Confiance",
    body: "Toutes les annonces sont vérifiées par notre équipe. Agents et propriétaires sont évalués par la communauté.",
  },
  {
    icon: Globe,
    title: "Innovation",
    body: "Nous investissons en continu dans la technologie pour offrir la meilleure expérience de recherche immobilière en RDC.",
  },
  {
    icon: Award,
    title: "Excellence",
    body: "Notre ambition est d'être le standard de référence pour l'immobilier en Afrique centrale.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
            À propos de nous
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
            Le portail immobilier numéro un à Kinshasa
          </h1>
          <p className="text-lg text-white/75 max-w-2xl mx-auto">
            Depuis 2014, Okapi Real Estate connecte acheteurs, locataires,
            vendeurs et agents immobiliers à travers la RDC.
          </p>
        </div>
      </section>

      <section className="bg-secondary/10 py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-primary mb-1">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 shadow-md flex items-center justify-center">
            <Home className="w-28 h-28 text-primary/30" strokeWidth={1} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
              Notre mission
            </p>
            <h2 className="text-3xl font-semibold text-text-dark mb-5 leading-tight">
              Rendre l&apos;immobilier accessible à tous les Congolais
            </h2>
            <p className="text-sm text-text-light leading-relaxed mb-4">
              Okapi Real Estate est né d&apos;une conviction simple : trouver un
              bien immobilier en RDC ne doit pas être compliqué. Notre
              plateforme rassemble les annonces des principales agences et
              particuliers pour vous offrir le choix le plus large.
            </p>
            <p className="text-sm text-text-light leading-relaxed mb-8">
              Que vous cherchiez à acheter votre première maison, à louer un
              appartement en Gombe ou à vendre un terrain à Limete, Okapi Real
              Estate est votre partenaire de confiance à chaque étape.
            </p>
            <Button asChild>
              <a href="/contact">Contactez-nous</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
              Nos valeurs
            </p>
            <h2 className="text-3xl font-semibold text-text-dark">
              Ce qui nous guide
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card rounded-xl shadow-md p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-text-dark mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-text-light leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-16 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Rejoignez notre communauté
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto text-sm">
          Que vous soyez acheteur, vendeur ou agent, Okapi Real Estate a tout ce
          qu&apos;il vous faut.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="gold" asChild>
            <a href="/inscription">Créer un compte</a>
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white/10"
            asChild
          >
            <a href="/carrieres">Rejoindre l&apos;équipe</a>
          </Button>
        </div>
      </section>
    </>
  );
}
