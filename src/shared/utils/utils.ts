import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const R2_PUBLIC_BASE_URL = "https://pub-d5cad4963b964b9ba2720a29b5780d2b.r2.dev";

// next/image requires an absolute URL or a path starting with "/".
// Some backend records store bare R2 object keys (e.g. "tmp/abc.jpg")
// instead of full URLs; turn those into full R2 URLs.
// Also normalizes double/triple-prefixed URLs that accumulated from a previous
// bug where toGalleryUrl didn't guard against already-absolute keys.
export function getR2ImageUrl(key?: string | null): string | null {
  if (!key) return null;
  if (key.startsWith("/")) return key;

  // Strip any repeated R2 base URL prefixes to heal corrupted DB entries.
  const prefix = R2_PUBLIC_BASE_URL + "/";
  let normalized = key;
  while (normalized.startsWith(prefix)) {
    normalized = normalized.slice(prefix.length);
  }

  // If after stripping it's still absolute (e.g. a different CDN), return as-is.
  if (/^https?:\/\//.test(normalized)) return normalized;

  return `${R2_PUBLIC_BASE_URL}/${normalized}`;
}
