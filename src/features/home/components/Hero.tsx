"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

const FILTER_PILLS = [
  { label: "Type de bien", param: "type" },
  { label: "Prix min",     param: "minPrice" },
  { label: "Prix max",     param: "maxPrice" },
  { label: "Chambres",     param: "beds" },
];

const TAB_ROUTES: Record<string, string> = {
  buy:  "/acheter",
  rent: "/louer",
  sell: "/vendre",
};

export default function Hero() {
  const router = useRouter();
  const [tab, setTab] = useState("buy");
  const [query, setQuery] = useState("");

  function handleSearch() {
    const base = TAB_ROUTES[tab] ?? "/acheter";
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(params.toString() ? `${base}?${params}` : base);
  }

  return (
    <section className="relative bg-navy text-white py-48 px-8 overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-primary/30 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase mb-4">
          Enraciné au Congo, bâtir votre avenir
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold mb-8 leading-tight">
          Trouvez un bien à vendre à <span className="text-secondary">Kinshasa</span>
        </h1>

        <Tabs value={tab} onValueChange={setTab} className="mb-6">
          <TabsList className="bg-transparent gap-6 border-b border-white/15 rounded-none">
            {[
              { value: "buy",  label: "Acheter" },
              { value: "rent", label: "Louer"   },
              { value: "sell", label: "Vendre"  },
            ].map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="bg-transparent text-white/70 data-[state=active]:bg-transparent data-[state=active]:text-secondary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-secondary rounded-none pb-2 font-medium"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <form
          className="bg-white rounded-xl flex overflow-hidden shadow-lg"
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-0 rounded-none focus-visible:ring-0 text-foreground h-14 text-base"
            placeholder="Rechercher par commune, quartier ou référence"
          />
          <Button type="submit" className="rounded-none h-auto px-8 text-base">
            Rechercher
          </Button>
        </form>

        <div className="flex justify-center flex-wrap gap-3 mt-6">
          {FILTER_PILLS.map(({ label, param }) => (
            <Button
              key={param}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const base = TAB_ROUTES[tab] ?? "/acheter";
                router.push(base);
              }}
              className="border-white/30 text-white bg-white/5 hover:bg-white/15 hover:text-white rounded-full"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
