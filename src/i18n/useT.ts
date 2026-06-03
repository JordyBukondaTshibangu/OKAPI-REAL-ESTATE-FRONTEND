"use client";

import { useLocaleStore } from "@/store/useLocaleStore";
import { messages } from "./index";
import type { Messages } from "./types";

export function useT(): Messages {
  const { locale } = useLocaleStore();
  return messages[locale];
}
