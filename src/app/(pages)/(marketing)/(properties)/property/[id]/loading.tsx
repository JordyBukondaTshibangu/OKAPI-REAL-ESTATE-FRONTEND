import { OkapiPageLoader } from "@/shared/components/ui/OkapiLoader";

/**
 * Route-level loading fallback. Rendered automatically by Next.js while the
 * dynamic segment is hydrating.
 */
export default function Loading() {
  return <OkapiPageLoader label="Chargement du bien..." />;
}
