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

/** Extract initials from a name string (e.g. "John Doe" → "JD") */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Format large numbers with K/M suffix */
export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(0)}M+`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(0)}k+`;
  return `${views}+`;
}

/** Format ISO date string to human readable "May 29, 2026" */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Resolve active thumbnail URL from a post-like object with fallback */
export function getActiveThumbnail(post: {
  thumbnails?: string[] | null;
  activeThumbnailIndex?: number | null;
  imageUrl?: string | null;
}): string {
  const thumb = post.thumbnails?.[post.activeThumbnailIndex || 0] || post.imageUrl;
  return thumb ? getMediaUrl(thumb) : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80';
}

/** Format price for display ("Free" or "$12.99") */
export function formatPrice(price: string | null | undefined): string {
  if (!price || parseFloat(price) <= 0) return "Free";
  return `$${parseFloat(price).toFixed(2)}`;
}

/** Check if a post has a paid price */
export function hasPaidPrice(price: string | null | undefined): boolean {
  return !!price && parseFloat(price) > 0;
}

/** Simple hash for avatar selection */
export function getAvatarHash(id: string): number {
  return id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}
