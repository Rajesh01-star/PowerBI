"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check, DownloadCloud, Server, ShieldCheck, Database, LayoutDashboard, Smartphone, Monitor, Loader2, Eye, ImageIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import InteractivePBI from '@/components/InteractivePBI';
import Script from 'next/script';
import { getPublicPostByIdAction, getPostFileUrlAction } from '@/app/admin/actions';
import { authClient } from '@/lib/auth-client';

export default function TemplateDetail() {
  const { data: sessionData } = authClient.useSession();
  const params = useParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (typeof params.id === 'string') {
        try {
          const data = await getPublicPostByIdAction(params.id);
          console.log(data)
          setPost(data);
        } catch (error) {
          console.error("Failed to fetch post:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPost();
  }, [params.id]);

  // Check if user has purchased this template
  useEffect(() => {
    const checkPurchase = async () => {
      if (sessionData?.user && params.id && typeof params.id === 'string') {
        try {
          const res = await fetch('/api/user/purchases');
          const data = await res.json();
          if (res.ok && data.purchases) {
            const purchased = data.purchases.some((p: any) => p.postId === params.id);
            setHasPurchased(purchased || sessionData.user.isAdmin);
          }
        } catch (error) {
          console.error("Failed to check purchases:", error);
        }
      }
    };
    checkPurchase();
  }, [sessionData, params.id]);

  // Increment view count on page visit
  useEffect(() => {
    const incrementViews = async () => {
      if (typeof params.id === 'string') {
        try {
          const res = await fetch('/api/posts/views', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: params.id }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setViewCount(data.views);
          }
        } catch (error) {
          console.error('Failed to increment views:', error);
        }
      }
    };
    incrementViews();
  }, [params.id]);

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
  const displayPrice = post.price ? `$${parseFloat(post.price).toFixed(2)}` : "Free";

  const handlePurchase = async () => {
    if (!post || !post.price || parseFloat(post.price) <= 0) {
      alert("This template is free or invalid price.");
      return;
    }

    try {
      setIsProcessing(true);
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create order");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use NEXT_PUBLIC_ for client-side
        amount: data.amount,
        currency: data.currency,
        name: "PowerBI Templates",
        description: post.title,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              alert("Payment successful! You can now access your template.");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error", err);
            alert("Error verifying payment");
          }
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("An error occurred while initializing checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const fileUrl = await getPostFileUrlAction(params.id as string);
      if (fileUrl) {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `${post.title || 'template'}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert("File not found for this template.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to download template");
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
                <span className="px-2.5 py-1 rounded-md bg-muted/50 border border-border/50 text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  {isVertical ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                  {post.aspect} Target
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
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl font-sans">{post.description}</p>
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

            {/* Micro Dynamic Sandbox Aspect Ratio Iframe Frame Node */}
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
                      <img src={thumb} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Commercial Checklist Sidebar Block Right */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-5 backdrop-blur-md shadow-lg">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  {hasPurchased ? "Asset Acquired" : "Commercial Transfer License"}
                </p>
                {!hasPurchased && (
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-mono font-bold text-amber-500 dark:text-amber-400">{displayPrice}</span>
                    <span className="text-[10px] text-muted-foreground/60 font-medium">/ persistent download link</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {hasPurchased ? (
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
                    disabled={isProcessing}
                    className="w-full h-10 rounded-xl bg-gradient-to-r from-amber-500 to-black hover:opacity-90 disabled:opacity-50 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10 dark:shadow-amber-500/20"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                    {isProcessing ? "Processing..." : "Initialize Asset Acquisition"}
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
              src={selectedImage} 
              alt="Fullscreen Preview" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}