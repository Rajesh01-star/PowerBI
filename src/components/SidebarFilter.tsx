"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Briefcase, Settings, PieChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CATEGORIES = [
  {
    id: 'business_domain',
    label: 'Business Domain',
    icon: <Briefcase className="w-4 h-4" />,
    options: [
      'Sales', 'Accounting & Finance', 'Project Management', 'Marketing', 
      'Human Resources', 'Research', 'CRM', 'Support', 'Customer experience'
    ]
  },
  {
    id: 'industry',
    label: 'Industry',
    icon: <Settings className="w-4 h-4" />,
    options: [
      'Information Technology', 'Real Estate', 'Logistics', 'KPI', 'Education', 
      'Healthcare', 'Transportation', 'Banking', 'Oil & Energy', 'Ecommerce', 
      'Crime analytics', 'Retail', 'Manufacturing', 'Pharmacy', 'Sports', 'Christmas'
    ]
  },
  {
    id: 'visualization_type',
    label: 'Visualization Type',
    icon: <PieChart className="w-4 h-4" />,
    options: [
      'Donut', 'Pie', 'Combo', 'Combo Bar', 'TimeSeries', 'Timeline', 
      'Map', 'Graph', 'Network', 'Waterfall', 'Scatter', 'Bubble', 'Line'
    ]
  }
];

interface SidebarFilterProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export function SidebarFilter({ selectedTags, onChange }: SidebarFilterProps) {
  // Only the first section (Business Domain) is open by default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    business_domain: true,
    industry: false,
    visualization_type: false
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="w-64 shrink-0 border border-border bg-card/40 backdrop-blur-xl rounded-2xl p-5 h-fit hidden md:block shadow-xl shadow-black/10 relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
          <Settings className="w-3.5 h-3.5 text-amber-500" />
          Intelligence Filter
        </h3>
        {selectedTags.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground hover:text-amber-500 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className="space-y-6 relative z-10">
        {CATEGORIES.map((category) => (
          <div key={category.id} className="border-b border-border/40 pb-5 last:border-0 last:pb-0">
            <button 
              onClick={() => toggleSection(category.id)}
              className="w-full flex items-center justify-between text-xs font-bold text-foreground/90 hover:text-amber-500 transition-colors uppercase tracking-wider group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-muted-foreground group-hover:text-amber-500 transition-colors">
                  {category.icon}
                </span>
                {category.label}
              </div>
              <motion.div
                animate={{ rotate: openSections[category.id] ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-amber-500" />
              </motion.div>
            </button>
            
            <AnimatePresence initial={false}>
              {openSections[category.id] && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 mt-4">
                    {category.options.map((option) => {
                      const isChecked = selectedTags.includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => handleToggleTag(option)}
                          className={`relative px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-300 overflow-hidden group ${
                            isChecked 
                              ? 'text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                              : 'text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-transparent hover:border-border'
                          }`}
                        >
                          {isChecked && (
                            <motion.div 
                              layoutId={`bg-${category.id}-${option}`}
                              className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 z-0"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1.5">
                            {option}
                          </span>
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
