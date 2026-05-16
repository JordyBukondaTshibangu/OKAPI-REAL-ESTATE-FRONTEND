"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Calculator,
  CheckSquare,
  ClipboardCheck,
  Home,
  MessageSquare,
  Search,
  Smartphone,
  Tag,
  TrendingUp,
} from "lucide-react";
import CardsGrid from "./CardsGrid";

export type DiscoverCard = {
  title: string;
  description: string;
  cta: string;
  href: string;
  Icon: LucideIcon;
  Badge: LucideIcon;
};

const buyingCards: DiscoverCard[] = [
  {
    title: "Alertes immobilières",
    description:
      "Créez un compte et recevez des alertes lorsque de nouveaux biens correspondent à vos critères de recherche.",
    cta: "S'inscrire maintenant",
    href: "/inscription",
    Icon: Smartphone,
    Badge: Bell,
  },
  {
    title: "Prix des biens vendus",
    description: "Découvrez la valeur de n'importe quel bien à Kinshasa.",
    cta: "Voir les prix",
    href: "/acheter",
    Icon: TrendingUp,
    Badge: Tag,
  },
  {
    title: "Vous souhaitez acheter ?",
    description:
      "Toutes les informations nécessaires pour acheter un bien grâce à nos guides complets.",
    cta: "Voir les guides",
    href: "/conseils/guide-acheteur",
    Icon: Home,
    Badge: ClipboardCheck,
  },
];

const rentingCards: DiscoverCard[] = [
  {
    title: "Trouver un agent de location",
    description:
      "Trouvez des agents de location de confiance près de chez vous.",
    cta: "Rechercher des agents",
    href: "/agents",
    Icon: Search,
    Badge: Search,
  },
  {
    title: "Rejoignez LocataireFiable",
    description:
      "Vérifiez votre identité et obtenez votre rapport de vérification pour vos demandes de location.",
    cta: "En savoir plus",
    href: "/inscription",
    Icon: Smartphone,
    Badge: ClipboardCheck,
  },
  {
    title: "Conseils location",
    description:
      "Découvrez nos articles et astuces pour aborder le marché locatif comme un pro.",
    cta: "Voir les articles",
    href: "/conseils/location",
    Icon: MessageSquare,
    Badge: MessageSquare,
  },
];

const sellingCards: DiscoverCard[] = [
  {
    title: "Estimation automatique",
    description:
      "Curieux de connaître la valeur de votre bien ? Obtenez une estimation gratuite dès aujourd'hui !",
    cta: "Commencer",
    href: "/vendre/estimation",
    Icon: Calculator,
    Badge: TrendingUp,
  },
  {
    title: "Prix des biens vendus",
    description: "Découvrez la valeur de n'importe quel bien à Kinshasa.",
    cta: "Voir les prix",
    href: "/acheter",
    Icon: TrendingUp,
    Badge: Tag,
  },
  {
    title: "Vous souhaitez vendre ?",
    description:
      "Toutes les informations nécessaires pour vendre un bien grâce à nos guides complets.",
    cta: "Voir les guides",
    href: "/conseils/guide-vendeur",
    Icon: Home,
    Badge: CheckSquare,
  },
];

export default function Discover() {
  return (
    <section className="relative bg-background-alt py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-text-dark text-center mb-8">
          Découvrez tout sur l&apos;immobilier
        </h2>

        <Tabs defaultValue="buying" className="w-full">
          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <TabsList className="bg-transparent h-auto p-0 gap-2  rounded-none">
              <TabsTrigger
                value="buying"
                className="rounded-md px-6 py-3 text-base font-medium text-text-light data-[state=active]:bg-transparent data-[state=active]:text-text-dark data-[state=active]:shadow-none data-[state=active]:border data-[state=active]:border-secondary data-[state=active]:rounded-md relative -mb-px"
              >
                Acheter
              </TabsTrigger>
              <TabsTrigger
                value="renting"
                className="rounded-md px-6 py-3 text-base font-medium text-text-light data-[state=active]:bg-transparent data-[state=active]:text-text-dark data-[state=active]:shadow-none data-[state=active]:border data-[state=active]:border-secondary data-[state=active]:rounded-md relative -mb-px"
              >
                Louer
              </TabsTrigger>
              <TabsTrigger
                value="selling"
                className="rounded-md px-6 py-3 text-base font-medium text-text-light data-[state=active]:bg-transparent data-[state=active]:text-text-dark data-[state=active]:shadow-none data-[state=active]:border data-[state=active]:border-secondary data-[state=active]:rounded-md relative -mb-px"
              >
                Vendre
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Layered effect: navy band behind the card */}
          <div className="relative">
            <div
              className="absolute inset-x-0 bottom-0 h-24 bg-navy rounded-b-xl"
              aria-hidden="true"
            />
            <div className="relative">
              <TabsContent value="buying" className="mt-0">
                <CardsGrid cards={buyingCards} />
              </TabsContent>
              <TabsContent value="renting" className="mt-0">
                <CardsGrid cards={rentingCards} />
              </TabsContent>
              <TabsContent value="selling" className="mt-0">
                <CardsGrid cards={sellingCards} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
