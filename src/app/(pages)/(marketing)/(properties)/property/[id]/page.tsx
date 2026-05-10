import { notFound } from "next/navigation";
import { getPropertyById, getAllProperties } from "@/lib/api";
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
  const [detail, allProperties] = await Promise.all([
    getPropertyById(id),
    getAllProperties(),
  ]);
  if (!detail) notFound();

  const recommended = allProperties
    .filter((p) => p.id !== id && p.category === detail.category)
    .slice(0, 4);

  return <PropertyDetailClient id={id} detail={detail} recommended={recommended} />;
}
