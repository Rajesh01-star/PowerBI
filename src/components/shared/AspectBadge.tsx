import { Smartphone, Monitor } from 'lucide-react';

interface AspectBadgeProps {
  aspect: 'horizontal' | 'vertical';
  className?: string;
}

/** Compact badge showing horizontal/vertical aspect with icon */
export function AspectBadge({ aspect, className = '' }: AspectBadgeProps) {
  const isVertical = aspect === 'vertical';
  return (
    <span className={`px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1 ${className}`}>
      {isVertical ? <Smartphone className="w-2.5 h-2.5" /> : <Monitor className="w-2.5 h-2.5" />}
      {aspect}
    </span>
  );
}
