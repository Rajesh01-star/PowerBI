"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, BarChart3, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const templates = [
  { id: 'finance-pro', title: "Finance Pro Exec", category: "Finance", price: "$149", rating: 4.9, img: "bg-gradient-to-br from-emerald-900 to-slate-900" },
  { id: 'sales-command', title: "Sales Command Center", category: "Sales", price: "$129", rating: 4.8, img: "bg-gradient-to-br from-blue-900 to-slate-900" },
  { id: 'hr-analytics', title: "HR People Analytics", category: "HR", price: "$99", rating: 4.7, img: "bg-gradient-to-br from-purple-900 to-slate-900" },
  { id: 'marketing-roi', title: "Marketing ROI Dashboard", category: "Marketing", price: "$119", rating: 4.9, img: "bg-gradient-to-br from-pink-900 to-slate-900" },
  { id: 'supply-chain', title: "Supply Chain Operations", category: "Operations", price: "$159", rating: 4.6, img: "bg-gradient-to-br from-amber-900 to-slate-900" },
  { id: 'it-infrastructure', title: "IT Infrastructure Monitor", category: "IT", price: "$89", rating: 4.8, img: "bg-gradient-to-br from-cyan-900 to-slate-900" },
];

const categories = ["All", "Finance", "Sales", "HR", "Marketing", "Operations", "IT"];

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 text-sm transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Marketplace</h1>
            <p className="text-white/60">Discover premium Power BI templates for every business unit.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <button className="p-2 glass rounded-full hover:bg-white/10 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-3 mb-10 pb-2 scrollbar-hide">
          {categories.map((cat, i) => (
            <button 
              key={cat}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-indigo-600 text-white' : 'glass hover:bg-white/10 text-white/70'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, i) => (
            <motion.div 
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link href={`/template/${template.id}`} className="block glass-card rounded-3xl overflow-hidden group">
                <div className={`w-full aspect-[4/3] ${template.img} relative flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  <BarChart3 className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass text-xs font-medium backdrop-blur-md">
                    {template.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-heading font-semibold group-hover:text-indigo-400 transition-colors">{template.title}</h3>
                    <span className="font-mono font-medium text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">{template.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/50">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {template.rating}
                    </div>
                    <span>Instant Download</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
