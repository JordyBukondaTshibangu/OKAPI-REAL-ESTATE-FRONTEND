import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// next/image requires an absolute URL or a path starting with "/".
// Backend records can contain bare R2 object keys (e.g. "tmp/abc.jpg")
// for uploads that were never finalized; filter those out before use.
export function isValidImageUrl(src?: string | null): src is string {
  if (!src) return false;
  return /^https?:\/\//.test(src) || src.startsWith("/");
}
