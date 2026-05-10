import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function AgentSelect({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="w-full h-11 px-3 rounded-lg border border-input bg-background flex items-center justify-between text-sm text-foreground/85 hover:border-primary/40 transition-colors"
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-1 rounded-lg border border-border bg-white shadow-lg z-30 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}
