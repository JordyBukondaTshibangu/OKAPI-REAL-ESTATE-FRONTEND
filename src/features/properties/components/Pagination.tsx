"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({
  current = 1,
  total = 1,
}: {
  current?: number;
  total?: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function pageHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 py-10">
      <a
        href={current > 1 ? pageHref(current - 1) : undefined}
        aria-label="Page précédente"
        aria-disabled={current === 1}
        className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground transition-colors ${
          current === 1 ? "opacity-40 pointer-events-none" : "hover:bg-muted/70"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </a>

      {pages.map((page) => {
        const isActive = page === current;
        return (
          <a
            key={page}
            href={pageHref(page)}
            aria-current={isActive ? "page" : undefined}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
              isActive
                ? "bg-primary text-white"
                : "bg-muted text-foreground hover:bg-muted/70"
            }`}
          >
            {page}
          </a>
        );
      })}

      <a
        href={current < total ? pageHref(current + 1) : undefined}
        aria-label="Page suivante"
        aria-disabled={current === total}
        className={`w-10 h-10 rounded-lg border border-border bg-white dark:bg-card flex items-center justify-center text-foreground transition-colors ${
          current === total ? "opacity-40 pointer-events-none" : "hover:bg-muted"
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </a>
    </nav>
  );
}
