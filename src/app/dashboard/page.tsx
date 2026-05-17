"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, History, Package, Settings, LogOut, LayoutDashboard, ExternalLink, Loader2, Monitor, Smartphone, ShieldCheck, Calendar, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

interface Purchase {
  orderId: string;
  paymentId: string;
  amount: string;
  purchasedAt: string;
  postId: string;
  title: string;
  description: string | null;
  price: string | null;
  url: string | null;
  aspect: 'horizontal' | 'vertical';
  imageUrl: string | null;
}

export default function UserDashboard() {
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch('/api/user/purchases');
        if (res.ok) {
          const data = await res.json();
          setPurchases(data.purchases || []);
        }
      } catch (err) {
        console.error('Failed to fetch purchases:', err);
      } finally {
        setLoading(false);
      }
    };
    if (sessionData?.user) {
      fetchPurchases();
    } else if (!sessionLoading) {
      setLoading(false);
    }
  }, [sessionData, sessionLoading]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Redirect if not logged in
  if (!sessionLoading && !sessionData?.user) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center p-6 border border-white/5 bg-white/[0.01] rounded-2xl max-w-sm space-y-4">
          <ShieldCheck className="w-8 h-8 text-indigo-400 mx-auto" />
          <p className="text-xs text-white/50">Authentication required to access your workspace.</p>
          <Link href="/" className="inline-flex text-xs text-indigo-400 hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const user = sessionData?.user;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 pb-20 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full md:w-56 shrink-0 space-y-2">
            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl mb-5">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold mb-3 border border-indigo-500/20">
                {user?.name ? getInitials(user.name) : '??'}
              </div>
              <h2 className="text-sm font-semibold text-white/90 truncate">{user?.name || 'User'}</h2>
              <p className="text-[11px] text-white/40 truncate">{user?.email || ''}</p>
            </div>

            <nav className="space-y-0.5">
              <Link href="/dashboard" className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white/[0.06] rounded-xl text-xs text-white font-medium border border-white/[0.06]">
                <Package className="w-3.5 h-3.5 text-indigo-400" /> My Inventory
              </Link>
              <Link href="#" className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-white/[0.03] rounded-xl text-xs text-white/50 hover:text-white/70 transition-colors">
                <History className="w-3.5 h-3.5" /> Acquisition History
              </Link>
              <Link href="#" className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-white/[0.03] rounded-xl text-xs text-white/50 hover:text-white/70 transition-colors">
                <Settings className="w-3.5 h-3.5" /> Account Settings
              </Link>
              <Link href="/" className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl text-xs text-white/30 transition-colors mt-6">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">

            {/* Header */}
            <div className="space-y-1 border-b border-white/5 pb-4">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/10 text-[9px] font-mono text-indigo-300 uppercase tracking-wider">Workspace</span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white/90">My Inventory</h1>
              <p className="text-xs text-white/50">Manage your purchased templates and access persistent download links.</p>
            </div>

            {/* Loading State */}
            {(loading || sessionLoading) && (
              <div className="flex items-center justify-center py-20">
                <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  SYNCHRONIZING ASSET INVENTORY...
                </div>
              </div>
            )}

            {/* Purchased Templates */}
            {!loading && !sessionLoading && purchases.length > 0 && (
              <div className="space-y-3">
                <AnimatePresence>
                  {purchases.map((item, i) => {
                    const isVertical = item.aspect === 'vertical';
                    const screenshotUrl = item.imageUrl || `https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=60`;

                    return (
                      <motion.div
                        key={item.orderId}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">

                          {/* Thumbnail */}
                          <div className="w-16 h-16 rounded-xl bg-black border border-white/5 overflow-hidden shrink-0 relative">
                            <img
                              src={screenshotUrl}
                              alt={item.title}
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute bottom-1 right-1">
                              <span className="px-1 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[8px] font-mono text-white/50 uppercase border border-white/5 flex items-center gap-0.5">
                                {isVertical ? <Smartphone className="w-2 h-2" /> : <Monitor className="w-2 h-2" />}
                                {item.aspect}
                              </span>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-semibold text-white/90 truncate">{item.title}</h3>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-mono font-bold text-emerald-400 uppercase tracking-wider shrink-0">
                                Paid
                              </span>
                            </div>
                            {item.description && (
                              <p className="text-[10px] text-white/35 truncate max-w-lg">{item.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-[10px] text-white/30 font-mono">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5" />
                                {formatDate(item.purchasedAt)}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <CreditCard className="w-2.5 h-2.5" />
                                ${parseFloat(item.amount).toFixed(2)}
                              </span>
                              {item.paymentId && (
                                <>
                                  <span>•</span>
                                  <span className="truncate max-w-[120px]">{item.paymentId}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <Link
                              href={`/template/${item.postId}`}
                              className="h-7 px-3 bg-indigo-500/80 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-medium transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-500/10"
                            >
                              <Download className="w-3 h-3" /> Download .pbit
                            </Link>
                            <Link
                              href={`/template/${item.postId}`}
                              className="h-7 w-7 bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
                              title="View Template"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Empty State */}
            {!loading && !sessionLoading && purchases.length === 0 && (
              <div className="bg-white/[0.01] border border-white/5 p-12 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-5">
                  <LayoutDashboard className="w-6 h-6 text-white/15" />
                </div>
                <h3 className="text-sm font-semibold text-white/80 mb-1">No Templates Acquired</h3>
                <p className="text-[11px] text-white/35 mb-6 max-w-xs leading-relaxed">
                  Your workspace inventory is empty. Browse the Sandbox Showroom to discover production-ready analytics frameworks.
                </p>
                <Link
                  href="/"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20"
                >
                  Browse Showroom
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
