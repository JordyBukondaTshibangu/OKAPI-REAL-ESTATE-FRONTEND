import type { Property } from "@/features/properties/types/property";

export type LatLng = { lat: number; lng: number };

/** Kinshasa city centre fallback */
export const KINSHASA_CENTER: LatLng = { lat: -4.325, lng: 15.322 };

/**
 * Approximate coordinates for Kinshasa communes & well-known quartiers.
 * Keys are normalized (lowercase, no accents, no apostrophes).
 */
export const AREA_COORDS: Record<string, LatLng> = {
  // Communes
  gombe: { lat: -4.3033, lng: 15.3003 },
  ngaliema: { lat: -4.3672, lng: 15.2497 },
  kintambo: { lat: -4.3269, lng: 15.2717 },
  bandalungwa: { lat: -4.3447, lng: 15.2903 },
  lingwala: { lat: -4.3186, lng: 15.2997 },
  kinshasa: { lat: -4.3103, lng: 15.3108 },
  barumbu: { lat: -4.3097, lng: 15.3231 },
  "kasa-vubu": { lat: -4.3372, lng: 15.3047 },
  kasavubu: { lat: -4.3372, lng: 15.3047 },
  kalamu: { lat: -4.3417, lng: 15.3153 },
  "ngiri-ngiri": { lat: -4.3503, lng: 15.3 },
  ngiringiri: { lat: -4.3503, lng: 15.3 },
  bumbu: { lat: -4.365, lng: 15.295 },
  selembao: { lat: -4.375, lng: 15.28 },
  makala: { lat: -4.37, lng: 15.305 },
  lemba: { lat: -4.39, lng: 15.33 },
  limete: { lat: -4.35, lng: 15.345 },
  matete: { lat: -4.385, lng: 15.35 },
  ngaba: { lat: -4.38, lng: 15.32 },
  "mont ngafula": { lat: -4.43, lng: 15.29 },
  "mont-ngafula": { lat: -4.43, lng: 15.29 },
  kisenso: { lat: -4.4, lng: 15.36 },
  ndjili: { lat: -4.395, lng: 15.39 },
  "n'djili": { lat: -4.395, lng: 15.39 },
  masina: { lat: -4.38, lng: 15.405 },
  kimbanseke: { lat: -4.42, lng: 15.42 },
  nsele: { lat: -4.38, lng: 15.5 },
  "n'sele": { lat: -4.38, lng: 15.5 },
  maluku: { lat: -4.08, lng: 15.55 },

  // Quartiers / landmarks
  "ma campagne": { lat: -4.355, lng: 15.255 },
  "macampagne": { lat: -4.355, lng: 15.255 },
  binza: { lat: -4.385, lng: 15.245 },
  "binza pigeon": { lat: -4.39, lng: 15.24 },
  "binza ozone": { lat: -4.36, lng: 15.235 },
  "binza upn": { lat: -4.405, lng: 15.255 },
  joli: { lat: -4.36, lng: 15.26 },
  "joli parc": { lat: -4.36, lng: 15.26 },
  utexafrica: { lat: -4.318, lng: 15.282 },
  "socimat": { lat: -4.3, lng: 15.285 },
  "gb": { lat: -4.335, lng: 15.255 },
  righini: { lat: -4.398, lng: 15.325 },
  "limete residentiel": { lat: -4.345, lng: 15.35 },
  "limete industriel": { lat: -4.36, lng: 15.36 },
};

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/** A searchable list of named locations, deduplicated by coordinates. */
export type NamedLocation = { key: string; label: string } & LatLng;

export const NAMED_LOCATIONS: NamedLocation[] = Object.entries(AREA_COORDS).reduce<
  NamedLocation[]
>((acc, [key, coords]) => {
  // Skip pure aliases (e.g. "kasavubu" duplicating "kasa-vubu") that share
  // identical coordinates with an entry already added.
  const isDuplicate = acc.some((l) => l.lat === coords.lat && l.lng === coords.lng);
  if (isDuplicate) return acc;
  const label = key
    .split(" ")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
  acc.push({ key, label, ...coords });
  return acc;
}, []);

/** Great-circle distance between two coordinates, in kilometres. */
export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Deterministic pseudo-random in [-1, 1] from a string seed */
function seeded(seed: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // map to [-1, 1]
  return ((h >>> 0) % 10000) / 5000 - 1;
}

/**
 * Resolve approximate coordinates for a property.
 * Tries neighborhood → suburb → city centre, then applies a small
 * deterministic jitter (per property id) so pins in the same area
 * don't stack on top of each other.
 */
export function getPropertyCoords(property: Property): LatLng {
  const base =
    AREA_COORDS[normalize(property.neighborhood ?? "")] ??
    AREA_COORDS[normalize(property.suburb ?? "")] ??
    KINSHASA_CENTER;

  return {
    lat: base.lat + seeded(property.id, 1) * 0.006,
    lng: base.lng + seeded(property.id, 2) * 0.006,
  };
}
