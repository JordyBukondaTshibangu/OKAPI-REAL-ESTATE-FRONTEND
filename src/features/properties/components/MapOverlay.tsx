"use client";

import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import type { Property } from "@/features/properties/types/property";
import { useT } from "@/i18n/useT";
import OkapiLoader from "@/shared/components/ui/OkapiLoader";

// Leaflet touches `window`, so it must never render on the server
const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <OkapiLoader />
    </div>
  ),
});

export default function MapOverlay({
  properties,
}: {
  properties: Property[];
}) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const close = useCallback(() => {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("map");
    const qs = p.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [router, pathname, searchParams]);

  // Lock body scroll + close on Escape
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  return (
    <div className="fixed inset-0 z-[200] bg-background">
      <PropertyMap properties={properties} />

      {/* Exit map */}
      <button
        type="button"
        onClick={close}
        className="absolute top-4 left-4 z-[210] inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white dark:bg-card text-foreground text-sm font-medium shadow-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> {t.filters.exitMap}
      </button>

      {/* Listing count */}
      <div className="absolute top-4 right-4 z-[210] h-10 px-4 inline-flex items-center rounded-full bg-navy text-white text-sm font-medium shadow-lg">
        {new Intl.NumberFormat("fr-FR").format(properties.length)}{" "}
        {t.listingHero.listings}
      </div>
    </div>
  );
}
