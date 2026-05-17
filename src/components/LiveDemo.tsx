"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Sparkles, Smartphone, Monitor, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getPublicPostsAction } from '@/app/admin/actions';
import { useQuery } from '@tanstack/react-query';

export function LiveDemo() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['public-posts'],
    queryFn: getPublicPostsAction,
  });

  // Keep track of which card is currently active/hovered
  const [activeIframeId, setActiveIframeId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
          SYNCING CACHED FRAMEWORKS...
        </div>
      </div>
    );
  }

  return (
    <div id="live-demo" className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[280px] gap-5 mt-4">
      {posts.map((post, index) => {
        const isVertical = post.aspect === 'vertical';
        const isEven = index % 2 === 0;
        const isLoaded = activeIframeId === post.id;

        // Fallback placeholder images if no unique asset screenshot is provided
        const screenshotUrl = post.imageUrl || `https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80`;

        return (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.04 }}
            onMouseEnter={() => setActiveIframeId(post.id)}
            onMouseLeave={() => setActiveIframeId(null)}
            className={`relative group ${isVertical ? 'row-span-2 h-full' : 'row-span-1'}`}
          >
            {/* Ambient Background Blur Glow */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${
              isEven ? 'from-indigo-500/10 to-blue-500/10' : 'from-purple-500/10 to-pink-500/10'
            } blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
            
            {/* Main Container */}
            <div className="relative w-full h-full bg-[#0d0d11]/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-white/10 flex flex-col justify-between">
              
              {/* CANVAS GRAPHIC LAYER */}
              <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-950">
                {isLoaded && post.url ? (
                  /* The iframe only renders when hovered */
                  <iframe 
                    title={post.title || "Live Preview"} 
                    className="w-full h-full border-0 absolute inset-0 z-0 transition-opacity duration-500"
                    src={post.url} 
                    allowFullScreen
                  />
                ) : (
                  /* Static snapshot placeholder image when idle */
                  <img 
                    src={screenshotUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-all duration-700 filter saturate-50 group-hover:saturate-100 group-hover:scale-105"
                  />
                )}

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex gap-1.5 z-10 backdrop-blur-md bg-black/40 rounded-md p-0.5 border border-white/5">
                  <span className="px-1.5 py-0.5 text-[9px] font-mono text-white/50 uppercase tracking-wider flex items-center gap-1">
                    {isVertical ? <Smartphone className="w-2.5 h-2.5" /> : <Monitor className="w-2.5 h-2.5" />}
                    {post.aspect}
                  </span>
                </div>

                {post.price && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400 z-10 backdrop-blur-md">
                    ${parseFloat(post.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Card Title Info Block */}
              <div className="mt-auto w-full p-3.5 bg-gradient-to-t from-[#050508] via-[#050508]/95 to-transparent z-10 border-t border-white/5 backdrop-blur-md flex items-center justify-between gap-4">
                <div className="space-y-0.5 truncate">
                  <h4 className="text-xs font-semibold text-white/90 truncate">{post.title || "Production Dashboard"}</h4>
                  <p className="text-[10px] text-white/40 truncate">{post.description || "Hover to activate real-time intelligence interface."}</p>
                </div>
                <div className="w-6 h-6 rounded-md bg-white/5 flex items-shrink-0 items-center justify-center border border-white/5 text-white/40 group-hover:text-white group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all duration-300">
                  <Maximize2 className="w-3 h-3" />
                </div>
              </div>

              {/* Hover Interaction Layer */}
              <Link 
                href={`/template/${post.id}`} 
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors duration-300 group/overlay"
              >
                <div className={`px-4 py-2 rounded-xl text-xs font-medium text-white ${
                  isEven ? 'bg-indigo-500/85 shadow-indigo-500/20' : 'bg-purple-500/85 shadow-purple-500/20'
                } border border-white/10 shadow-2xl opacity-0 scale-95 group-hover/overlay:opacity-100 group-hover/overlay:scale-100 transition-all duration-300 flex items-center gap-1.5 backdrop-blur-md`}>
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> View Fullscreen Space
                </div>
              </Link>
              
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}