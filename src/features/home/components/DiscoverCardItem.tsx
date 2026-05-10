import { Button } from "@/shared/components/ui/button";
import { DiscoverCard } from "./Discover";

export default function DiscoverCardItem({ card }: { card: DiscoverCard }) {
  const { Icon, Badge } = card;
  return (
    <div className="flex flex-col items-center text-center px-6 py-8">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-primary-light flex items-center justify-center">
          <Icon className="w-14 h-14 text-primary" strokeWidth={1.5} />
        </div>
        <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-secondary flex items-center justify-center shadow-md">
          <Badge
            className="w-5 h-5 text-secondary-foreground"
            strokeWidth={2}
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-text-dark mb-3">
        {card.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-text-light leading-relaxed mb-8 max-w-xs">
        {card.description}
      </p>

      {/* CTA - pushed to bottom of column */}
      <div className="mt-auto pt-4">
        <Button variant="outline" asChild>
          <a href={card.href}>{card.cta}</a>
        </Button>
      </div>
    </div>
  );
}
