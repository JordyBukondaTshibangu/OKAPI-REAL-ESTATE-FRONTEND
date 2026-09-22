"use client";

import { useT } from "@/i18n/useT";

export default function ExclusiveBadge() {
  const label = useT().detail.property.exclusive;
  return (
    <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow-sm">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
        <path d="M12 2l1.5 4.5H18l-3.75 2.73L15.75 14 12 11.27 8.25 14l1.5-4.77L6 6.5h4.5L12 2z" />
      </svg>
      {label}
    </span>
  );
}
