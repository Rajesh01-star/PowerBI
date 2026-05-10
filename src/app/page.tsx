import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { LiveDemo } from '@/components/LiveDemo';
import { Benefits } from '@/components/Benefits';
import { FeaturedTemplates } from '@/components/FeaturedTemplates';

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <LiveDemo />
        </div>
      </main>

      <Benefits />
      <FeaturedTemplates />
    </div>
  );
}