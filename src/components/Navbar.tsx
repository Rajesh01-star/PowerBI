import React from 'react';
import Link from 'next/link';
import { Command, Maximize } from 'lucide-react';

export function Navbar() {
  return (
    <div className="fixed top-3 sm:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
      <div className="w-full max-w-3xl">
        <nav className="bg-[#111111]/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-white/[0.08] flex w-full items-center justify-between rounded-2xl border px-3 sm:px-5 py-2 sm:py-2.5 pr-2 sm:pr-2.5 backdrop-blur-md">
          <div className="flex items-center gap-2 py-1 text-sm font-semibold">
            <img src="https://cdn.skiper-ui.com/logos/logo.svg" alt="Logo" className="w-6 h-6" />
            <Link href="/" className="text-white tracking-wide hidden xs:block">SKIPER-UI</Link>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 text-[12px] sm:text-[13px]">
            <Link 
              className="rounded-md opacity-50 outline-offset-4 outline-sky-500 hover:opacity-100 focus-visible:outline-1 transition-opacity" 
              href="/pricing"
            >
              Pricing
            </Link>
            <Link 
              className="relative text-white/50 hover:text-white flex gap-1 rounded-md outline-offset-4 outline-sky-500 focus-visible:outline-1 transition-colors" 
              href="/components"
            >
              Components
            </Link>
            
            <div className="flex gap-2">
              <div className="bg-white/5 hover:bg-white/10 transition-colors flex w-8 h-8 items-center justify-center rounded-[12px]">
                <button type="button" className="flex items-center w-full h-full rounded-2xl">
                  <span className="flex items-center justify-center w-full h-full cursor-pointer transition-all ease-in-out active:scale-95 text-white/70 hover:text-white">
                    <Command className="w-4 h-4" />
                  </span>
                  <span className="sr-only">Command + K</span>
                </button>
              </div>
              
              <div className="bg-white/5 hover:bg-white/10 transition-colors flex w-8 h-8 items-center justify-center rounded-[12px]">
                <button type="button" className="flex items-center w-full h-full">
                  <span className="flex items-center justify-center w-full h-full cursor-pointer transition-all ease-in-out active:scale-95 text-white/70 hover:text-white">
                    <Maximize className="w-4 h-4" />
                  </span>
                  <span className="sr-only">Show Menu</span>
                </button>
              </div>
            </div>
            
          </div>
        </nav>
      </div>
    </div>
  );
}