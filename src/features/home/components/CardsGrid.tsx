import { DiscoverCard } from "./Discover";
import DiscoverCardItem from "./DiscoverCardItem";

export default function CardsGrid({ cards }: { cards: DiscoverCard[] }) {
  return (
    <div className="bg-white dark:bg-card rounded-xl shadow-md overflow-hidden border-t-4 border-secondary">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
        {cards.map((card) => (
          <DiscoverCardItem key={card.title} card={card} />
        ))}
      </div>
    </div>
  );
}
