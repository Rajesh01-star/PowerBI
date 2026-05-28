"use client";

import React, { useState } from 'react';
import { CATEGORIES } from '@/components/SidebarFilter';
import { ChevronDown, Tags } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminTagSelectorProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

export function AdminTagSelector({ tags, setTags }: AdminTagSelectorProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    business_domain: false,
    industry: false,
    visualization_type: false
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  return (
    <div className="space-y-3 bg-[#130B09] border border-[#3E291F] rounded-xl p-4 transition-all duration-150">
      <div className="flex items-center gap-2 mb-2">
        <Tags className="w-4 h-4 text-amber-500" />
        <h4 className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">Select Tags</h4>
      </div>

      <div className="space-y-3">
        {CATEGORIES.map((category) => (
          <div key={category.id} className="border border-[#3E291F]/50 rounded-lg overflow-hidden bg-[#0E0907]">
            <button 
              type="button"
              onClick={() => toggleSection(category.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-white/70 hover:text-amber-500 hover:bg-[#1D1412] transition-colors"
            >
              <div className="flex items-center gap-2">
                {category.icon}
                {category.label}
              </div>
              <motion.div animate={{ rotate: openSections[category.id] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.div>
            </button>
            
            <AnimatePresence initial={false}>
              {openSections[category.id] && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-[#3E291F]/30"
                >
                  <div className="flex flex-wrap gap-1.5 p-3 bg-[#130B09]/50">
                    {category.options.map((option) => {
                      const isChecked = tags.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleToggleTag(option)}
                          className={`relative px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-200 ${
                            isChecked 
                              ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                              : 'bg-[#1D1412] text-white/60 hover:text-white hover:bg-[#251A17] border border-[#3E291F]/50 hover:border-amber-500/30'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
