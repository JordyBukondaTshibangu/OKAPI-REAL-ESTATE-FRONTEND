"use client";

type Grade = "NOUVEAU" | "ACTIF" | "FIABLE" | "EXPERT";

const GRADE_CONFIG: Record<Grade, { label: string; emoji: string; classes: string } | null> = {
  NOUVEAU: null, // no badge for NOUVEAU
  ACTIF: {
    label: "Agent Actif",
    emoji: "🟢",
    classes: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  },
  FIABLE: {
    label: "Agent Fiable",
    emoji: "🔵",
    classes: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
  },
  EXPERT: {
    label: "Agent Expert",
    emoji: "⭐",
    classes: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
  },
};

interface Props {
  grade?: Grade | null;
  size?: "sm" | "md";
}

export default function AgentGradeBadge({ grade, size = "sm" }: Props) {
  if (!grade || !GRADE_CONFIG[grade]) return null;
  const config = GRADE_CONFIG[grade]!;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${config.classes} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span>{config.emoji}</span>
      {config.label}
    </span>
  );
}
