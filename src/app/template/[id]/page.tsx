"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check, DownloadCloud, Server, ShieldCheck, Database, LayoutDashboard } from 'lucide-react';
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
        <div className="text-xl text-white/50">Loading template details...</div>
      </div>
    );
  }

  if (!loading && !post) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-xl text-white/50">Template not found.</div>
      </div>
    );
  }

  const template = {
    id: params.id,
    title: post?.title || "Template",
    category: "Analytics", // Fallback if category is not in post
    price: post?.price ? `$${post.price}` : "$149",
    description: post?.description || "No description available.",
    features: [
      "Real-time General Ledger integration",
      "Dynamic P&L and Balance Sheet visualizations",
      "Automated cash flow forecasting",
      "Multi-currency support",
      "Row-level security ready"
    ],
    specs: [
      { label: "Compatibility", value: "Power BI Desktop & Service" },
      { label: "Data Sources", value: "SQL, Excel, Dynamics 365" },
      { label: "Theme", value: "Dark/Light (Configurable)" },
      { label: "Version", value: "2.4.1" },
    ]
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content (Preview + Specs) */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="inline-flex px-3 py-1 rounded-full glass text-xs font-medium text-indigo-400 mb-4">
                {template.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{template.title}</h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
                {template.description}
              </p>
            </div>

            {/* Live Preview Simulation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-indigo-500" /> {post?.url ? "Interactive Dashboard Preview" : "Live Preview Simulation"}
                </h2>
                <span className="text-sm text-white/40">{post?.url ? "Live Power BI Embed" : "Interactive Data Mockup"}</span>
              </div>
              
              {post?.url ? (
                <div 
                  className={`relative w-full overflow-hidden border border-white/10 shadow-[0_0_30px_-10px_rgba(99,102,241,0.2)] rounded-2xl bg-white/5 backdrop-blur-xl ${post.aspect !== 'horizontal' ? 'max-w-[600px] mx-auto' : ''}`}
                  style={{ aspectRatio: post.aspect !== 'horizontal' ? '600 / 373.5' : '16 / 9' }}
                >
                  <iframe 
                    title={template.title}
                    className="w-full h-full border-0 absolute inset-0 z-0"
                    src={post.url}
                    allowFullScreen={true}>
                  </iframe>
                </div>
              ) : (
                <InteractivePBI />
              )}
            </div>

            {/* Technical Specs & Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-indigo-400" /> Technical Specs
                </h3>
                <ul className="space-y-3">
                  {template.specs.map((spec, i) => (
                    <li key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <span className="text-sm text-white/60">{spec.label}</span>
                      <span className="text-sm font-medium">{spec.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" /> Enterprise Features
                </h3>
                <ul className="space-y-3">
                  {template.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
              <div className="mb-6">
                <span className="text-4xl font-mono font-bold text-indigo-400">{template.price}</span>
                <span className="text-white/40 ml-2">/ one-time</span>
              </div>

              <div className="space-y-4 mb-8">
                <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <DownloadCloud className="w-5 h-5" /> Buy Template Now
                </button>
                <button className="w-full py-4 glass hover:bg-white/10 text-white rounded-xl font-medium transition-all">
                  Request Customization
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white/80 uppercase tracking-wider mb-2">What's Included</h4>
                {[
                  "Power BI Template (.pbit) File",
                  "Sample Data Dataset (.csv)",
                  "Implementation Guide (.pdf)",
                  "6 Months Premium Support",
                  "Free Lifetime Updates"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                    <Database className="w-4 h-4 text-indigo-400/70 shrink-0" />
                    {item}
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
        templateName={template.title}
        price={template.price}
      />
    </div>
  );
}
