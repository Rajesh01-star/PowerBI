import { BackgroundGlow } from './BackgroundGlow';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

/** 
 * Shared page wrapper with background glows, overflow handling, 
 * and standard padding/z-indexing used by product/contact/dashboard pages.
 */
export function PageShell({ children, className = '' }: PageShellProps) {
  return (
    <div className={`relative w-full min-h-screen bg-transparent text-foreground overflow-x-hidden selection:bg-amber-500/30 flex flex-col justify-between ${className}`}>
      <BackgroundGlow />
      {children}
    </div>
  );
}
