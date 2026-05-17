"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check, DownloadCloud, Server, ShieldCheck, Database, LayoutDashboard, Smartphone, Monitor, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import InteractivePBI from '@/components/InteractivePBI';
import CheckoutModal from '@/components/CheckoutModal';
import { getPublicPostByIdAction } from '@/app/admin/actions';

export default function TemplateDetail() {
  const params = useParams();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
          <p className="text-xs text-white/40 font-mono">RETRIEVING BLUEPRINT ARCHITECTURE...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center p-4 border border-white/5 bg-white/[0.01] rounded-xl max-w-xs">
          <p className="text-xs text-white/50">Specified blueprint framework could not be located.</p>
          <Link href="/" className="mt-3 inline-flex text-xs text-indigo-400 hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const isVertical = post.aspect === 'vertical';
  const displayPrice = post.price ? `$${parseFloat(post.price).toFixed(2)}` : "Free";

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-16 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-6 space-y-6">
        
        {/* Breadcrumb Navigation anchor */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-medium transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Workspace Portfolio
        </Link>

        {/* Global Split Detail Architecture Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Presentational Layout Container Left */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Context Identification Headers */}
            <div className="space-y-2 border-b border-white/5 pb-4">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-white/40 uppercase tracking-wider flex items-center gap-1">
                  {isVertical ? <Smartphone className="w-2.5 h-2.5" /> : <Monitor className="w-2.5 h-2.5" />}
                  {post.aspect} Target
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/10 text-[9px] font-mono text-indigo-300 uppercase tracking-wider">Analytics</span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white/90">{post.title}</h1>
              {post.description && (
                <p className="text-xs text-white/50 leading-relaxed max-w-3xl">{post.description}</p>
              )}
            </div>

            {/* Micro Dynamic Sandbox Aspect Ratio Iframe Frame Node */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase font-bold tracking-wider">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Sandbox Production View
                </div>
                <span className="text-[10px] font-mono text-white/30">{post.url ? "Live Active Frame" : "Static Simulator Mock"}</span>
              </div>
              
              <div className="w-full flex justify-center bg-black/20 p-4 border border-white/5 rounded-2xl">
                {post.url ? (
                  <div 
                    className={`w-full border border-white/10 shadow-2xl bg-black rounded-xl overflow-hidden transition-all duration-300 ${
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
              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-indigo-400" /> Platform Parameters
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5 text-[11px]">
                    <span className="text-white/40">Compatibility</span>
                    <span className="text-white/80 font-medium">Power BI Cloud / Desktop</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5 text-[11px]">
                    <span className="text-white/40">Canvas Structure</span>
                    <span className="text-white/80 font-medium uppercase">{post.aspect} layout</span>
                  </div>
                  <div className="flex justify-between py-1 text-[11px]">
                    <span className="text-white/40">Core Version</span>
                    <span className="text-white/80 font-mono">v1.0.0 (Latest Deployment)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Integration Checklist
                </h3>
                <div className="space-y-2 text-[11px] text-white/70">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Optimized modeling connections setup ready.</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Native color scheme matrices built in.</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Custom DAX measures packaged cleanly.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Commercial Checklist Sidebar Block Right */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-5 backdrop-blur-md shadow-xl">
              <div>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Commercial Transfer License</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-mono font-bold text-indigo-400">{displayPrice}</span>
                  <span className="text-[10px] text-white/30 font-medium">/ persistent download link</span>
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-xs text-white font-medium flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-500/10"
                >
                  <DownloadCloud className="w-4 h-4" /> Initialize Asset Acquisition
                </button>
                <button className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/80 border border-white/5 transition-all">
                  Inquire Custom Integration Support
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Architecture Components Delivery</h4>
                {[
                  "Power BI Deployment Blueprint Asset (.pbit)",
                  "Structured Data Schema Matrix Reference",
                  "Implementation & Onboarding Documentation Guide",
                  "Comprehensive Lifelong Framework Asset Updates"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-white/50 leading-tight">
                    <Database className="w-3.5 h-3.5 text-indigo-400/50 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        templateName={post.title}
        price={displayPrice}
      />
    </div>
  );
}