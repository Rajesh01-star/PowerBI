"use client";

import React from 'react';
import { ArrowDownWideNarrow, Eye, Clock, SortAsc, CalendarClock } from 'lucide-react';

export type SortOption = 'views' | 'newest' | 'atoz' | 'oldest';

export const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'views', label: 'Most Viewed', icon: <Eye className="w-3 h-3" /> },
  { value: 'newest', label: 'Newest First', icon: <Clock className="w-3 h-3" /> },
  { value: 'atoz', label: 'A → Z', icon: <SortAsc className="w-3 h-3" /> },
  { value: 'oldest', label: 'Oldest First', icon: <CalendarClock className="w-3 h-3" /> },
];

interface ShowroomFilterProps {
  activeSort: SortOption;
  setActiveSort: (sort: SortOption) => void;
}

export function ShowroomFilter({ activeSort, setActiveSort }: ShowroomFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 uppercase font-bold tracking-wider mr-1 shrink-0">
        <ArrowDownWideNarrow className="w-3.5 h-3.5" /> Sort
      </div>
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => setActiveSort(option.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 border ${
            activeSort === option.value
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-300 shadow-sm shadow-amber-500/10'
              : 'bg-muted border-border text-muted-foreground hover:bg-accent hover:border-border hover:text-foreground'
          }`}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}
