"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check, DownloadCloud, Server, ShieldCheck, Database, LayoutDashboard, Smartphone, Monitor, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import InteractivePBI from '@/components/InteractivePBI';
import Script from 'next/script';
import { getPublicPostByIdAction } from '@/app/admin/actions';

export default function TemplateDetail() {
  const params = useParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (typeof params.id === 'string') {
        try {
          const data = await getPublicPostByIdAction(params.id);
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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
          <p className="text-xs text-muted-foreground font-mono">RETRIEVING BLUEPRINT ARCHITECTURE...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center p-4 border border-border bg-card/50 rounded-xl max-w-xs">
          <p className="text-xs text-muted-foreground">Specified blueprint framework could not be located.</p>
          <Link href="/" className="mt-3 inline-flex text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Return Home</Link>
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

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 selection:bg-indigo-500/30">
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
            <div className="space-y-2 border-b border-border pb-4">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-muted border border-border text-[9px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  {isVertical ? <Smartphone className="w-2.5 h-2.5" /> : <Monitor className="w-2.5 h-2.5" />}
                  {post.aspect} Target
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/10 text-[9px] font-mono text-indigo-300 uppercase tracking-wider">Analytics</span>
                {viewCount !== null && (
                  <span className="px-2 py-0.5 rounded bg-muted border border-border text-[9px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" />
                    {viewCount.toLocaleString()} {viewCount === 1 ? 'view' : 'views'}
                  </span>
                )}
              </div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">{post.title}</h1>
              {post.description && (
                <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">{post.description}</p>
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

            {/* Technical Parameters Ledger */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-indigo-400" /> Platform Parameters
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border text-[11px]">
                    <span className="text-muted-foreground">Compatibility</span>
                    <span className="text-foreground font-medium">Power BI Cloud / Desktop</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border text-[11px]">
                    <span className="text-muted-foreground">Canvas Structure</span>
                    <span className="text-foreground font-medium uppercase">{post.aspect} layout</span>
                  </div>
                  <div className="flex justify-between py-1 text-[11px]">
                    <span className="text-muted-foreground">Core Version</span>
                    <span className="text-foreground font-mono">v1.0.0 (Latest Deployment)</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Integration Checklist
                </h3>
                <div className="space-y-2 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Optimized modeling connections setup ready.</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Native color scheme matrices built in.</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Custom DAX measures packaged cleanly.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Commercial Checklist Sidebar Block Right */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-card border border-border p-5 rounded-2xl space-y-5 backdrop-blur-md shadow-lg">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Commercial Transfer License</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-mono font-bold text-indigo-500 dark:text-indigo-400">{displayPrice}</span>
                  <span className="text-[10px] text-muted-foreground/60 font-medium">/ persistent download link</span>
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 disabled:opacity-50 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-500/10 dark:shadow-indigo-500/20"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                  {isProcessing ? "Processing..." : "Initialize Asset Acquisition"}
                </button>
                <button className="w-full h-10 rounded-xl bg-muted hover:bg-accent hover:text-accent-foreground text-xs text-foreground border border-border transition-all">
                  Inquire Custom Integration Support
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Architecture Components Delivery</h4>
                {[
                  "Power BI Deployment Blueprint Asset (.pbit)",
                  "Structured Data Schema Matrix Reference",
                  "Implementation & Onboarding Documentation Guide",
                  "Comprehensive Lifelong Framework Asset Updates"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground leading-tight">
                    <Database className="w-3.5 h-3.5 text-indigo-400/50 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}