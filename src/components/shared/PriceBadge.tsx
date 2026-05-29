import { hasPaidPrice, formatPrice } from '@/lib/utils';

interface PriceBadgeProps {
  price: string | null | undefined;
  className?: string;
}

/** Consistent price badge shown on template cards (green for paid, blue for free) */
export function PriceBadge({ price, className = '' }: PriceBadgeProps) {
  if (hasPaidPrice(price)) {
    return (
      <span className={`px-2.5 py-0.5 rounded-full bg-emerald-500 text-[10px] font-mono font-bold text-black shadow-[0_2px_10px_rgba(16,185,129,0.4)] ${className}`}>
        {formatPrice(price)}
      </span>
    );
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full bg-blue-500 text-[10px] font-mono font-bold text-white shadow-[0_2px_10px_rgba(59,130,246,0.4)] ${className}`}>
      Free
    </span>
  );
}
