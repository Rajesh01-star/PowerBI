"use client";

import React, { useState } from 'react';
import { ChartColumn, Loader2, Filter, Users, TrendingUp, Eye } from 'lucide-react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getPublicPostsAction, getPublicPostsByTypeAction, getMarketplaceStatsAction } from '@/app/admin/actions';
import { ShowroomFilter, SortOption } from '@/components/ShowroomFilter';
import { ShowroomGrid, ShowroomGridSkeleton } from '@/components/ShowroomGrid';
import { GooeyInput } from '@/components/ui/gooey-input';
import { PageShell } from '@/components/shared/PageShell';
import { Pagination } from '@/components/shared/Pagination';
import { useUrlParam, useUrlNumParam } from '@/lib/useUrlState';
import { formatViews } from '@/lib/utils';

interface ProductsLayoutProps {
  title: React.ReactNode;
  description: React.ReactNode;
  statsLabel: string;
  assetType?: 'powerbi' | 'uiux';
}

const ITEMS_PER_PAGE = 12;

export function ProductsLayout({ title, description, statsLabel, assetType }: ProductsLayoutProps) {
  // URL-persisted state (shareable, bookmarkable, survives refresh)
  const [activeSort, setActiveSort] = useUrlParam('s', 'views');
  const [searchQuery, setSearchQuery] = useUrlParam('q', '');
  const [activeCategory, setActiveCategory] = useUrlParam('c', 'All');
  const [currentPage, setCurrentPage] = useUrlNumParam('p', 1);

  // Ephemeral UI state (not persisted in URL)
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['public-posts', assetType, activeSort],
    queryFn: () => assetType 
      ? getPublicPostsByTypeAction(assetType, activeSort)
      : getPublicPostsAction(activeSort),
    placeholderData: keepPreviousData,
  });

  const { data: stats = { templatesCount: 0, creatorsCount: 0, newMonthlyReports: 0, reportViews: 0 }, isLoading: isStatsLoading } = useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: () => getMarketplaceStatsAction(),
    staleTime: 5 * 60_000, // Stats change rarely
  });

  const statsData = [
    { id: "templates", value: stats.templatesCount, label: statsLabel, icon: <ChartColumn className="w-4.5 h-4.5" /> },
    { id: "creators", value: stats.creatorsCount, label: "Active Creators", icon: <Users className="w-4.5 h-4.5" /> },
    { id: "new-reports", value: stats.newMonthlyReports, label: "New Reports (30d)", icon: <TrendingUp className="w-4.5 h-4.5" /> },
    { id: "views", value: stats.reportViews, label: "Total Views", icon: <Eye className="w-4.5 h-4.5" /> },
  ];

  // Filter posts based on client-side search query and active category dropdown selection
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      !searchQuery || 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      activeCategory === "All" || 
      post.tags?.some((t: string) => t.toLowerCase() === activeCategory.toLowerCase()) ||
      post.title?.toLowerCase().includes(activeCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages || 1);
  const paginatedPosts = filteredPosts.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const clearFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <PageShell>
      <main className="relative z-10 flex-grow pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Hero Stats Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-5xl mx-auto text-left">
              {isStatsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-md shadow-amber-500/2 min-w-0 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-neutral-800/80 shrink-0"></div>
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="h-4 sm:h-5 bg-neutral-800/80 rounded w-16"></div>
                      <div className="h-2.5 bg-neutral-800/80 rounded w-24"></div>
                    </div>
                  </div>
                ))
              ) : (
                statsData.map((item) => (
                  <div key={item.id} className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-md shadow-amber-500/2 hover:border-neutral-700/60 transition-all duration-300 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-lg sm:text-xl font-bold text-foreground tracking-tight leading-none">
                        {formatViews(item.value)}
                      </div>
                      <div className="text-[8px] uppercase font-bold tracking-widest text-muted-foreground/60 leading-normal whitespace-nowrap">
                        {item.label}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Integrated Search, Filter, and Sort Controls in a Single Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3 border-b border-border/10 pb-3 z-30 relative w-full">
            <div className="flex items-center">
              <ShowroomFilter activeSort={activeSort as SortOption} setActiveSort={(s) => { setActiveSort(s); setCurrentPage(1); }} />
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="relative flex items-center justify-start min-w-[120px] z-30">
                <GooeyInput 
                  value={searchQuery}
                  onValueChange={(v) => { setSearchQuery(v); setCurrentPage(1); }}
                  placeholder="Search templates..." 
                  collapsedWidth={115}
                  expandedWidth={220}
                  expandedOffset={50}
                  gooeyBlur={5}
                />
              </div>

              <div className="relative z-30">
                <button 
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md ${
                    filterDropdownOpen 
                      ? 'bg-amber-500 border-amber-600 text-white shadow-amber-500/20'
                      : 'bg-neutral-800 border-neutral-700 text-amber-500 hover:bg-neutral-700 hover:text-amber-400 hover:border-neutral-600'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                </button>

                {filterDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-neutral-900 border border-neutral-800/80 backdrop-blur-2xl shadow-xl p-1.5 z-50 text-foreground animate-in fade-in zoom-in duration-200">
                    <div className="px-3 py-1.5 border-b border-neutral-850 mb-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 font-mono">Category Filter</div>
                    </div>
                    <div className="space-y-0.5">
                      {["All", "Finance", "Sales", "HR", "Marketing", "Operations", "IT"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveCategory(cat);
                            setCurrentPage(1);
                            setFilterDropdownOpen(false);
                          }}
                          className={`w-full flex items-center px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left ${
                            activeCategory === cat
                              ? 'bg-amber-500/10 text-amber-500 font-semibold'
                              : 'text-foreground/70 hover:text-foreground hover:bg-neutral-800'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Real-time filters and live posts grid */}
          {isLoading ? (
            <div className="space-y-3">
              <ShowroomGridSkeleton count={6} />
            </div>
          ) : (
            <div className="space-y-3 flex flex-col min-h-[500px]">
              {/* Active Filter State Label */}
              {(activeCategory !== "All" || searchQuery) && (
                <div className="flex items-center gap-2 flex-wrap text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2">
                  <span>Filtered by:</span>
                  {activeCategory !== "All" && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500">
                      Category: {activeCategory}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500">
                      Search: &ldquo;{searchQuery}&rdquo;
                    </span>
                  )}
                  <button 
                    onClick={clearFilters} 
                    className="text-amber-500/80 hover:text-amber-500 underline transition-colors cursor-pointer normal-case text-[9px]"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Showroom Grid */}
              {paginatedPosts.length > 0 ? (
                <div className="flex-1">
                  <ShowroomGrid posts={paginatedPosts} />
                </div>
              ) : (
                <div className="w-full py-20 text-center rounded-3xl border border-dashed border-border/80 bg-card/20 backdrop-blur-xs flex-1 flex flex-col items-center justify-center">
                  <p className="text-xs text-muted-foreground font-mono">NO ACTIVE CONFIGURATIONS FOUND MATCHING SPECIFICATIONS</p>
                  <button 
                    onClick={clearFilters} 
                    className="mt-4 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-semibold uppercase tracking-wider hover:bg-amber-500/20 transition-all cursor-pointer"
                  >
                    Reset Active Filters
                  </button>
                </div>
              )}
              
              {/* Pagination Controls */}
              <Pagination 
                currentPage={safePage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </div>
          )}

        </div>
      </main>
    </PageShell>
  );
}
