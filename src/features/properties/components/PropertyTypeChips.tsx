"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export type CategoryCount = {
  label: string;
  count: number;
  href?: string;
  /** When set, this chip syncs with the ?type= search param */
  typeValue?: string;
};

export default function PropertyTypeChips({
  categories,
}: {
  categories: CategoryCount[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type");

  return (
    <div className="flex flex-wrap items-center gap-3">
      {categories.map((c) => {
        // Active if the URL path matches the chip's href,
        // OR if the ?type= param matches this chip's typeValue
        const isActive =
          (c.href ? pathname === c.href : false) ||
          (c.typeValue ? activeType === c.typeValue : false);

        // When the chip has a typeValue, clicking updates ?type= on the
        // current page (toggling it off if already active).
        // Otherwise fall back to a plain href navigation.
        let chipHref: string | undefined = c.href;
        if (c.typeValue) {
          const next = new URLSearchParams(searchParams.toString());
          if (isActive) {
            next.delete("type");
          } else {
            next.set("type", c.typeValue);
            next.delete("page"); // reset pagination
          }
          chipHref = `${pathname}?${next.toString()}`;
        }

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

        return chipHref ? (
          <Link key={c.label} href={chipHref} className={chipClass}>
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
