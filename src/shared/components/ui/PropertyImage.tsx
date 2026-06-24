"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2, Home, LandPlot, Store, Warehouse } from "lucide-react";

function iconForCategory(category?: string | null) {
  const c = (category ?? "").toLowerCase();
  if (c.includes("land")) return LandPlot;
  if (c.includes("office")) return Building2;
  if (c.includes("warehouse")) return Warehouse;
  if (c.includes("retail") || c.includes("store") || c.includes("shop"))
    return Store;
  return Home;
}

export function PropertyCategoryFallback({
  category,
  gradient,
  className,
}: {
  category?: string | null;
  gradient?: string;
  className?: string;
}) {
  const Icon = iconForCategory(category);
  const colorClasses = gradient
    ? `bg-linear-to-br ${gradient} text-white/70`
    : "bg-muted text-muted-foreground/60";
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${colorClasses} ${className ?? ""}`}
    >
      <Icon className="w-1/3 h-1/3" strokeWidth={1.5} />
    </div>
  );
}

/**
 * Drop-in replacement for next/image `fill` usage on property photos.
 * - Shows an animated shimmer skeleton while the image is loading
 * - Falls back to a category icon when src is missing or the URL errors
 * - Passes `priority` / `loading="eager"` to the first above-fold image
 *   to avoid the LCP warning
 */
export default function PropertyImage({
  src,
  alt,
  category,
  gradient,
  sizes,
  className = "object-cover",
  priority,
}: {
  src?: string | null;
  alt: string;
  category?: string | null;
  gradient?: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return <PropertyCategoryFallback category={category} gradient={gradient} />;
  }

  return (
    <>
      {/* Shimmer skeleton — visible until the image finishes loading */}
      {!loaded && (
        <div className="absolute inset-0 overflow-hidden bg-muted">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      )}

      <Image
        fill
        src={src}
        alt={alt}
        sizes={sizes}
        quality={65}
        priority={priority}
        loading={priority ? "eager" : undefined}
        className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />
    </>
  );
}
