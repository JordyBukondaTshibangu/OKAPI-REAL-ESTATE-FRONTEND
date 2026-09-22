import type { MetadataRoute } from "next";

const BASE = "https://okapi-real-estate.com";

// Static marketing & informational pages
const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },

  // Property listings
  { url: `${BASE}/acheter`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE}/acheter/appartements`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE}/acheter/villas`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE}/acheter/maisons-ville`, changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE}/acheter/terrains`, changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE}/acheter/penthouses`, changeFrequency: "daily", priority: 0.8 },

  { url: `${BASE}/louer`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE}/louer/appartements`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE}/louer/villas`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE}/louer/studios`, changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE}/louer/maisons-ville`, changeFrequency: "daily", priority: 0.8 },

  { url: `${BASE}/commercial`, changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE}/commercial/bureaux`, changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE}/commercial/entrepots`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE}/commercial/magasins`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE}/commercial/terrains`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE}/commercial/location/bureaux`, changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE}/commercial/location/entrepots`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE}/commercial/location/magasins`, changeFrequency: "weekly", priority: 0.7 },

  // Sell / agent pages
  { url: `${BASE}/vendre`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE}/vendre/estimation`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/vendre/appartement`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/vendre/maison`, changeFrequency: "monthly", priority: 0.7 },

  // Agents & agencies
  { url: `${BASE}/agents`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE}/agences`, changeFrequency: "weekly", priority: 0.8 },

  // Content
  { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE}/conseils`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/conseils/guide-acheteur`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/conseils/guide-locataire`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/conseils/guide-vendeur`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/conseils/quartiers`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/conseils/communautes`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/conseils/ecoles-universites`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/conseils/tours-residences`, changeFrequency: "monthly", priority: 0.5 },

  // Company
  { url: `${BASE}/pro`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/agence`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/a-propos`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/carrieres`, changeFrequency: "monthly", priority: 0.4 },

  // Legal
  { url: `${BASE}/conditions-generales`, changeFrequency: "yearly", priority: 0.2 },
  { url: `${BASE}/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
  { url: `${BASE}/cookies`, changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Try to fetch live property IDs for dynamic property pages.
  // Falls back gracefully if the API is unavailable at build time.
  let propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${process.env.API_URL ?? "https://api.okapi-real-estate.com"}/properties?status=LIVE&limit=500`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const properties: Array<{ id: string; updatedAt?: string }> = data?.data ?? data ?? [];
      propertyRoutes = properties.map((p) => ({
        url: `${BASE}/property/${p.id}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // API not reachable at build time — skip dynamic property URLs
  }

  return [...staticRoutes, ...propertyRoutes];
}
