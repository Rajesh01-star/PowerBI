"use client";

import React, { useState } from 'react';
import { ChartColumn, Loader2, Search, Filter, Users, TrendingUp, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPublicPostsAction, getMarketplaceStatsAction } from '@/app/admin/actions';
import { ShowroomFilter, SortOption } from '@/components/ShowroomFilter';
import { ShowroomGrid } from '@/components/ShowroomGrid';
import { Footer } from '@/components/Footer';
import { GooeyInput } from '@/components/ui/gooey-input';

export default function Marketplace() {
  const [activeSort, setActiveSort] = useState<SortOption>('views');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['public-posts', activeSort],
    queryFn: () => getPublicPostsAction(activeSort),
  });

  const { data: stats = { templatesCount: 2400, creatorsCount: 1000, newMonthlyReports: 100, reportViews: 1000000 } } = useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: () => getMarketplaceStatsAction(),
  });

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(0)}M+`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}k+`;
    return `${views}+`;
  };

  const statsData = [
    {
      id: "templates",
      value: stats.templatesCount,
      label: "Power BI Templates",
      icon: <ChartColumn className="w-4.5 h-4.5" />,
    },
    {
      id: "creators",
      value: stats.creatorsCount,
      label: "Active Creators",
      icon: <Users className="w-4.5 h-4.5" />,
    },
    {
      id: "new-reports",
      value: stats.newMonthlyReports,
      label: "New Reports (30d)",
      icon: <TrendingUp className="w-4.5 h-4.5" />,
    },
    {
      id: "views",
      value: stats.reportViews,
      label: "Total Views",
      icon: <Eye className="w-4.5 h-4.5" />,
    },
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

  return (
    <div className="relative w-full min-h-screen bg-transparent text-foreground overflow-x-hidden selection:bg-amber-500/30 flex flex-col justify-between">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-amber-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-amber-600/5 blur-[110px] rounded-full pointer-events-none" />

      <main className="relative z-10 flex-grow pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Hero Stats Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              Production-Grade Power BI <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">Interactive Dashboard Gallery</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Explore high-fidelity, interactive Power BI templates optimized for executive operations, financial forecasting, dynamic sales performance, and HR metrics. Instantly launch layouts, explore live embeds, and download configuration files to elevate your BI strategy.
            </p>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-5xl mx-auto text-left">
              {statsData.map((item) => (
                <div 
                  key={item.id}
                  className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-md shadow-amber-500/2 hover:border-neutral-700/60 transition-all duration-300 min-w-0"
                >
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
              ))}
            </div>
          </div>

          {/* Integrated Search, Filter, and Sort Controls in a Single Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3 border-b border-border/10 pb-3 z-30 relative w-full">
            {/* Sorting controls on the left */}
            <div className="flex items-center">
              <ShowroomFilter activeSort={activeSort} setActiveSort={setActiveSort} />
            </div>

            {/* Search and Category Filter on the right */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              {/* Gooey Search Input Container */}
              <div className="relative flex items-center justify-start min-w-[120px] z-30">
                <GooeyInput 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  placeholder="Search templates..." 
                  collapsedWidth={115}
                  expandedWidth={220}
                  expandedOffset={50}
                  gooeyBlur={5}
                />
              </div>

              {/* Categorical filter dropdown container */}
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

                {/* Dropdown Menu Popup */}
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
            <div className="w-full h-96 flex items-center justify-center">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                SYNCHRONIZING TEMPLATE INVENTORIES...
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Active Filter State Label (Shows only when not filtering All) */}
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
                    onClick={() => {
                      setActiveCategory("All");
                      setSearchQuery("");
                    }} 
                    className="text-amber-500/80 hover:text-amber-500 underline transition-colors cursor-pointer normal-case text-[9px]"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Showroom Grid rendering real filtered database templates */}
              {filteredPosts.length > 0 ? (
                <ShowroomGrid posts={filteredPosts} />
              ) : (
                <div className="w-full py-20 text-center rounded-3xl border border-dashed border-border/80 bg-card/20 backdrop-blur-xs">
                  <p className="text-xs text-muted-foreground font-mono">NO ACTIVE CONFIGURATIONS FOUND MATCHING SPECIFICATIONS</p>
                  <button 
                    onClick={() => {
                      setActiveCategory("All");
                      setSearchQuery("");
                    }} 
                    className="mt-4 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-semibold uppercase tracking-wider hover:bg-amber-500/20 transition-all cursor-pointer"
                  >
                    Reset Active Filters
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
