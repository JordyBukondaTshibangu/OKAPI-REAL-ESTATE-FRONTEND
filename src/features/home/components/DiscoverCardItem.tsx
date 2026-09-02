import Link from "next/link";
import { DiscoverCard } from "./Discover";

export default function DiscoverCardItem({ card }: { card: DiscoverCard }) {
  const { Icon, Badge } = card;
  return (
    <div className="flex flex-col items-center text-center px-6 py-8 hover:bg-secondary/5 transition-all duration-300 group">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-navy flex items-center justify-center group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(212,175,55,0.25)] transition-all duration-300">
          <Icon className="w-12 h-12 text-secondary group-hover:rotate-6 transition-transform duration-300" strokeWidth={1.5} />
        </div>
        <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-secondary flex items-center justify-center shadow-md group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
          <Badge className="w-4 h-4 text-secondary-foreground" strokeWidth={2} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
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
          className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold hover:opacity-90 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          {card.cta}
        </Link>
      </div>
    </div>
  );
}
