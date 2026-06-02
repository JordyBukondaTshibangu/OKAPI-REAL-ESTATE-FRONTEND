import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <Link href="/" aria-label="Accueil" className="hover:text-primary">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-2">
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
          {item.href ? (
            <Link href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground/85 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
