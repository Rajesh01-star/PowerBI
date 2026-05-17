"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Sparkles, Monitor, Smartphone, Eye } from 'lucide-react';
import Link from 'next/link';
import { getPublicPostsAction } from '@/app/admin/actions';
import { useQuery } from '@tanstack/react-query';

export function FeaturedTemplates() {
  const { data: posts = [] } = useQuery({
    queryKey: ['public-posts'],
    queryFn: () => getPublicPostsAction(),
  });

  // Pull top 3 high-value template configurations dynamically from DB rows
  const curatedCollection = [...posts]
    .sort((a, b) => (parseFloat(b.price ?? "0") || 0) - (parseFloat(a.price ?? "0") || 0))
    .slice(0, 3);

  if (curatedCollection.length === 0) return null;

  return (
    <section className="py-16 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/80">Premium Solutions Suite</h2>
            <p className="text-xs text-white/40">Curated high-performance analytical assets.</p>
          </div>
          <Link href="#live-demo" className="text-indigo-400 hover:text-indigo-300 font-medium text-xs flex items-center gap-1 group transition-colors">
            Explore entire hub <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {curatedCollection.map((post, i) => {
            const isVertical = post.aspect === 'vertical';
            return (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, scale: 0.99 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/template/${post.id}`} className="block bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl overflow-hidden group transition-all duration-300">
                  <div className="w-full aspect-video bg-zinc-900/40 relative flex items-center justify-center border-b border-white/5 overflow-hidden">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                    ) : (
                      <BarChart3 className="w-8 h-8 text-white/10" />
                    )}
                    <div className="absolute top-3 left-3 flex gap-1 z-10">
                      <span className="px-1.5 py-0.5 rounded bg-black/40 text-[8px] font-mono tracking-wider uppercase text-white/40 border border-white/5 flex items-center gap-1">
                        {isVertical ? <Smartphone className="w-2 h-2" /> : <Monitor className="w-2 h-2" />}
                        {post.aspect}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="space-y-0.5 truncate">
                      <h3 className="text-xs font-semibold text-white/90 truncate">{post.title}</h3>
                      <p className="text-[10px] text-white/40 flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5 text-white/30" />
                        {(post.views ?? 0).toLocaleString()} {(post.views ?? 0) === 1 ? 'view' : 'views'}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-xs text-emerald-400 shrink-0">
                      ${post.price ? parseFloat(post.price).toFixed(2) : "0.00"}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
