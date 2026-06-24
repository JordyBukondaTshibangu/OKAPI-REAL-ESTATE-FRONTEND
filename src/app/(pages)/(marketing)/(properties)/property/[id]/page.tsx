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
  return {
    title: `${detail.title} — Okapi Real Estate`,
    description: detail.subtitle,
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

  return <PropertyDetailClient id={id} detail={detail} recommended={recommended} />;
}
