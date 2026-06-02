"use client";

import { useLocaleStore } from "@/store/useLocaleStore";
import type { Messages } from "./types";
import fr from "./messages/fr";
import en from "./messages/en";
import ln from "./messages/ln";

const messages: Record<string, Messages> = { fr, en, ln };

export function useT(): Messages {
  const locale = useLocaleStore((s) => s.locale);
  return messages[locale] ?? fr;
}
