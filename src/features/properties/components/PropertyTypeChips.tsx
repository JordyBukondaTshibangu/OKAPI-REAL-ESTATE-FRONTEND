"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type CategoryCount = { label: string; count: number; href?: string };

export default function PropertyTypeChips({
  categories,
}: {
  categories: CategoryCount[];
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center gap-3">
      {categories.map((c) => {
        const isActive = c.href ? pathname === c.href : false;
        const chipClass = `inline-flex items-center gap-2 rounded-full border px-4 h-9 text-sm transition-colors bg-white dark:bg-card ${
          isActive
            ? "border-primary text-foreground"
            : "border-border text-foreground/85 hover:border-primary/50"
        }`;
        const inner = (
          <>
            <span className="font-medium">{c.label}</span>
            {c.count > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-foreground/40" />
                <span className="text-foreground/70">
                  {new Intl.NumberFormat("fr-FR").format(c.count)}
                </span>
              </>
            )}
          </>
        );

        return c.href ? (
          <Link key={c.label} href={c.href} className={chipClass}>
            {inner}
          </Link>
        ) : (
          <button key={c.label} type="button" className={chipClass}>
            {inner}
          </button>
        );
      })}
    </div>
  );
}
