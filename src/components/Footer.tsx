"use client";

import React from 'react';
import { Shield, Cpu } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs items-start">
        
        {/* Branding Capsule */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-border/40">
              <Cpu className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold tracking-tight text-foreground">Studio Analytics</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs">Premium engineered data visualization matrices and deployment assets built for enterprise pipelines.</p>
        </div>

        {/* Directory Columns */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Navigation Workspace</h4>
          <div className="flex flex-col gap-1.5 text-muted-foreground/80">
            <Link href="/" className="hover:text-foreground transition-colors text-[11px]">Showroom Matrix</Link>
            <Link href="#live-demo" className="hover:text-foreground transition-colors text-[11px]">Active Blueprints</Link>
          </div>
        </div>

        <div className="space-y-2.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Secure Settlement</h4>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted border border-border p-2 rounded-lg max-w-[220px]">
            <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Encrypted Ledger Gateway Active</span>
          </div>
        </div>

      </div>

      {/* Footer Bottom copyright seal */}
      <div className="max-w-7xl mx-auto px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-muted-foreground/60 font-mono">
        <p>© {new Date().getFullYear()} STUDIO ANALYTICS. ALL RIGHTS RESERVED.</p>
        <p className="tracking-tighter">BUILT FOR POWER BI TOPOLOGY</p>
      </div>
    </footer>
  );
}
