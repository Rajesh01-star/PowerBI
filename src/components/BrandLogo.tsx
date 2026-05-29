import React from 'react';
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customSizeClass?: string;
  wrap?: boolean;
}

export function BrandLogo({ className, size = 'md', customSizeClass, wrap = true }: BrandLogoProps) {
  // Map size prop to standard styling sizing classes
  const sizeClasses = {
    sm: "text-xs tracking-wide",
    md: "text-sm sm:text-base tracking-wider",
    lg: "text-lg sm:text-xl tracking-widest",
    xl: "text-2xl sm:text-3xl tracking-widest",
    custom: customSizeClass || ""
  };

  return (
    <span 
      className={cn(
        "font-serif font-semibold select-none leading-tight inline-flex items-center",
        wrap ? "flex-wrap" : "whitespace-nowrap",
        sizeClasses[size],
        className
      )}
      style={{
        // Fallback explicitly to Garamond serif font if --font-serif is not applied
        fontFamily: 'var(--font-serif), Garamond, Georgia, serif'
      }}
    >
      <span className="text-[#E0A154] whitespace-nowrap">GENGRAPHS</span>
      <span className="text-[#414141] dark:text-[#525252] transition-colors ml-[0.3em] whitespace-nowrap">
        AND GRAPHICS PVT LTD
      </span>
      <sup className="text-[0.6em] text-[#414141] dark:text-[#525252] ml-[0.1em] font-sans font-normal align-super">
        ®
      </sup>
    </span>
  );
}
