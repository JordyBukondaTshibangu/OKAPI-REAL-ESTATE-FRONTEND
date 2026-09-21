import { DiscoverCard } from "./Discover";
import DiscoverCardItem from "./DiscoverCardItem";

export default function CardsGrid({ cards }: { cards: DiscoverCard[] }) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-xl shadow-md dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden border-t-4 border-secondary dark:border-secondary">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border dark:divide-white/10">
        {cards.map((card) => (
          <DiscoverCardItem key={card.title} card={card} />
        ))}
      </div>
    </div>
  );
}
