"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { ShowroomFilter, SortOption } from './ShowroomFilter';
import { ShowroomGrid, ShowroomGridSkeleton } from './ShowroomGrid';
import { SidebarFilter } from './SidebarFilter';
import { useUrlParam, useUrlArrayParam } from '@/lib/useUrlState';

export function Showroom({ limit }: { limit?: number }) {
  const [activeSort, setActiveSort] = useUrlParam('s', 'views');
  const [selectedTags, setSelectedTags] = useUrlArrayParam('t');

  const { data: posts = [], isLoading, isFetching } = useQuery({
    queryKey: ['public-posts', activeSort, selectedTags],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('sort', activeSort);
      if (selectedTags.length > 0) {
        params.append('tags', selectedTags.join(','));
      }
      const res = await fetch(`/api/posts?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const json = await res.json();
      return json.data || [];
    },
    placeholderData: keepPreviousData,
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <SidebarFilter selectedTags={selectedTags} onChange={setSelectedTags} />
      
      <div className='flex-1 space-y-4 w-full min-w-0'>
        {/* 1. Filter Sub-component */}
        <ShowroomFilter activeSort={activeSort as SortOption} setActiveSort={setActiveSort} />

        {/* 2. Grid Sub-component */}
        {isLoading ? (
          <ShowroomGridSkeleton count={limit || 6} />
        ) : (
          <div className="relative">
            {isFetching && (
              <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl pointer-events-none transition-all duration-300">
                <div className="bg-background/90 px-4 py-2 rounded-xl shadow-lg border border-border flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  <span className="text-xs font-mono font-medium text-foreground">SYNCING...</span>
                </div>
              </div>
            )}
            <ShowroomGrid posts={posts} limit={limit} />
          </div>
        )}
      </div>
    </div>
  );
}
