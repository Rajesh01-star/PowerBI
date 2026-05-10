"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import Link from 'next/link';

export function LiveDemo() {
  return (
    <div id="live-demo" className="w-full flex flex-col gap-16 mt-4">
      {/* First Iframe */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="relative w-full aspect-[16/9] bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)] transition-all hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.4)] duration-500">
          <iframe 
            title="Campaign Performance Marketing_Power BI project by Mohit Bhardwaj_April 25, 2026" 
            className="w-full h-full border-0 absolute inset-0 z-0 pointer-events-none"
            src="https://app.powerbi.com/view?r=eyJrIjoiMzNhODIyNDQtNjM5Ny00ZThhLTg1MjktOTc0ZDI1NWZiNWM3IiwidCI6ImI5ZjU1ZTRjLTRhNzEtNDg0ZS1iZWJiLTA3NThlYjRjZTUyNyJ9" 
            allowFullScreen={true}>
          </iframe>

          {/* Interactive Overlay */}
          <Link 
            href="/template/campaign-performance" 
            className="absolute inset-0 z-10 bg-[#050505]/20 hover:bg-[#050505]/10 flex items-center justify-center transition-colors duration-300 group/overlay"
          >
            <div className="px-6 py-3 rounded-full bg-indigo-600 shadow-xl opacity-0 group-hover/overlay:opacity-100 transition-all duration-300 flex items-center gap-2 transform translate-y-4 group-hover/overlay:translate-y-0 text-white font-medium">
              <BarChart3 className="w-5 h-5" />
              Click to Interact & Purchase
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Second Iframe */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="w-full max-w-[600px] mx-auto relative group"
        style={{ aspectRatio: '600 / 373.5' }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="relative w-full h-full bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] transition-all hover:shadow-[0_0_60px_-10px_rgba(168,85,247,0.4)] duration-500">
          <iframe 
            title="Gen Koffee Infographics - for 1st page only" 
            className="w-full h-full border-0 absolute inset-0 z-0 pointer-events-none"
            src="https://app.powerbi.com/view?r=eyJrIjoiZTRmYjI0NTMtZjk3MS00NzczLTlmZDItNTA2NTQyNzA5NWRiIiwidCI6ImI5ZjU1ZTRjLTRhNzEtNDg0ZS1iZWJiLTA3NThlYjRjZTUyNyJ9" 
            allowFullScreen={true}>
          </iframe>

          {/* Interactive Overlay */}
          <Link 
            href="/template/gen-koffee-infographics" 
            className="absolute inset-0 z-10 bg-[#050505]/20 hover:bg-[#050505]/10 flex items-center justify-center transition-colors duration-300 group/overlay"
          >
            <div className="px-6 py-3 rounded-full bg-purple-600 shadow-xl opacity-0 group-hover/overlay:opacity-100 transition-all duration-300 flex items-center gap-2 transform translate-y-4 group-hover/overlay:translate-y-0 text-white font-medium">
              <BarChart3 className="w-5 h-5" />
              Click to Interact & Purchase
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
