"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Download, History, Package, Settings, LogOut, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const inventory = [
  { id: '1', title: 'Finance Pro Exec', date: 'Oct 12, 2026', version: 'v2.4.1', status: 'Active' },
  { id: '2', title: 'Sales Command Center', date: 'Sep 04, 2026', version: 'v1.8.0', status: 'Update Available' },
];

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-2">
            <div className="glass-card p-6 rounded-2xl mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl font-bold mb-4 border border-indigo-500/30">
                JD
              </div>
              <h2 className="font-heading font-semibold text-lg">John Doe</h2>
              <p className="text-sm text-white/50">john.doe@enterprise.com</p>
            </div>

            <nav className="space-y-1">
              <Link href="#" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-white font-medium border border-white/10">
                <Package className="w-4 h-4 text-indigo-400" /> My Inventory
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-white/70 hover:text-white transition-colors">
                <History className="w-4 h-4" /> Acquisition History
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-white/70 hover:text-white transition-colors">
                <Settings className="w-4 h-4" /> Account Settings
              </Link>
              <Link href="/" className="flex items-center gap-3 px-4 py-3 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl text-white/50 transition-colors mt-8">
                <LogOut className="w-4 h-4" /> Sign Out
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">My Inventory</h1>
              <p className="text-white/60">Manage your purchased templates and access licenses.</p>
            </div>

            <div className="space-y-4">
              {inventory.map((item, i) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        {item.status === 'Update Available' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Update
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/50 flex items-center gap-3">
                        <span>Purchased: {item.date}</span>
                        <span>•</span>
                        <span>Version: {item.version}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" /> Download .pbit
                    </button>
                    <button className="p-2 glass hover:bg-white/10 rounded-lg transition-colors border border-white/10 text-white/70 hover:text-white" title="View License">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State Mockup */}
            {inventory.length === 0 && (
              <div className="glass-card p-12 rounded-3xl flex flex-col items-center justify-center text-center">
                <Package className="w-16 h-16 text-white/20 mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2">No Templates Yet</h3>
                <p className="text-white/50 mb-6 max-w-sm">You haven't purchased any templates yet. Explore our marketplace to find the perfect dashboard.</p>
                <Link href="/marketplace" className="px-6 py-2.5 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors">
                  Browse Marketplace
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
