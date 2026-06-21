"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2, Home, LandPlot, Store, Warehouse } from "lucide-react";

/**
 * Picks a representative icon for a property type. Accepts the strict
 * `PropertyCategory` union as well as the looser free-text `type` strings
 * some API responses use (e.g. Favourite.property.type), matched
 * case-insensitively by keyword.
 */
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
 * Falls back to a category icon both when the src is missing AND when the
 * image actually fails to load (broken URL, 404, etc.) — next/image alone
 * doesn't catch the latter case.
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
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return <PropertyCategoryFallback category={category} gradient={gradient} />;
  }

  return (
    <Image
      fill
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
