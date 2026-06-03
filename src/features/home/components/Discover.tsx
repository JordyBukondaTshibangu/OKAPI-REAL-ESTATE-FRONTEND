"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import { useT } from "@/i18n/useT";
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

export default function Discover() {
  const t = useT();

  const buyingCards: DiscoverCard[] = [
    {
      title: t.home.discover.buyCard1Title,
      description: t.home.discover.buyCard1Desc,
      cta: t.home.discover.buyCard1Cta,
      href: "/inscription",
      Icon: Smartphone,
      Badge: Bell,
    },
    {
      title: t.home.discover.buyCard2Title,
      description: t.home.discover.buyCard2Desc,
      cta: t.home.discover.buyCard2Cta,
      href: "/acheter",
      Icon: TrendingUp,
      Badge: Tag,
    },
    {
      title: t.home.discover.buyCard3Title,
      description: t.home.discover.buyCard3Desc,
      cta: t.home.discover.buyCard3Cta,
      href: "/conseils/guide-acheteur",
      Icon: Home,
      Badge: ClipboardCheck,
    },
  ];

  const rentingCards: DiscoverCard[] = [
    {
      title: t.home.discover.rentCard1Title,
      description: t.home.discover.rentCard1Desc,
      cta: t.home.discover.rentCard1Cta,
      href: "/agents",
      Icon: Search,
      Badge: Search,
    },
    {
      title: t.home.discover.rentCard2Title,
      description: t.home.discover.rentCard2Desc,
      cta: t.home.discover.rentCard2Cta,
      href: "/inscription",
      Icon: Smartphone,
      Badge: ClipboardCheck,
    },
    {
      title: t.home.discover.rentCard3Title,
      description: t.home.discover.rentCard3Desc,
      cta: t.home.discover.rentCard3Cta,
      href: "/conseils/location",
      Icon: MessageSquare,
      Badge: MessageSquare,
    },
  ];

  const sellingCards: DiscoverCard[] = [
    {
      title: t.home.discover.sellCard1Title,
      description: t.home.discover.sellCard1Desc,
      cta: t.home.discover.sellCard1Cta,
      href: "/vendre/estimation",
      Icon: Calculator,
      Badge: TrendingUp,
    },
    {
      title: t.home.discover.sellCard2Title,
      description: t.home.discover.sellCard2Desc,
      cta: t.home.discover.sellCard2Cta,
      href: "/acheter",
      Icon: TrendingUp,
      Badge: Tag,
    },
    {
      title: t.home.discover.sellCard3Title,
      description: t.home.discover.sellCard3Desc,
      cta: t.home.discover.sellCard3Cta,
      href: "/conseils/guide-vendeur",
      Icon: Home,
      Badge: CheckSquare,
    },
  ];

  return (
    <section className="relative bg-background-alt py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-text-dark text-center mb-8">
          {t.home.discover.heading}
        </h2>

        <Tabs defaultValue="buying" className="w-full">
          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <TabsList className="bg-transparent h-auto p-0 gap-2  rounded-none">
              <TabsTrigger
                value="buying"
                className="rounded-md px-6 py-3 text-base font-medium text-text-light data-[state=active]:bg-transparent data-[state=active]:text-text-dark data-[state=active]:shadow-none data-[state=active]:border data-[state=active]:border-secondary data-[state=active]:rounded-md relative -mb-px"
              >
                {t.home.discover.tabBuy}
              </TabsTrigger>
              <TabsTrigger
                value="renting"
                className="rounded-md px-6 py-3 text-base font-medium text-text-light data-[state=active]:bg-transparent data-[state=active]:text-text-dark data-[state=active]:shadow-none data-[state=active]:border data-[state=active]:border-secondary data-[state=active]:rounded-md relative -mb-px"
              >
                {t.home.discover.tabRent}
              </TabsTrigger>
              <TabsTrigger
                value="selling"
                className="rounded-md px-6 py-3 text-base font-medium text-text-light data-[state=active]:bg-transparent data-[state=active]:text-text-dark data-[state=active]:shadow-none data-[state=active]:border data-[state=active]:border-secondary data-[state=active]:rounded-md relative -mb-px"
              >
                {t.home.discover.tabSell}
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
