"use client";

import { useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Link from "next/link";
import type { Property } from "@/features/properties/types/property";
import {
  getPropertyCoords,
  KINSHASA_CENTER,
} from "@/features/properties/constants/kinshasaCoords";
import { formatPrice } from "@/lib/properties";
import { useT } from "@/i18n/useT";
import AreaIcon from "@/shared/components/ui/icons/AreaIcon";
import BathIcon from "@/shared/components/ui/icons/BathIcon";
import BedIcon from "@/shared/components/ui/icons/BedIcon";

/** Compact price for the pin label, e.g. "$1.2M", "$850K", "$900/mois" */
function compactPrice(p: Property): string {
  const curr = p.currency === "USD" ? "$" : `${p.currency} `;
  let value: string;
  if (p.price >= 1_000_000) {
    const m = p.price / 1_000_000;
    value = `${m % 1 === 0 ? m : m.toFixed(1)}M`;
  } else if (p.price >= 1_000) {
    value = `${Math.round(p.price / 1_000)}K`;
  } else {
    value = String(p.price);
  }
  return `${curr}${value}`;
}

function priceIcon(p: Property): L.DivIcon {
  return L.divIcon({
    className: "okapi-price-pin-wrap",
    html: `<div class="okapi-price-pin">${compactPrice(p)}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 28],
    popupAnchor: [0, -32],
  });
}

export default function PropertyMap({
  properties,
}: {
  properties: Property[];
}) {
  const t = useT();

  const points = useMemo(
    () => properties.map((p) => ({ p, coords: getPropertyCoords(p) })),
    [properties],
  );

  const bounds = useMemo(() => {
    if (points.length === 0) return undefined;
    return L.latLngBounds(points.map(({ coords }) => [coords.lat, coords.lng]));
  }, [points]);

  return (
    <MapContainer
      center={[KINSHASA_CENTER.lat, KINSHASA_CENTER.lng]}
      zoom={12}
      bounds={bounds}
      boundsOptions={{ padding: [60, 60], maxZoom: 15 }}
      scrollWheelZoom
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="okapi-map-tiles"
      />

      {points.map(({ p, coords }) => (
        <Marker
          key={p.id}
          position={[coords.lat, coords.lng]}
          icon={priceIcon(p)}
        >
          <Popup className="okapi-map-popup" minWidth={260} maxWidth={280}>
            <Link href={`/property/${p.id}`} className="block group">
              <div className="relative h-32 rounded-t-xl overflow-hidden bg-muted">
                {p.gallery.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.gallery[0]}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-linear-to-br ${p.imageGradient}`}
                  />
                )}
              </div>
              <div className="p-3">
                <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {formatPrice(p.price, p.currency, p.period)}
                </p>
                <p className="text-sm text-foreground/85 line-clamp-1 mb-1.5">
                  {p.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                  {p.bedrooms > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <BedIcon className="w-3.5 h-3.5" /> {p.bedrooms}
                    </span>
                  )}
                  {p.bathrooms > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <BathIcon className="w-3.5 h-3.5" /> {p.bathrooms}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <AreaIcon className="w-3.5 h-3.5" /> {p.areaSqm} m²
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {p.neighborhood}, {p.suburb}
                </p>
                <p className="mt-2 text-xs font-medium text-primary">
                  {t.filters.viewProperty} →
                </p>
              </div>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
