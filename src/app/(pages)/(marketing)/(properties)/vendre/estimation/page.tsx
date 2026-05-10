import { Metadata } from "next";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { TrendingUp, Clock, Shield, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Estimation gratuite — Okapi Real Estate",
  description: "Obtenez une estimation gratuite de votre bien immobilier à Kinshasa.",
};

const perks = [
  { icon: TrendingUp, title: "Basée sur le marché réel", body: "Nous analysons les transactions récentes dans votre quartier." },
  { icon: Clock, title: "Résultat en 48h", body: "Un expert vous contacte rapidement avec votre rapport d'estimation." },
  { icon: Shield, title: "Sans engagement", body: "L'estimation est gratuite et ne vous oblige à rien." },
  { icon: Award, title: "Experts locaux", body: "Nos agents connaissent chaque commune de Kinshasa." },
];

export default function EstimationPage() {
  return (
    <>
      <section className="bg-navy text-white py-20 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
          Estimation gratuite
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
          Quelle est la valeur de votre bien ?
        </h1>
        <p className="text-white/75 max-w-xl mx-auto text-base">
          Obtenez une estimation précise et gratuite de votre bien immobilier à Kinshasa
          en moins de 48 heures.
        </p>
      </section>

      <section className="bg-background py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-xl font-semibold text-text-dark mb-8">
              Votre estimation en 3 étapes
            </h2>
            <div className="space-y-6">
              {perks.map((p) => (
                <div key={p.title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <p.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-dark mb-1">{p.title}</h3>
                    <p className="text-sm text-text-light leading-relaxed">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-md p-8">
            <h2 className="text-lg font-semibold text-text-dark mb-6">
              Demander une estimation
            </h2>
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">Commune / Quartier</label>
                <Input placeholder="ex: Gombe, Ngaliema, Limete…" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">Type de bien</label>
                <select className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="">Sélectionner…</option>
                  <option>Appartement</option>
                  <option>Villa</option>
                  <option>Maison de ville</option>
                  <option>Terrain</option>
                  <option>Penthouse</option>
                  <option>Local commercial</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">Surface (m²)</label>
                  <Input type="number" placeholder="ex: 150" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">Chambres</label>
                  <Input type="number" placeholder="ex: 3" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">Votre nom</label>
                <Input placeholder="Prénom et nom" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">Téléphone</label>
                <Input type="tel" placeholder="+243 999 000 111" />
              </div>
              <Button type="submit" className="w-full mt-2">
                Demander mon estimation gratuite
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
