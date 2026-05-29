"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { Filter, Download, Maximize2, Share2, MoreHorizontal } from 'lucide-react';

const data = [
  { name: 'Jan', revenue: 4000, users: 2400, active: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398, active: 2210 },
  { name: 'Mar', revenue: 2000, users: 9800, active: 2290 },
  { name: 'Apr', revenue: 2780, users: 3908, active: 2000 },
  { name: 'May', revenue: 1890, users: 4800, active: 2181 },
  { name: 'Jun', revenue: 2390, users: 3800, active: 2500 },
  { name: 'Jul', revenue: 3490, users: 4300, active: 2100 },
];

// Theme is hardcoded to dark — no need for mounted/theme detection
const strokeColor = "rgba(255, 255, 255, 0.08)";
const axisColor = "rgba(255, 255, 255, 0.4)";
const tooltipBg = "#121214";
const tooltipBorder = "#27272a";
const tooltipText = "#f4f4f5";

export default function InteractivePBI() {
  return (
    <div className="w-full h-full min-h-[500px] md:min-h-[700px] bg-card text-card-foreground rounded-2xl overflow-hidden relative border border-border flex flex-col shadow-lg">

      {/* Toolbar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-muted/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="h-4 w-px bg-border mx-2" />
          <span className="text-sm font-medium text-foreground">Executive Dashboard v2.4</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-muted rounded-md transition-colors"><Filter className="w-4 h-4 text-muted-foreground" /></button>
          <button className="p-2 hover:bg-muted rounded-md transition-colors"><Download className="w-4 h-4 text-muted-foreground" /></button>
          <button className="p-2 hover:bg-muted rounded-md transition-colors"><Share2 className="w-4 h-4 text-muted-foreground" /></button>
          <button className="p-2 hover:bg-muted rounded-md transition-colors"><Maximize2 className="w-4 h-4 text-muted-foreground" /></button>
          <button className="p-2 hover:bg-muted rounded-md transition-colors"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 p-6 overflow-auto bg-muted/20">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Revenue', value: '$124.5K', trend: '+14.5%' },
            { label: 'Active Users', value: '45,231', trend: '+5.2%' },
            { label: 'Conversion Rate', value: '3.8%', trend: '-1.1%' },
            { label: 'Avg Session Time', value: '4m 32s', trend: '+12.4%' },
          ].map((kpi, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border/80 shadow-sm p-4 rounded-xl flex flex-col justify-between"
            >
              <p className="text-xs text-muted-foreground mb-1 font-medium">{kpi.label}</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-mono font-semibold">{kpi.value}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded bg-muted ${kpi.trend.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {kpi.trend}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-card border border-border/80 shadow-sm p-4 rounded-xl h-[300px]"
          >
            <h4 className="text-sm font-medium text-foreground mb-4">Revenue Overview</h4>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} vertical={false} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', color: tooltipText }} />
                <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-card border border-border/80 shadow-sm p-4 rounded-xl h-[300px]"
          >
            <h4 className="text-sm font-medium text-foreground mb-4">User Acquisition</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} vertical={false} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', color: tooltipText }} />
                <Bar dataKey="users" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
