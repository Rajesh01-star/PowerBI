"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Eye } from 'lucide-react';
import Link from 'next/link';
import { getPublicPostsAction } from '@/app/admin/actions';
import { useQuery } from '@tanstack/react-query';
import { getActiveThumbnail, formatPrice } from '@/lib/utils';
import { AspectBadge } from '@/components/shared/AspectBadge';

export function FeaturedTemplates() {
  const { data: posts = [] } = useQuery({
    queryKey: ['featured-posts'],
    queryFn: () => getPublicPostsAction(),
    staleTime: 5 * 60_000, // Featured templates change rarely
  });

  // Pull top 3 high-value template configurations dynamically from DB rows
  const curatedCollection = [...posts]
    .sort((a, b) => (parseFloat(b.price ?? "0") || 0) - (parseFloat(a.price ?? "0") || 0))
    .slice(0, 3);

  if (curatedCollection.length === 0) return null;

  return (
    <section className="py-16 relative z-10 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Premium Solutions Suite</h2>
            <p className="text-xs text-muted-foreground">Curated high-performance analytical assets.</p>
          </div>
          <Link href="#live-demo" className="text-indigo-500 hover:text-indigo-400 font-medium text-xs flex items-center gap-1 group transition-colors">
            Explore entire hub <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {curatedCollection.map((post, i) => {
            const screenshotUrl = getActiveThumbnail(post);
            return (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, scale: 0.99 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/template/${post.id}`} className="block bg-card hover:bg-accent/40 border border-border hover:border-border/80 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-full aspect-video bg-muted/30 relative flex items-center justify-center border-b border-border overflow-hidden">
                    {screenshotUrl ? (
                      <img src={screenshotUrl} alt={post.title} className="w-full h-full object-cover opacity-75 dark:opacity-50 group-hover:opacity-100 dark:group-hover:opacity-75 transition-opacity duration-500" />
                    ) : (
                      <BarChart3 className="w-8 h-8 text-muted-foreground/20" />
                    )}
                    <div className="absolute top-3 left-3 flex gap-1 z-10">
                      <span className="px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm border border-border">
                        <AspectBadge aspect={post.aspect} />
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="space-y-0.5 truncate">
                      <h3 className="text-xs font-semibold text-foreground truncate">{post.title}</h3>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5 text-muted-foreground/60" />
                        {(post.views ?? 0).toLocaleString()} {(post.views ?? 0) === 1 ? 'view' : 'views'}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 shrink-0">
                      {formatPrice(post.price)}
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
