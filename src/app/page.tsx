import { Hero } from '@/components/Hero';
import { LiveDemo } from '@/components/LiveDemo';
import { Benefits } from '@/components/Benefits';
import { FeaturedTemplates } from '@/components/FeaturedTemplates';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
      
      <main className="relative z-10">
        <Hero />
        
        {/* Main Sandbox Bento Showroom */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="space-y-1 mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Sandbox Showroom</h2>
            <p className="text-sm text-white/50">Hover over active configurations to boot live workspace previews.</p>
          </div>
          <LiveDemo />
        </div>
      </main>

      <Benefits />
      <FeaturedTemplates />
      <Footer />
    </div>
  );
}