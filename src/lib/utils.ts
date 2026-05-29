import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";
  // Ensure exactly one slash between host and path key
  const base = publicUrl.endsWith("/") ? publicUrl.slice(0, -1) : publicUrl;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
}
