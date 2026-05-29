"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Package, LogOut, LayoutDashboard, ExternalLink, Loader2, Monitor, Smartphone, ShieldCheck, Calendar, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { getInitials, formatDate, getActiveThumbnail } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

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
  thumbnails?: string[] | null;
  activeThumbnailIndex?: number | null;
}

export default function UserDashboard() {
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();

  // Replaces custom fetch + state + useEffect with useQuery
  const { data: purchases = [], isLoading: loading } = useQuery<Purchase[]>({
    queryKey: ['user-purchases'],
    queryFn: async () => {
      const res = await fetch('/api/user/purchases');
      if (!res.ok) throw new Error('Failed to fetch purchases');
      const data = await res.json();
      return data.purchases || [];
    },
    enabled: !!sessionData?.user,
    staleTime: 30_000,
  });

  // Redirect if not logged in
  if (!sessionLoading && !sessionData?.user) {
    return (
      <div className="min-h-screen bg-transparent text-foreground flex items-center justify-center">
        <div className="text-center p-6 border border-border bg-card rounded-2xl max-w-sm space-y-4 shadow-md">
          <ShieldCheck className="w-8 h-8 text-amber-500 mx-auto" />
          <p className="text-xs text-muted-foreground">Authentication required to access your workspace.</p>
          <Link href="/" className="inline-flex text-xs text-amber-500 hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const user = sessionData?.user;

  return (
    <div className="min-h-screen bg-transparent text-foreground pt-28 pb-20 selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full md:w-56 shrink-0 space-y-2">
            <div className="bg-card border border-border p-5 rounded-2xl mb-5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold mb-3 border border-amber-500/20">
                {user?.name ? getInitials(user.name) : '??'}
              </div>
              <h2 className="text-sm font-semibold text-foreground truncate">{user?.name || 'User'}</h2>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email || ''}</p>
            </div>

            <nav className="space-y-0.5">
              <Link href="/dashboard" className="flex items-center gap-2.5 px-3.5 py-2.5 bg-amber-500/10 rounded-xl text-xs text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">
                <Package className="w-3.5 h-3.5" /> My Inventory
              </Link>
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center text-left gap-2.5 px-3.5 py-2.5 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl text-xs text-muted-foreground transition-colors mt-6"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">

            {/* Header */}
            <div className="space-y-1 border-b border-border pb-4">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/10 text-[9px] font-mono text-amber-600 dark:text-amber-300 uppercase tracking-wider">Workspace</span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">My Inventory</h1>
              <p className="text-xs text-muted-foreground">Manage your purchased templates and access persistent download links.</p>
            </div>

            {/* Loading State */}
            {(loading || sessionLoading) && (
              <div className="flex items-center justify-center py-20">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
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
                    const screenshotUrl = getActiveThumbnail(item);

                    return (
                      <motion.div
                        key={item.orderId}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="bg-card border border-border/80 rounded-2xl overflow-hidden hover:border-border transition-all duration-300 group shadow-sm hover:shadow-md"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">

                          {/* Thumbnail */}
                          <div className="w-16 h-16 rounded-xl bg-muted border border-border overflow-hidden shrink-0 relative">
                            <img
                              src={screenshotUrl}
                              alt={item.title}
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute bottom-1 right-1">
                              <span className="px-1 py-0.5 rounded bg-background/80 backdrop-blur-sm text-[8px] font-mono text-muted-foreground uppercase border border-border flex items-center gap-0.5">
                                {isVertical ? <Smartphone className="w-2 h-2" /> : <Monitor className="w-2 h-2" />}
                                {item.aspect}
                              </span>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-semibold text-foreground truncate">{item.title}</h3>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider shrink-0">
                                Paid
                              </span>
                            </div>
                            {item.description && (
                              <p className="text-[10px] text-muted-foreground/80 truncate max-w-lg">{item.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60 font-mono">
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
                              className="h-7 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-medium transition-colors flex items-center gap-1.5 shadow-md"
                            >
                              <Download className="w-3 h-3" /> Download .pbit
                            </Link>
                            <Link
                              href={`/template/${item.postId}`}
                              className="h-7 w-7 bg-muted hover:bg-accent border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
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
              <div className="bg-card border border-border p-12 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mb-5">
                  <LayoutDashboard className="w-6 h-6 text-muted-foreground/20" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">No Templates Acquired</h3>
                <p className="text-[11px] text-muted-foreground mb-6 max-w-xs leading-relaxed">
                  Your workspace inventory is empty. Browse the Sandbox Showroom to discover production-ready analytics frameworks.
                </p>
                <Link
                  href="/"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-purple-500 text-white text-xs font-medium rounded-xl hover:opacity-90 transition-all shadow-lg shadow-amber-500/20"
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
