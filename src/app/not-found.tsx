"use client";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { useT } from "@/i18n/useT";

export default function NotFound() {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <p className="text-8xl font-bold text-primary leading-none">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">
        {t.common.notFoundTitle}
      </h1>
      <p className="mt-2 text-muted-foreground max-w-sm">
        {t.common.notFoundDesc}
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">{t.common.backHome}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/acheter">{t.common.seeListings}</Link>
        </Button>
      </div>
    </div>
  );
}
