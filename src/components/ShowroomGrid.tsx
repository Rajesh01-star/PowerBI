"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Sparkles, Loader2, ShoppingCart, CheckCircle2, XCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { ContentRenderer } from "@/components/tiptap/ContentRenderer";
import { AspectBadge } from '@/components/shared/AspectBadge';
import { PriceBadge } from '@/components/shared/PriceBadge';
import { getActiveThumbnail, hasPaidPrice } from '@/lib/utils';
import { useRazorpay } from '@/lib/useRazorpay';

interface ShowroomGridProps {
  posts: any[];
  limit?: number;
}

export function ShowroomGrid({ posts, limit }: ShowroomGridProps) {
  const [activeIframeId, setActiveIframeId] = React.useState<string | null>(null);
  const { initiatePurchase, getStatus } = useRazorpay();

  const handlePurchase = (e: React.MouseEvent, post: any) => {
    e.preventDefault();
    e.stopPropagation();
    initiatePurchase(post);
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div id="live-demo" className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[280px] gap-5">
        {posts.slice(0, limit).map((post, index) => {
          const isVertical = post.aspect === 'vertical';
          const isEven = index % 2 === 0;
          const isLoaded = activeIframeId === post.id;
          const status = getStatus(post.id);
          const isPaid = hasPaidPrice(post.price);
          const screenshotUrl = getActiveThumbnail(post);

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
              {/* Ambient Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-tr ${
                isEven ? 'from-amber-500/10 to-orange-500/10' : 'from-amber-600/10 to-amber-900/10'
              } blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
              
              {/* Main Container */}
              <div className="relative w-full h-full bg-card/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-border/80 transition-all duration-500 group-hover:border-border flex flex-col justify-between">
                
                {/* CANVAS GRAPHIC LAYER */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-muted/10">
                  {isLoaded && post.url ? (
                    <iframe 
                      title={post.title || "Live Preview"} 
                      className="w-full h-full border-0 absolute inset-0 z-0 transition-opacity duration-500"
                      src={post.url} 
                      allowFullScreen
                    />
                  ) : (
                    <img 
                      src={screenshotUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover opacity-75 dark:opacity-30 group-hover:opacity-90 dark:group-hover:opacity-45 transition-all duration-700 filter saturate-50 group-hover:saturate-100 group-hover:scale-105"
                    />
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex gap-1.5 z-10 backdrop-blur-md bg-background/80 rounded-md p-0.5 border border-border">
                    <AspectBadge aspect={post.aspect} />
                    <span className="px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground/60 flex items-center gap-1 border-l border-border">
                      <Eye className="w-2.5 h-2.5" />
                      {(post.views ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-30">
                    <PriceBadge price={post.price} />
                  </div>
                </div>

                {/* Card Title Info Block */}
                <div className="mt-auto w-full p-3.5 bg-gradient-to-t from-background via-background/95 to-transparent z-10 border-t border-border backdrop-blur-md flex items-center justify-between gap-3">
                  <div className="space-y-0.5 truncate flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-foreground truncate">{post.title || "Production Dashboard"}</h4>
                    <div className="text-[10px] text-muted-foreground truncate overflow-hidden">
                      {post.description ? (
                        <ContentRenderer content={post.description} className="[&>p]:m-0 [&>p]:inline [&_*]:!text-[10px] [&_*]:!text-muted-foreground" />
                      ) : (
                        "Hover to activate real-time intelligence interface."
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Purchase Button */}
                    {isPaid && (
                      <button
                        onClick={(e) => handlePurchase(e, post)}
                        disabled={status === 'processing' || status === 'success'}
                        className={`relative z-30 h-7 rounded-lg text-[10px] font-semibold flex items-center gap-1 px-2.5 transition-all duration-300 border ${
                          status === 'success'
                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 cursor-default'
                            : status === 'failed'
                            ? 'bg-red-500/20 border-red-500/30 text-red-500 dark:text-red-400'
                            : status === 'processing'
                            ? 'bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-300 cursor-wait'
                            : 'bg-amber-600 hover:bg-amber-500 border-amber-600 text-white shadow-md hover:scale-105 active:scale-95'
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          {status === 'processing' ? (
                            <motion.span key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" /> Pay...
                            </motion.span>
                          ) : status === 'success' ? (
                            <motion.span key="succ" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Paid
                            </motion.span>
                          ) : status === 'failed' ? (
                            <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Retry
                            </motion.span>
                          ) : (
                            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
                              <ShoppingCart className="w-3 h-3" /> Buy
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    )}
                    {/* Expand Icon */}
                    <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center border border-border text-muted-foreground group-hover:text-foreground group-hover:bg-amber-500/20 group-hover:border-amber-500/30 transition-all duration-300">
                      <Maximize2 className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Hover Interaction Layer */}
                <Link 
                  href={`/template/${post.id}`} 
                  className="absolute inset-0 z-20 flex items-center justify-center bg-transparent hover:bg-background/40 transition-colors duration-300 group/overlay"
                >
                  <div className={`px-4 py-2 rounded-xl text-xs font-medium text-white ${
                    isEven ? 'bg-amber-500/85 shadow-amber-500/20' : 'bg-amber-600/85 shadow-amber-600/20'
                  } border border-white/10 shadow-2xl opacity-0 scale-95 group-hover/overlay:opacity-100 group-hover/overlay:scale-100 transition-all duration-300 flex items-center gap-1.5 backdrop-blur-md`}>
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" /> View Fullscreen Space
                  </div>
                </Link>
                
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

export function ShowroomGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[280px] gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className="relative w-full h-full bg-card/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-border/80 flex flex-col justify-between animate-pulse row-span-1"
        >
          <div className="absolute inset-0 z-0 bg-muted/20" />
          <div className="mt-auto w-full p-3.5 bg-gradient-to-t from-background via-background/95 to-transparent z-10 border-t border-border flex items-center justify-between gap-3">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="h-3.5 bg-neutral-800/80 rounded w-3/4"></div>
              <div className="h-2 bg-neutral-800/80 rounded w-1/2"></div>
            </div>
            <div className="w-6 h-6 rounded-md bg-neutral-800/80 shrink-0"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
