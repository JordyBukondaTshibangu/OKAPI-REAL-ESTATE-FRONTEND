"use client";

import { useRef, useState } from "react";
import { Globe } from "lucide-react";
import { useLocaleStore, type Locale } from "@/store/useLocaleStore";

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ln", label: "Lingala", flag: "🇨🇩" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  function handleSelect(code: Locale) {
    setLocale(code);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-2.5 h-9 rounded-lg text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors min-w-max"
        aria-label="Changer de langue / Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{current.flag} {current.code.toUpperCase()}</span>
        <span className="sm:hidden">{current.flag}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-44 bg-card rounded-xl shadow-lg border border-border py-1.5 z-[60]"
          onMouseLeave={() => setOpen(false)}
        >
          {LOCALES.map(({ code, label, flag }) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                code === locale
                  ? "bg-accent text-primary font-semibold"
                  : "text-text-dark hover:bg-muted"
              }`}
            >
              <span className="text-base">{flag}</span>
              <span>{label}</span>
              {code === locale && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
