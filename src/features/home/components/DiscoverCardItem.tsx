import Link from "next/link";
import { DiscoverCard } from "./Discover";

export default function DiscoverCardItem({ card }: { card: DiscoverCard }) {
  const { Icon, Badge } = card;
  return (
    <div className="flex flex-col items-center text-center px-6 py-8 hover:bg-secondary/5 transition-colors duration-200">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-navy flex items-center justify-center">
          <Icon className="w-12 h-12 text-secondary" strokeWidth={1.5} />
        </div>
        <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-secondary flex items-center justify-center shadow-md">
          <Badge className="w-4 h-4 text-secondary-foreground" strokeWidth={2} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-3">
        {card.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-xs">
        {card.description}
      </p>

      {/* CTA */}
      <div className="mt-auto pt-2">
        <Link
          href={card.href}
          className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold hover:opacity-90 transition-opacity duration-200"
        >
          {card.cta}
        </Link>
      </div>
    </div>
  );
}
