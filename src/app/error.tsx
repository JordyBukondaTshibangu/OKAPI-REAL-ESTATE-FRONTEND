"use client";

import { useEffect } from "react";
import { Button } from "@/shared/components/ui/button";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <svg
          className="w-7 h-7 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-foreground">
        Une erreur est survenue
      </h2>
      <p className="mt-2 text-muted-foreground max-w-sm">
        Quelque chose s&apos;est mal passé. Veuillez réessayer ou revenir à l&apos;accueil.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-muted-foreground font-mono">
          Code : {error.digest}
        </p>
      )}
      <div className="mt-8 flex gap-3">
        <Button onClick={unstable_retry}>Réessayer</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Retour à l&apos;accueil
        </Button>
      </div>
    </div>
  );
}
