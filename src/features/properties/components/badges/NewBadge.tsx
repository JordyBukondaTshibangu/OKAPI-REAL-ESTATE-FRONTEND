"use client";
import { useT } from "@/i18n/useT";

export default function NewBadge() {
  const t = useT();
  return (
    <span className="inline-flex items-center bg-secondary text-secondary-foreground text-[10px] font-semibold px-2 py-1 rounded-md">
      {t.cards.newBadge}
    </span>
  );
}
