"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, DownloadCloud, LayoutDashboard, Smartphone, Monitor, Loader2, Eye, ImageIcon, X, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import InteractivePBI from '@/components/InteractivePBI';
import Script from 'next/script';
import { getPublicPostByIdAction, getPostFileUrlAction } from '@/app/admin/actions';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { RegisterDialog } from '@/components/RegisterDialog';
import { ContentRenderer } from '@/components/tiptap/ContentRenderer';
import { getMediaUrl, formatPrice, hasPaidPrice } from '@/lib/utils';
import { AspectBadge } from '@/components/shared/AspectBadge';
import { useQuery } from '@tanstack/react-query';
import { useRazorpay } from '@/lib/useRazorpay';

export default function TemplateDetail() {
  const { data: sessionData } = authClient.useSession();
  const params = useParams();
  const postId = typeof params.id === 'string' ? params.id : '';

  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [viewCount, setViewCount] = useState<number | null>(null);

  // Fetch post data with caching
  const { data: post, isLoading: loading } = useQuery({
    queryKey: ['post-detail', postId],
    queryFn: () => getPublicPostByIdAction(postId),
    enabled: !!postId,
    staleTime: 2 * 60_000,
  });

  // Razorpay hook
  const { initiatePurchase, getStatus } = useRazorpay({
    onSuccess: () => setHasPurchased(true),
  });

  // Check if user has purchased this template
  const { data: purchaseData } = useQuery({
    queryKey: ['user-purchases-check', postId],
    queryFn: async () => {
      const res = await fetch('/api/user/purchases', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data.purchases) {
        return data.purchases.some((p: any) => p.postId === postId);
      }
      return false;
    },
    enabled: !!sessionData?.user && !!postId,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (purchaseData !== undefined) setHasPurchased(purchaseData);
  }, [purchaseData]);

  // Increment view count on page visit
  useEffect(() => {
    if (!postId) return;
    const incrementViews = async () => {
      try {
        const res = await fetch('/api/posts/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: postId }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setViewCount(data.views);
        }
      } catch {
        // silent fail for view tracking
      }
    };
    incrementViews();
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
          <p className="text-xs text-muted-foreground font-mono">RETRIEVING BLUEPRINT ARCHITECTURE...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-transparent text-foreground flex items-center justify-center">
        <div className="text-center p-4 border border-border bg-card/50 rounded-xl max-w-xs">
          <p className="text-xs text-muted-foreground">Specified blueprint framework could not be located.</p>
          <Link href="/" className="mt-3 inline-flex text-xs text-amber-600 dark:text-amber-400 hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const isVertical = post.aspect === 'vertical';
  const isFree = !hasPaidPrice(post.price);
  const displayPrice = formatPrice(post.price);
  const canDownload = hasPurchased || isFree;
  const paymentStatus = getStatus(postId);

  const handlePurchase = async () => {
    if (!sessionData?.user) {
      setShowLoginDialog(true);
      return;
    }
    if (isFree) return;
    initiatePurchase(post);
  };

  const handleDownload = async () => {
    if (!sessionData?.user) {
      setShowLoginDialog(true);
      return;
    }

    try {
      setIsDownloading(true);
      const fileUrl = await getPostFileUrlAction(postId);
      if (fileUrl) {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `${post.title || 'template'}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        toast.error("File not found for this template.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to download template");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground pb-16 selection:bg-amber-500/30">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-6 space-y-6">
        
        {/* Breadcrumb Navigation anchor */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs font-medium transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Workspace Portfolio
        </Link>

        {/* Global Split Detail Architecture Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Presentational Layout Container Left */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Context Identification Headers */}
            <div className="flex flex-col gap-5 border-b border-border pb-8">
              
              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-muted/50 border border-border/50 shadow-sm">
                  <AspectBadge aspect={post.aspect} className="text-[10px]" />
                </span>
                {viewCount !== null && (
                  <span className="px-2.5 py-1 rounded-md bg-muted/50 border border-border/50 text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <Eye className="w-3 h-3" />
                    {viewCount.toLocaleString()} {viewCount === 1 ? 'view' : 'views'}
                  </span>
                )}
              </div>
              
              {/* Title & Description */}
              <div className="space-y-1">
                <h1 className="text-xl font-medium tracking-tight text-foreground">{post.title}</h1>
                {post.description && (
                  <div className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl font-sans">
                    <ContentRenderer content={post.description} />
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {post.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="px-3.5 py-1.5 rounded-full bg-card border border-border text-[11px] font-medium text-foreground shadow-sm hover:border-amber-500/30 transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sandbox Production View */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Sandbox Production View
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/60">{post.url ? "Live Active Frame" : "Static Simulator Mock"}</span>
              </div>
              
              <div className="w-full flex justify-center bg-muted/30 p-4 border border-border rounded-2xl">
                {post.url ? (
                  <div 
                    className={`w-full border border-border shadow-2xl bg-card rounded-xl overflow-hidden transition-all duration-300 ${
                      isVertical ? 'max-w-[340px] aspect-[9/16]' : 'w-full aspect-video'
                    }`}
                  >
                    <iframe 
                      title={post.title}
                      className="w-full h-full border-0 bg-transparent"
                      src={post.url}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className={`w-full ${isVertical ? 'max-w-[340px]' : 'w-full'}`}>
                    <InteractivePBI />
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails Gallery Section */}
            {post.thumbnails && post.thumbnails.length > 0 && (
              <div className="space-y-4 pt-2 mt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5 mb-2">
                  <ImageIcon className="w-4 h-4 text-amber-400" /> Visual Gallery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {post.thumbnails.map((thumb: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="border border-border rounded-xl overflow-hidden bg-card/50 aspect-video relative group cursor-pointer"
                      onClick={() => setSelectedImage(thumb)}
                    >
                      <img src={getMediaUrl(thumb)} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reference Resources Section */}
            {post.references && post.references.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-border mt-6">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-500 animate-pulse" /> Educational & Reference Materials
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Explore additional articles, industry benchmarks, and learning materials curated for this dataset blueprint.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.references.map((ref: { label: string; url: string }, idx: number) => {
                    let domain = "Resource File";
                    try {
                      domain = new URL(ref.url).hostname.replace("www.", "");
                    } catch {}

                    return (
                      <a 
                        key={idx}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-4 rounded-2xl border border-border bg-card/30 hover:bg-[#1D1412]/20 hover:border-amber-500/30 hover:shadow-[0_4px_20px_rgba(245,158,11,0.03)] transition-all duration-300 shadow-sm"
                      >
                        <div className="space-y-1.5 pr-4 min-w-0">
                          <h4 className="font-semibold text-xs text-foreground group-hover:text-amber-400 transition-colors truncate">
                            {ref.label}
                          </h4>
                          <span className="inline-flex text-[9px] font-mono font-semibold text-muted-foreground/60 uppercase tracking-wide bg-muted/65 border border-border/40 px-2 py-0.5 rounded-md">
                            {domain}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-muted border border-border group-hover:border-amber-500/25 group-hover:bg-amber-500/10 flex items-center justify-center text-muted-foreground group-hover:text-amber-500 shrink-0 transition-all duration-300">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Commercial Checklist Sidebar Block Right */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-5 backdrop-blur-md shadow-lg">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  {canDownload ? "Asset Acquired" : "Commercial Transfer License"}
                </p>
                {!canDownload && (
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-mono font-bold text-amber-500 dark:text-amber-400">{displayPrice}</span>
                    <span className="text-[10px] text-muted-foreground/60 font-medium">/ persistent download link</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {canDownload ? (
                  <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 dark:shadow-emerald-500/20"
                  >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                    {isDownloading ? "Preparing File..." : "Download ZIP Asset"}
                  </button>
                ) : (
                  <button 
                    onClick={handlePurchase}
                    disabled={paymentStatus === 'processing'}
                    className="w-full h-10 rounded-xl bg-gradient-to-r from-amber-500 to-black hover:opacity-90 disabled:opacity-50 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10 dark:shadow-amber-500/20"
                  >
                    {paymentStatus === 'processing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                    {paymentStatus === 'processing' ? "Processing..." : "Initialize Asset Acquisition"}
                  </button>
                )}
                <button className="w-full h-10 rounded-xl bg-muted hover:bg-accent hover:text-accent-foreground text-xs text-foreground border border-border transition-all">
                  Inquire Custom Integration Support
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl w-full h-full flex items-center justify-center">
            <button 
              className="absolute top-4 right-4 md:top-2 md:right-2 z-50 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/20 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-4 h-4" />
            </button>
            <img 
              src={getMediaUrl(selectedImage)} 
              alt="Fullscreen Preview" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <RegisterDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog} 
        forceLoginView={true} 
      />
    </div>
  );
}