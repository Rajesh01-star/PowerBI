"use client";

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPublicPostsAction } from '@/app/admin/actions';
import { ShowroomFilter, SortOption } from './ShowroomFilter';
import { ShowroomGrid } from './ShowroomGrid';

export function Showroom({ limit }: { limit?: number }) {
  const [activeSort, setActiveSort] = useState<SortOption>('views');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['public-posts', activeSort],
    queryFn: () => getPublicPostsAction(activeSort),
  });

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          SYNCING CACHED FRAMEWORKS...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 1. Filter Sub-component */}
      <ShowroomFilter activeSort={activeSort} setActiveSort={setActiveSort} />

      {/* 2. Grid Sub-component */}
      <ShowroomGrid posts={posts} limit={limit} />
    </>
  );
}
