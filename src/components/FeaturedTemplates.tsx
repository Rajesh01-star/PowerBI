"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Star } from 'lucide-react';
import Link from 'next/link';

export function FeaturedTemplates() {
  const featuredTemplates = [
    { id: 'finance-pro', title: "Finance Pro Exec", category: "Finance", price: "$149", rating: 4.9, img: "bg-gradient-to-br from-emerald-900 to-slate-900" },
    { id: 'sales-command', title: "Sales Command Center", category: "Sales", price: "$129", rating: 4.8, img: "bg-gradient-to-br from-blue-900 to-slate-900" },
    { id: 'hr-analytics', title: "HR People Analytics", category: "HR", price: "$99", rating: 4.7, img: "bg-gradient-to-br from-purple-900 to-slate-900" },
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Curated Collection</h2>
            <p className="text-white/60">Our most requested enterprise templates.</p>
          </div>
          <Link href="/marketplace" className="text-indigo-400 hover:text-indigo-300 font-medium text-sm flex items-center gap-1 group">
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTemplates.map((template, i) => (
            <motion.div 
              key={template.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/template/${template.id}`} className="block glass-card rounded-3xl overflow-hidden group">
                <div className={`w-full aspect-[4/3] ${template.img} relative flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  <BarChart3 className="w-16 h-16 text-white/20" />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass text-xs font-medium">
                    {template.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-heading font-semibold">{template.title}</h3>
                    <span className="font-mono font-medium text-indigo-400">{template.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-white/50">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {template.rating} • Premium Support
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
