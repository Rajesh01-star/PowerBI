import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Showroom } from '@/components/Showroom';
import { TransitionSection } from '@/components/TransitionSection';
import { Benefits } from '@/components/Benefits';
import { FeaturedTemplates } from '@/components/FeaturedTemplates';
import HeroParallaxDemo from '@/components/ui/hero-parallax-demo';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-transparent text-foreground overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

      <main className="relative">
        <Hero />
        
        <HeroParallaxDemo />
        

        {/* Main Sandbox Bento Showroom */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="space-y-1 mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Sandbox Showroom</h2>
            <p className="text-sm text-muted-foreground">Hover over active configurations to boot live workspace previews.</p>
          </div>
          <Suspense fallback={
            <div className="w-full py-20 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
              <p className="text-xs text-muted-foreground font-mono">LOADING SHOWROOM BLUEPRINTS...</p>
            </div>
          }>
            <Showroom limit={6} />
          </Suspense>

          {/* Marketplace Redirect Button */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-300 shadow-[0_10px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_10px_25px_rgba(245,158,11,0.4)] cursor-pointer"
            >
              <span>Explore Products</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <TransitionSection />

      <Benefits />
    </div>
  );
}