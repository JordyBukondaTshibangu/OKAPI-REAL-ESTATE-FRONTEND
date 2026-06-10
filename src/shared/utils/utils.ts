import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const R2_PUBLIC_BASE_URL = "https://pub-d5cad4963b964b9ba2720a29b5780d2b.r2.dev";

// next/image requires an absolute URL or a path starting with "/".
// Some backend records store bare R2 object keys (e.g. "tmp/abc.jpg")
// instead of full URLs; turn those into full R2 URLs.
export function getR2ImageUrl(key?: string | null): string | null {
  if (!key) return null;
  if (/^https?:\/\//.test(key) || key.startsWith("/")) return key;
  return `${R2_PUBLIC_BASE_URL}/${key}`;
}
