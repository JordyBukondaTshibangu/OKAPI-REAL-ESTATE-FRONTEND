import { notFound } from "next/navigation";
import { getPropertyById, getRecommendedProperties } from "@/lib/api";
import PropertyDetailClient from "./PropertyDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getPropertyById(id);
  if (!detail) return { title: "Bien introuvable — Okapi Real Estate" };

  const ogImage = Array.isArray(detail.gallery) && detail.gallery.length > 0
    ? detail.gallery[0]
    : undefined;

  const canonicalUrl = `https://okapi-real-estate.com/property/${id}`;

  return {
    title: `${detail.title} — ${detail.suburb ?? "Kinshasa"} | Okapi Real Estate`,
    description:
      detail.subtitle ||
      `${detail.title} à ${detail.suburb ?? "Kinshasa"} — ${detail.bedrooms ? `${detail.bedrooms} chambre(s), ` : ""}${detail.areaSqm ? `${detail.areaSqm} m², ` : ""}${detail.price?.toLocaleString("fr-CD")} ${detail.currency ?? "USD"}.`,
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `${detail.title} — ${detail.suburb ?? "Kinshasa"}`,
      description:
        detail.subtitle || `Découvrez ce bien immobilier à ${detail.suburb ?? "Kinshasa"} sur Okapi Real Estate.`,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: detail.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${detail.title} — ${detail.suburb ?? "Kinshasa"}`,
      description: detail.subtitle || `Bien immobilier à ${detail.suburb ?? "Kinshasa"} sur Okapi Real Estate.`,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getPropertyById(id);
  if (!detail) notFound();

  // Fetch only a small same-category slice instead of the entire catalogue
  const recommended = await getRecommendedProperties(detail.category, id);

  const canonicalUrl = `https://okapi-real-estate.com/property/${id}`;
  const ogImage = Array.isArray(detail.gallery) && detail.gallery.length > 0 ? detail.gallery[0] : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: detail.title,
    description: detail.subtitle ?? detail.title,
    url: canonicalUrl,
    ...(ogImage ? { image: [ogImage] } : {}),
    offers: {
      "@type": "Offer",
      price: detail.price,
      priceCurrency: detail.currency ?? "USD",
      availability: "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: detail.suburb ?? "Kinshasa",
      addressRegion: "Kinshasa",
      addressCountry: "CD",
    },
    ...(detail.bedrooms ? { numberOfRooms: detail.bedrooms } : {}),
    ...(detail.areaSqm ? { floorSize: { "@type": "QuantitativeValue", value: detail.areaSqm, unitCode: "MTK" } } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetailClient id={id} detail={detail} recommended={recommended} />
    </>
  );
}
