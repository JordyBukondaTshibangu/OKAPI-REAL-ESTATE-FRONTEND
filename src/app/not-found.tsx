import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <p className="text-8xl font-bold text-primary leading-none">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">
        Page introuvable
      </h1>
      <p className="mt-2 text-muted-foreground max-w-sm">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/acheter">Voir les annonces</Link>
        </Button>
      </div>
    </div>
  );
}
