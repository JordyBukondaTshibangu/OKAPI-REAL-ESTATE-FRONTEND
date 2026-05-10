"use client";

import { Button } from "@/shared/components/ui/button";
import { Home, Laptop, Sofa, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="bg-background py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Le site immobilier numéro un à Kinshasa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image collage */}
          <div className="relative h-[420px]">
            {/* Top-left image */}
            <div className="absolute top-0 left-4 w-56 h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-400 shadow-lg flex items-center justify-center">
              <Sofa className="w-16 h-16 text-white/80" strokeWidth={1.5} />
            </div>
            {/* Top-right image */}
            <div className="absolute top-2 right-8 w-36 h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-300 to-amber-500 shadow-lg flex items-center justify-center">
              <Laptop className="w-14 h-14 text-white/90" strokeWidth={1.5} />
            </div>
            {/* Bottom image */}
            <div className="absolute bottom-0 left-20 w-64 h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-sky-100 to-sky-300 shadow-lg flex items-center justify-center">
              <Home className="w-20 h-20 text-white/90" strokeWidth={1.5} />
            </div>
          </div>

          {/* Copy */}
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
              À propos
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-dark mb-5 leading-tight">
              Le site immobilier numéro un <br className="hidden md:block" />
              à Kinshasa
            </h2>
            <p className="text-sm text-text-light leading-relaxed mb-4">
              Okapi Real Estate est le plus grand portail de recherche immobilière à
              Kinshasa et le premier endroit où commencer votre recherche !
            </p>
            <p className="text-sm text-text-light leading-relaxed mb-8">
              Okapi Real Estate recense maisons, appartements, terrains et parcelles
              des principales agences immobilières de Kinshasa. Que vous
              cherchiez à acheter ou à louer, vous trouverez votre bien idéal
              sur Okapi Real Estate.
            </p>
            <Button variant="outline" asChild>
              <a href="/a-propos">En savoir plus sur Okapi Real Estate</a>
            </Button>
          </div>
        </div>

        {/* Trouver un agent immobilier de confiance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div className="md:order-1">
            <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-3">
              Notre réseau
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-dark mb-5 leading-tight">
              Trouvez un agent immobilier de <br className="hidden md:block" />
              confiance dans votre quartier
            </h2>
            <p className="text-sm text-text-light leading-relaxed mb-8 max-w-lg">
              Trouvez la maison de vos rêves sur Okapi Real Estate en explorant la
              plus grande base de biens en vente par les agences immobilières à
              travers Kinshasa et la RDC. Pour mettre votre bien sur
              Okapi Real Estate, contactez l&apos;un de nos agents de confiance.
            </p>
            <Button asChild>
              <a href="/vendre/agents">Rechercher un agent</a>
            </Button>
          </div>

          {/* Image */}
          <div className="md:order-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 via-rose-100 to-amber-200 shadow-lg flex items-center justify-center">
              <Users className="w-24 h-24 text-text-dark/50" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
